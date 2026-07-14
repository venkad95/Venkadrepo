const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { emailVerificationSent, forgotPasswordEmail } = require('../commonServices/emailService');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.UserDetails.findOne({
      where: { email, status: true }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Email'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Password'
      });
    }
    const accessToken = jwt.sign(
      {
        userId: user.uuid,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      { userId: user.uuid },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '2d' }
    );

    await db.UserDetails.update(
      { accessToken, refreshToken },
      { where: { uuid: user.uuid } }
    );

    return res.status(200).json({
      success: true,
      message: 'Login Successful',
      accessToken,
      refreshToken,
      user: {
        uuid: user.uuid,
        firstName: user.firstName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.signup = async (req, res) => {
  try {
    console.log(req.body);

    const {
      firstName,
      lastName,
      mobileNumber,
      email,
      password,
    } = req.body;
    let roleName;
    if (req.body.role) {
      roleName = req.body.role;
    }

    // Check existing user
    const existingUser = await db.UserDetails.findOne({
      where: { email }
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Create user
    const user = await db.UserDetails.create({
      firstName,
      lastName,
      mobileNumber,
      email,
      password: hashedPassword,
      role: roleName || 'client',
      status: false
    });
    await db.AcknowledgeDetails.create(
      {
        user_id: user.uuid, 
        otp, isAcknowledged: false,
        otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    );
    // const sendAck = await emailVerificationSent(email, otp);
    // if (sendAck) {
      await db.AcknowledgeDetails.update({ isAcknowledged: true }, { where: { user_id: user.uuid } });
    // }
    return res.status(201).json({
      success: true,
      data: otp,
      // message: 'Otp sent your registered email, kindly check you spam folder!!',
      message: `Please enter this OTP ${otp} and verify your account`
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.otpVerify = async (req, res) => {
  const { otp } = req.body;
  try {
    const optDetail = await db.AcknowledgeDetails.findOne({ where: { otp: otp } });
    const isOtpExpired = new Date() > new Date(optDetail.otpExpiresAt);

    if (isOtpExpired) {
      await db.AcknowledgeDetails.destroy({ where: { otp: otp } });
      return res.status(401).json({
        success: false,
        message: 'OTP Expired'
      });
    }
    if (!optDetail) {
      return res.status(401).json({
        success: false,
        message: 'Invalid OTP'
      });
    }
    const getUserDetails = await db.UserDetails.findOne({ where: { uuid: optDetail.user_id } });
    const accessToken = jwt.sign(
      {
        userId: getUserDetails.uuid,
        email: getUserDetails.email,
        role: getUserDetails.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      { userId: getUserDetails.uuid },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '2d' }
    );

    await db.UserDetails.update(
      { accessToken, refreshToken, status :true },
      { where: { uuid: getUserDetails.uuid } }
    );
    await db.AcknowledgeDetails.destroy({ where: { otp: otp } });
    return res.status(200).json({
      success: true,
      message: 'Login Successful',
      accessToken,
      refreshToken,
      user: {
        uuid: getUserDetails.uuid,
        firstName: getUserDetails.firstName,
        email: getUserDetails.email,
        role: getUserDetails.role
      }
    });
  }
  catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

exports.getOverAllDashboardList = async (req, res) => {
  try {
    const usersList = await db.UserDetails.findAll({
      where: { role: 'client', status:true },
      attributes: {
        exclude: ['password', 'accessToken', 'refreshToken', 'inviteId', 'updatedAt']
      }
    });

    const getDashboard = await db.UserDetails.findAll({
      where: { role: 'client' , status:true},
      include: [
        {
          model: db.ProductDetails,
          as: 'ProductDetails', // Use the alias defined in the association
          attributes: [],
          required: false
        },
        // include: [
          {
            model: db.Payments,
            as: 'Payments', // Use the alias defined in the association
            attributes: [],
            required: false,
            where:{payment_status: 'completed'}
          }
        // ],
      ],
      attributes: [
        [db.sequelize.fn('COALESCE', db.sequelize.fn('SUM', db.sequelize.col('ProductDetails.total_liters')), 0), 'totalLiters'],
        [db.sequelize.fn('COALESCE', db.sequelize.fn('SUM', db.sequelize.col('ProductDetails.purchased_liter_amount')), 0), 'totalAmount'],
        [
          db.sequelize.fn(
            'COALESCE',
            db.sequelize.fn(
              'SUM',
              db.sequelize.literal(`CASE WHEN "Payments"."payment_status" = 'completed' THEN "Payments"."final_amount" ELSE 0 END`)
            ),
            0
          ),
          'paidAmount',
        ],
        [db.sequelize.fn('COUNT', db.sequelize.fn('DISTINCT', db.sequelize.col('UserDetails.uuid'))), 'totalClients']
      ],
      raw: true,
      logging: console.log,
    });

    if (usersList || getDashboard) {
      return res.json({
        users: {
          usersList: usersList,
          dashboardData: {
            getDashboard
          }
        }
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const userExits = await db.UserDetails.findOne({ where: { uuid: req.user.userId } });
    if (!userExits) {
      return;
    }
    await userExits.update({ accessToken: null, refreshToken: null });
    return res.status(200).json({
      success: true,
      message: 'Logout Successful',
    });
  }
  catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await db.UserDetails.findOne({ where: { email, status:true } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User with this email does not exist',
      });
    }

    // Generate a reset token
    const resetToken = jwt.sign(
      { userId: user.uuid },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Save the reset token in the database (optional)
    await db.AcknowledgeDetails.create({
      user_id: user.uuid,
      otp: resetToken,
      acknowledge_type: 'reset_password',
      otpExpiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
      isAcknowledged: false,
    });

    // Send the reset password email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await forgotPasswordEmail(user,resetLink);
    return res.status(200).json({
      success: true,
      message: 'Reset password link sent to your email',
    });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request',
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  // Validate input
  if (!token || !password) {
    return res.status(400).json({
      success: false,
      message: 'Token and new password are required',
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the token's payload
    const user = await db.UserDetails.findOne({ where: { uuid: decoded.userId } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await user.update({ password: hashedPassword });

    // Optionally, delete the reset token from the database
    await db.AcknowledgeDetails.destroy({ where: { user_id: user.uuid, otp: token } });

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while resetting your password',
    });
  }
};