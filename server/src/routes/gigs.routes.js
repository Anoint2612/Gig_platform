const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
    createGig,
    getGigs,
    getGigById,
    updateGig,
} = require('../controllers/gigs.controller');

const router = express.Router();

router.route('/')
    .get(getGigs)
    .post(protect, createGig);

router.route('/:id')
    .get(getGigById)
    .patch(protect, updateGig);

module.exports = router;
