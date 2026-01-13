const Bid = require('../models/Bid');
const Gig = require('../models/Gig');

// @desc    Create a new bid
// @route   POST /api/bids
// @access  Private (Freelancer)
const createBid = async (req, res) => {
    try {
        const { gigId, message, price } = req.body;

        if (!gigId || !message || !price) {
            return res.status(400).json({ message: 'Please provide gigId, message, and price' });
        }

        const gig = await Gig.findById(gigId);
        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }

        // Check if gig is open
        if (gig.status !== 'open') {
            return res.status(400).json({ message: 'Cannot bid on a gig that is not open' });
        }

        // Prevent owner from bidding on their own gig
        if (gig.ownerId.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Owner cannot bid on their own gig' });
        }

        const bid = await Bid.create({
            gigId,
            freelancerId: req.user._id,
            message,
            price,
        });

        res.status(201).json(bid);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You have already placed a bid on this gig' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get bids for a specific gig
// @route   GET /api/bids/:gigId
// @access  Private (Gig Owner)
const getBidsByGigId = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.gigId);

        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }

        // Check if user is the owner of the gig
        // Note: Depending on requirements, maybe freelancers can see their own bids?
        // For now, strictly following "gig owners to list bids".
        if (gig.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view bids for this gig' });
        }

        const bids = await Bid.find({ gigId: req.params.gigId })
            .populate('freelancerId', 'email')
            .sort({ createdAt: -1 });

        res.json(bids);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createBid,
    getBidsByGigId,
};
