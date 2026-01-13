const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['hired', 'bid_received', 'gig_update'],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    data: {
        type: Object, // Store related IDs like gigId, bidId
    },
    read: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Notification', notificationSchema);
