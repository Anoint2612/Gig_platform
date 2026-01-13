const mongoose = require('mongoose');
const Bid = require('../models/Bid');
const Gig = require('../models/Gig');

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

        await session.commitTransaction();
        session.endSession();

        return { gig, bid };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

module.exports = { hireFreelancerService };
