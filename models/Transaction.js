// models/Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    reservation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HallReservation",
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    authority: {
        type: String,
        required: true,
        unique: true
    },
    ref_id: {
        type: String,
        sparse: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    payment_method: {
        type: String,
        enum: ['zarinpal', 'melli', 'cash'],
        default: 'zarinpal'
    },
    payment_data: {
        type: Object,
        default: {}
    },
    ip: String,
    user_agent: String,
    paid_at: Date,
    failed_at: Date
}, {
    timestamps: true
});

module.exports = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);