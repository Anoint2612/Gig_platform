const mongoose = require('mongoose');
const Bid = require('../models/Bid');
const Gig = require('../models/Gig');
const Notification = require('../models/Notification');
const { getIO } = require('../sockets');

const hireFreelancerService = async (bidId, ownerId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const bid = await Bid.findById(bidId).session(session);
        if (!bid) {
            throw new Error('Bid not found');
        }

        const gig = await Gig.findById(bid.gigId).session(session);
        if (!gig) {
            throw new Error('Gig not found');
        }

        // Check ownership
        if (gig.ownerId.toString() !== ownerId.toString()) {
            throw new Error('Not authorized to hire for this gig');
        }

        // Check gig status
        if (gig.status !== 'open') {
            throw new Error('Gig is not open for hiring');
        }

        // 1. Update Gig
        gig.status = 'in_progress';
        gig.assignedBidId = bid._id;
        await gig.save({ session });

        // 2. Update Chosen Bid
        bid.status = 'accepted';
        await bid.save({ session });

        // 3. Reject other bids
        await Bid.updateMany(
            { gigId: gig._id, _id: { $ne: bid._id } },
            { status: 'rejected' },
            { session }
        );

        // 4. Create Notification
        const notification = new Notification({
            recipientId: bid.freelancerId,
            type: 'hired',
            message: `You have been hired for the gig: ${gig.title}`,
            data: { gigId: gig._id, gigTitle: gig.title },
        });
        await notification.save({ session });

        await session.commitTransaction();
        session.endSession();

        // 5. Emit Socket Event (after commit)
        try {
            const io = getIO();
            io.to(bid.freelancerId.toString()).emit('hired', {
                gigId: gig._id,
                title: gig.title,
                message: `You have been hired for the gig: ${gig.title}`,
            });
        } catch (socketError) {
            console.error('Socket emission failed:', socketError.message);
            // Don't fail the transaction if socket fails
        }

        return { gig, bid };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

module.exports = { hireFreelancerService };
