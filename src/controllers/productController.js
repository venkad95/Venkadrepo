const db = require('../models');

exports.createProductEntry = async (req, res) =>{
    const {product_name, product_qty, buying_date} = req.body;
    if(req.user){
        req.body.userId = req.user.userId;
    }
    const entryDetails = await db.ProductDetails.create({
        user_id: req.body.userId,
        product_name,
        product_qty,
        buying_date
    })
    if(entryDetails){
        return res.status(201).json({
            success: true,
            message: 'Added successfully',
        });
    }
}

exports.getProductDetails = async (req, res) =>{  
    const getDetails = await db.ProductDetails.findAll({where: {user_id : req.user.userId}});
    if(getDetails){
        return res.status(201).json({
            success: true,
            data:{
                getDetails
            }
        });
    }
}