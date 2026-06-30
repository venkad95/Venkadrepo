const db = require('../models');
const Op = db.Sequelize.Op;

exports.createProductEntry = async (req, res) => {
    const { product_name, morning_qty, evening_qty, buying_date } = req.body;
    // Sanitize and validate input
    const sanitizedMorningQty = morning_qty && morning_qty.trim() !== '' ? Number(morning_qty) : 0; // Convert to number or default to 0
    const sanitizedEveningQty = evening_qty && evening_qty.trim() !== '' ? Number(evening_qty) : 0; // Convert to number or default to 0
    const totalLiters = sanitizedMorningQty + sanitizedEveningQty;
    try {
        if (req.user) {
            req.body.userId = req.user.userId;
        }
        const checkProductRate = await db.ProductMaster.findOne({ where: { user_id: req.body.userId } });
        if(!checkProductRate) {
            return res.status(400).json({
                success: false,
                message: 'Please contact admin and configure product rate first'
            });
        }

        // Check if an entry already exists for the same date
        const existingEntry = await db.ProductDetails.findOne({
            where: {
                user_id: req.body.userId,
                buying_date: new Date(buying_date) // Ensure the date matches
            }
        });

        if (existingEntry) {
            return res.status(400).json({
                success: false,
                message: 'An entry for this date already exists. Please update the existing entry or choose a different date.'
            });
        }

        const entryDetails = await db.ProductDetails.create({
            user_id: req.body.userId,
            product_name,
            morning_qty: sanitizedMorningQty,
            evening_qty: sanitizedEveningQty,
            buying_date,
            total_liters: totalLiters,
            purchased_liter_amount: totalLiters * checkProductRate.perliter_rate,
            perliter_rate: checkProductRate.perliter_rate || null
        })
        if (entryDetails) {
            return res.status(201).json({
                success: true,
                message: 'Added successfully',
            });
        }
    }
    catch (err) {
        console.log(err);

    }
}

exports.productRateConfigureToUser = async (req, res) => {
    const { product_name, perliter_rate, userId } = req.body;
    try {
        const entryDetails = await db.ProductMaster.create({
            user_id: userId,
            product_name,
            perliter_rate
        })
        // const existOrder = await db.ProductDetails.findOne({ where: { user_id: userId } });        
        // await db.ProductDetails.update({perliter_rate : perliter_rate,purchased_liter_amount: existOrder?.total_liters * perliter_rate.perliter_rate,}, {where: {user_id: userId}});
        if (entryDetails) {
            return res.status(201).json({
                success: true,
                message: 'Configured successfully',
            });
        }
    }
    catch (err) {
        console.log(err);
    }
}

exports.updateProductQuantities = async (req, res) => {
    const { uuid } = req.params; // Product entry UUID
    const { morning_qty, evening_qty } = req.body;

    try {
        const findRecod = await db.ProductDetails.findOne({ where: { uuid } });
        if (!findRecod) {
            return res.status(404).json({
                success: false,
                message: 'Product entry not found'
            });
        }

        // Update only provided fields and recalculate totals
        const updatedMorningQty = morning_qty !== undefined && morning_qty !== null && morning_qty.toString().trim() !== '' ? Number(morning_qty) : findRecod.morning_qty;
        const updatedEveningQty = evening_qty !== undefined && evening_qty !== null && evening_qty.toString().trim() !== '' ? Number(evening_qty) : findRecod.evening_qty;
        const newTotalLiters = updatedMorningQty + updatedEveningQty;     
        const [updated] = await db.ProductDetails.update(
            {
                morning_qty: updatedMorningQty,
                evening_qty: updatedEveningQty,
                total_liters: newTotalLiters,
                purchased_liter_amount: newTotalLiters * 40 // Assuming 40 is the rate per liter
            },
            {
                where: { uuid }
            }
        );

        if (updated) {
            return res.status(200).json({
                success: true,
                message: 'Product quantities updated successfully'
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Product entry not found'
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while updating product quantities'
        });
    }
};

exports.getProductDetails = async (req, res) => {
    try {
        const data = await db.ProductDetails.findAll({
            where: { user_id: req.query.userid ? req.query.userid : req.user.userId },
            attributes: [
            'product_name',
            [
                db.sequelize.fn(
                "TO_CHAR",
                db.sequelize.col("buying_date"),
                "Mon-YYYY"
                ),
                "month"
            ],
            [
                db.sequelize.fn(
                "SUM",
                db.sequelize.col("total_liters")
                ),
                "total_liters"
            ],
            [db.sequelize.fn("SUM", db.sequelize.col("purchased_liter_amount")), "amount"],
            [
                db.sequelize.fn(
                "COUNT",
                db.sequelize.col("uuid")
                ),
                "total_days"
            ]
            ],
            group: [
            "product_name",
            db.sequelize.fn(
                "TO_CHAR",
                db.sequelize.col("buying_date"),
                "Mon-YYYY"
            )
            ],
            order: [
            [db.sequelize.literal('"month"'), "DESC"]
            ]
        });

        const dashboard = await db.ProductDetails.findAll({
            where: { user_id: req.query.userid ? req.query.userid : req.user.userId },
            attributes: [
            [db.sequelize.fn("COUNT", db.sequelize.col("uuid")), "total_days"],
            [db.sequelize.fn("SUM", db.sequelize.col("purchased_liter_amount")), "total_amount"],
            [db.sequelize.fn("SUM", db.sequelize.col("total_liters")), "total_liters"]
            ],
            raw: true
        });
        
        return res.json({users: {
            usersList: data,
            dashboardData: {
                dashboard
            }
          }});
    }
    catch (err) {
        console.log(err);

    }
}

exports.getMonthHistory = async (req, res) => {
    console.log(req.query);
    
    const { month } = req.params;
    const { page = 1, limit = 10 } = req.query; // Default page = 1, limit = 10
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    try {
        const offset = (page - 1) * limit;
        const totaData = await db.ProductDetails.findAll({
            attributes: ['uuid'],
            where: {
                [Op.and]: [{
                    buying_date: {
                        [Op.gte]: startDate,
                        [Op.lt]: endDate
                    }
                },
                { user_id: req.query.userid ? req.query.userid : req.user.userId }]
            },
        });
        const data = await db.ProductDetails.findAll({
            attributes: ['uuid', 'user_id', 'product_name', 'morning_qty', 'evening_qty', 'buying_date', 'updatedAt', 'purchased_liter_amount'],
            where: {
                [Op.and]: [{
                    buying_date: {
                        [Op.gte]: startDate,
                        [Op.lt]: endDate
                    }
                },
                { user_id: req.query.userid ? req.query.userid : req.user.userId }]
            },
            order: [
                ["buying_date", "DESC"]],
                limit: parseInt(limit), // Number of records per page
                offset: parseInt(offset)
            
        });

        // return res.json(data);

        return res.json({
            success: true,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totaData.length / limit),
            totalRecords: totaData.count,
            data: data
        });
    }
    catch (err) {
        console.log(err);

    }
};