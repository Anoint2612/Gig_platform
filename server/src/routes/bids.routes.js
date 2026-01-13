const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
    createBid,
    getBidsByGigId,
    getMyBids,
    hireFreelancer,
} = require('../controllers/bids.controller');

const router = express.Router();

router.post('/', protect, createBid);
router.get('/my-bids', protect, getMyBids);
router.get('/:gigId', protect, getBidsByGigId);
router.patch('/:bidId/hire', protect, hireFreelancer);

module.exports = router;
