const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
    createBid,
    getBidsByGigId,
} = require('../controllers/bids.controller');

const router = express.Router();

router.post('/', protect, createBid);
router.get('/:gigId', protect, getBidsByGigId);

module.exports = router;
