const db = require('../models');
const Op = db.Sequelize.Op;

exports.createProductEntry = async (req, res) => {
    const { product_name, morning_qty, evening_qty, buying_date } = req.body;
    const totalLiters = Number(morning_qty) + Number(evening_qty);
    try{
        if (req.user) {
            req.body.userId = req.user.userId;
        }
        const entryDetails = await db.ProductDetails.create({
            user_id: req.body.userId,
            product_name,
            morning_qty,
            evening_qty,
            buying_date,
            total_liters: totalLiters,
            purchased_liter_amount: totalLiters * 40,
            perliter_rate: 40
        })
        if (entryDetails) {
            return res.status(201).json({
                success: true,
                message: 'Added successfully',
            });
        }
    }
    catch(err){
        console.log(err);
        
    }
}

exports.getProductDetails = async (req, res) => {
    console.log(req.query.userid);
    
    try{
        const data = await db.ProductDetails.findAll({
            where:{user_id: req.query.userid ? req.query.userid : req.user.userId},
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
    
        return res.json(data);
    }
    catch(err){
        console.log(err);
        
    }
}

exports.getMonthHistory = async (req, res) => {
    const { month } = req.params;
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    
    try{
        const data = await db.ProductDetails.findAll({
            attributes :['uuid','user_id','product_name','morning_qty', 'evening_qty', 'buying_date','updatedAt','purchased_liter_amount'],
            where: {[Op.and] : [{
                buying_date: {
                    [Op.gte] : startDate,
                    [Op.lt] :endDate
                }},
                {user_id: req.query.userid ? req.query.userid : req.user.userId}]
            },
            order: [
                ["buying_date", "DESC"]
            ]
        });
    
        return res.json(data);
    }
    catch(err){
        console.log(err);
        
    }
};