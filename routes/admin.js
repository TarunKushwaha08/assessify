const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const questionController = require('../controllers/questionController');
const testController = require('../controllers/testController');
const authController = require('../controllers/authController');

// All admin routes require authentication and teacher privileges
router.use(authController.verifyToken);
router.use(authController.isTeacher);

// ========== STUDENT ROUTES ==========

/**
 * @route   POST /api/admin/create-student
 * @desc    Create a new student account
 * @access  Private (Teacher only)
 */
router.post('/create-student', adminController.createStudent);

/**
 * @route   GET /api/admin/students
 * @desc    Get all students
 * @access  Private (Teacher only)
 */
router.get('/students', adminController.getAllStudents);

/**
 * @route   GET /api/admin/students/:id
 * @desc    Get student by ID
 * @access  Private (Teacher only)
 */
router.get('/students/:id', adminController.getStudentById);

/**
 * @route   PUT /api/admin/students/:id
 * @desc    Update student information
 * @access  Private (Teacher only)
 */
router.put('/students/:id', adminController.updateStudent);

/**
 * @route   DELETE /api/admin/students/:id
 * @desc    Delete student account
 * @access  Private (Teacher only)
 */
router.delete('/students/:id', adminController.deleteStudent);

/**
 * @route   PUT /api/admin/students/:id/status
 * @desc    Update student status (active/inactive)
 * @access  Private (Teacher only)
 */
router.put('/students/:id/status', adminController.updateStudentStatus);

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard statistics
 * @access  Private (Teacher only)
 */
router.get('/stats', adminController.getStats);

// ========== QUESTION ROUTES ==========

/**
 * @route   POST /api/admin/questions
 * @desc    Create a new question
 * @access  Private (Teacher only)
 */
router.post('/questions', questionController.createQuestion);

/**
 * @route   GET /api/admin/questions
 * @desc    Get all questions with optional filters
 * @access  Private (Teacher only)
 */
router.get('/questions', questionController.getAllQuestions);

/**
 * @route   GET /api/admin/questions/stats
 * @desc    Get question statistics
 * @access  Private (Teacher only)
 */
router.get('/questions/stats', questionController.getQuestionStats);

/**
 * @route   GET /api/admin/questions/:id
 * @desc    Get question by ID
 * @access  Private (Teacher only)
 */
router.get('/questions/:id', questionController.getQuestionById);

/**
 * @route   PUT /api/admin/questions/:id
 * @desc    Update question
 * @access  Private (Teacher only)
 */
router.put('/questions/:id', questionController.updateQuestion);

/**
 * @route   DELETE /api/admin/questions/:id
 * @desc    Delete question
 * @access  Private (Teacher only)
 */
router.delete('/questions/:id', questionController.deleteQuestion);

// ========== TEST ROUTES ==========

/**
 * @route   POST /api/admin/tests
 * @desc    Create a new test
 * @access  Private (Teacher only)
 */
router.post('/tests', testController.createTest);

/**
 * @route   GET /api/admin/tests
 * @desc    Get all tests
 * @access  Private (Teacher only)
 */
router.get('/tests', testController.getAllTests);

/**
 * @route   GET /api/admin/tests/:id
 * @desc    Get test by ID with questions
 * @access  Private (Teacher only)
 */
router.get('/tests/:id', testController.getTestById);

/**
 * @route   PUT /api/admin/tests/:id/status
 * @desc    Update test status
 * @access  Private (Teacher only)
 */
router.put('/tests/:id/status', testController.updateTestStatus);

/**
 * @route   DELETE /api/admin/tests/:id
 * @desc    Delete test
 * @access  Private (Teacher only)
 */
router.delete('/tests/:id', testController.deleteTest);

module.exports = router;