const db = require('../models');
const Op = db.Sequelize.Op;

exports.getPaymentDetails = async (req, res) => {
    try {
        const { from_date, to_date } = req.query;
        const userId = req.user.userId;

        if (!from_date || !to_date) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both from_date and to_date in the query parameters.'
            });
        }

        const paymentDetails = await db.Payments.findOne({
            where: {
                user_id: userId,
                from_date: {
                    [Op.gte]: new Date(from_date)
                },
                to_date: {
                    [Op.lte]: new Date(to_date)
                }
            }
        });

        return res.status(200).json({
            success: true,
            data: paymentDetails
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching payment details.'
        });
    }
}

exports.updateAdvancePayment = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { advance_payment } = req.body;

        if (!advance_payment) {
            return res.status(400).json({
                success: false,
                message: 'Please provide advance_payment in the request body.'
            });
        }

        const paymentRecord = await db.Payment.findOne({ where: { uuid } });

        if (!paymentRecord) {
            return res.status(404).json({
                success: false,
                message: 'Payment record not found.'
            });
        }

        paymentRecord.advance_payment = advance_payment;
        await paymentRecord.save();

        return res.status(200).json({
            success: true,
            message: 'Advance payment updated successfully.',
            data: paymentRecord
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while updating advance payment.'
        });
    }
}

exports.updatePaymentDetails = async(req, res) => {
    try {
        const { uuid } = req.params;
        const { total_amount, payment_status, final_amount } = req.body;

        const paymentRecord = await db.Payment.findOne({ where: { uuid } });

        if (!paymentRecord) {
            return res.status(404).json({
                success: false,
                message: 'Payment record not found.'
            });
        }

        // Update only the provided fields
        if (total_amount !== undefined) paymentRecord.total_amount = total_amount;
        if(final_amount !== undefined) paymentRecord.final_amount = final_amount;
        if (payment_status !== undefined) paymentRecord.payment_status = 'pending'; // Set to 'pending' if not provided
        await paymentRecord.save();

        return res.status(200).json({
            success: true,
            message: 'Payment details updated successfully.',
            data: paymentRecord
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while updating payment details.'
        });
    }
}

exports.saveFinalPayment = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { final_amount, payment_status, paid_by , partial_payment} = req.body;

        const paymentRecord = await db.Payment.findOne({ where: { uuid } });

        if (!paymentRecord) {
            return res.status(404).json({
                success: false,
                message: 'Payment record not found.'
            });
        }
        if(final_amount){
            if (final_amount !== undefined) paymentRecord.final_amount = final_amount;
            if (payment_status !== undefined) paymentRecord.payment_status = 'success';
            if (paid_by !== undefined) paymentRecord.paid_by = paid_by;
        }
        else if(partial_payment){
            if (partial_payment !== undefined) paymentRecord.partial_payment = partial_payment;
            paymentRecord.final_amount = paymentRecord.total_amount - paymentRecord.advance_payment - paymentRecord.partial_payment;
            if (payment_status !== undefined) paymentRecord.payment_status = 'pending';
            if (paid_by !== undefined) paymentRecord.paid_by = paid_by;
        }
        // Update only the provided fields
        await paymentRecord.save();

        return res.status(200).json({
            success: true,
            message: 'Final payment details saved successfully.',
            data: paymentRecord
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while saving final payment details.'
        });
    }
}