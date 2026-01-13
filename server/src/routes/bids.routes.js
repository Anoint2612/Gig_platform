const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
    createBid,
    getBidsByGigId,
    hireFreelancer,
} = require('../controllers/bids.controller');

const router = express.Router();

router.post('/', protect, createBid);
router.get('/:gigId', protect, getBidsByGigId);
router.patch('/:bidId/hire', protect, hireFreelancer);

module.exports = router;
