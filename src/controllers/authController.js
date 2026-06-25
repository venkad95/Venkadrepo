const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../commonServices/emailService');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.UserDetails.findOne({
      where: { email }
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
      {user_id: user.uuid, otp, isAcknowledged: false,  // 10 mins
      },
    );
    // {user_id: user.uuid, otp, isAcknowledged: false, , // 10 mins
    const sendAck = await sendEmail(email, otp);
    if(sendAck) {
      await db.AcknowledgeDetails.update({isAcknowledged: true}, {where: {user_id: user.uuid}});
    }
    return res.status(201).json({
      success: true,
      message: 'Otp sent your registered email!!',
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
      { accessToken, refreshToken },
      { where: { uuid: getUserDetails.uuid } }
    );
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
  const usersList = await db.UserDetails.findAll({
    where: { role: 'client' },
    attributes: {
      exclude: ['password', 'accessToken', 'refreshToken', 'inviteId', 'updatedAt']
    }
  });
  const getDashboard = await db.UserDetails.findAll({
    where: { role: 'client' },
    include: [
      {
        model: db.ProductDetails,
        attributes: [],
        required: false
      }
    ],
    attributes: [
      [db.sequelize.fn('COALESCE', db.sequelize.fn('SUM', db.sequelize.col('ProductDetails.total_liters')), 0), 'totalLiters'],
      [db.sequelize.fn('COALESCE', db.sequelize.fn('SUM', db.sequelize.col('ProductDetails.total_amount')), 0), 'totalAmount'],
      [db.sequelize.fn('COUNT', db.sequelize.fn('DISTINCT', db.sequelize.col('UserDetails.uuid'))), 'totalClients']
    ],
    group: ['UserDetails.uuid'],
    raw: true
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
}

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