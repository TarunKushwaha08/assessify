const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @route   POST /api/auth/login
 * @desc    Login user (student/teacher)
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authController.verifyToken, authController.logout);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post('/change-password', authController.verifyToken, authController.changePassword);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify if token is valid
 * @access  Private
 */
router.get('/verify', authController.verifyToken, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

module.exports = router;