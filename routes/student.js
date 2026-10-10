const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authController = require('../controllers/authController');

// All student routes require authentication and student privileges
router.use(authController.verifyToken);
router.use(authController.isStudent);

/**
 * @route   GET /api/student/tests
 * @desc    Get all available tests for student
 * @access  Private (Student only)
 */
router.get('/tests', studentController.getAvailableTests);

/**
 * @route   GET /api/student/tests/:id
 * @desc    Get test details with questions (for taking test)
 * @access  Private (Student only)
 */
router.get('/tests/:id', studentController.getTestForTaking);

/**
 * @route   POST /api/student/submit-test
 * @desc    Submit test answers
 * @access  Private (Student only)
 */
router.post('/submit-test', studentController.submitTest);

/**
 * @route   GET /api/student/results
 * @desc    Get student's test results
 * @access  Private (Student only)
 */
router.get('/results', studentController.getMyResults);

/**
 * @route   GET /api/student/results/:id
 * @desc    Get detailed result for a specific test
 * @access  Private (Student only)
 */
router.get('/results/:id', studentController.getResultDetails);

module.exports = router;