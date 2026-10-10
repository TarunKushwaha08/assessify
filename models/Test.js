const db = require('../config/db');

const Test = {
    /**
     * Create a new test
     */
    create: (testData) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO tests 
                (test_name, description, duration, total_marks, passing_marks, subject, created_by, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
            `;
            
            const values = [
                testData.testName,
                testData.description,
                testData.duration,
                testData.totalMarks,
                testData.passingMarks,
                testData.subject,
                testData.createdBy
            ];
            
            db.query(query, values, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ id: result.insertId, ...testData });
            });
        });
    },

    /**
     * Add questions to a test
     */
    addQuestions: (testId, questionIds) => {
        return new Promise((resolve, reject) => {
            if (!questionIds || questionIds.length === 0) {
                return resolve([]);
            }

            const values = questionIds.map((qId, index) => [testId, qId, index + 1]);
            const query = `
                INSERT INTO test_questions (test_id, question_id, question_order)
                VALUES ?
            `;
            
            db.query(query, [values], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    /**
     * Get all tests
     */
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT t.*, u.name as created_by_name,
                       (SELECT COUNT(*) FROM test_questions WHERE test_id = t.id) as question_count
                FROM tests t
                LEFT JOIN users u ON t.created_by = u.id
                WHERE t.status != 'archived'
                ORDER BY t.created_at DESC
            `;
            
            db.query(query, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    /**
     * Get test by ID
     */
    findById: (testId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT t.*, u.name as created_by_name,
                       (SELECT COUNT(*) FROM test_questions WHERE test_id = t.id) as question_count
                FROM tests t
                LEFT JOIN users u ON t.created_by = u.id
                WHERE t.id = ?
                LIMIT 1
            `;
            
            db.query(query, [testId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0] || null);
            });
        });
    },

    /**
     * Get test questions
     */
    getTestQuestions: (testId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT q.*, tq.question_order
                FROM test_questions tq
                JOIN questions q ON tq.question_id = q.id
                WHERE tq.test_id = ?
                ORDER BY tq.question_order
            `;
            
            db.query(query, [testId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    /**
     * Get active tests (for students)
     */
    getActiveTests: () => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT t.*, u.name as created_by_name,
                       (SELECT COUNT(*) FROM test_questions WHERE test_id = t.id) as question_count
                FROM tests t
                LEFT JOIN users u ON t.created_by = u.id
                WHERE t.status = 'active'
                ORDER BY t.created_at DESC
            `;
            
            db.query(query, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    /**
     * Update test status
     */
    updateStatus: (testId, status) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE tests 
                SET status = ?, updated_at = NOW()
                WHERE id = ?
            `;
            
            db.query(query, [status, testId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    /**
     * Delete test
     */
    delete: (testId) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE tests 
                SET status = 'archived', updated_at = NOW()
                WHERE id = ?
            `;
            
            db.query(query, [testId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    /**
     * Get test count
     */
    getCount: () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT COUNT(*) as count FROM tests WHERE status = 'active'`;
            
            db.query(query, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0].count);
            });
        });
    }
};

module.exports = Test;