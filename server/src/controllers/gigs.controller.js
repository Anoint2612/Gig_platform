const Gig = require('../models/Gig');

// @desc    Create a new gig
// @route   POST /api/gigs
// @access  Private
const createGig = async (req, res) => {
    try {
        const { title, description, budget } = req.body;

        if (!title || !description || !budget) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const gig = await Gig.create({
            title,
            description,
            budget,
            ownerId: req.user._id,
        });

        res.status(201).json(gig);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all gigs (with search and pagination)
// @route   GET /api/gigs
// @access  Public
const getGigs = async (req, res) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;
        const query = {};

        if (q) {
            query.$text = { $search: q };
        }

        const gigs = await Gig.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate('ownerId', 'email'); // Populate owner info if needed

        const total = await Gig.countDocuments(query);

        res.json({
            gigs,
            page: Number(page),
            pages: Math.ceil(total / limit),
            total,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get gig by ID
// @route   GET /api/gigs/:id
// @access  Public
const getGigById = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id).populate('ownerId', 'email');

        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }

        res.json(gig);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Gig not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update gig
// @route   PATCH /api/gigs/:id
// @access  Private (Owner only)
const updateGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);

        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }

        // Check ownership
        if (gig.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this gig' });
        }

        const updatedGig = await Gig.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedGig);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createGig,
    getGigs,
    getGigById,
    updateGig,
};
