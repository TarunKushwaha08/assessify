const db = require('../config/db');

const Question = {
    /**
     * Create a new question
     */
    create: (questionData) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO questions 
                (question_text, option_a, option_b, option_c, option_d, correct_answer, subject, difficulty, marks, created_by, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
            `;
            
            const values = [
                questionData.questionText,
                questionData.optionA,
                questionData.optionB,
                questionData.optionC,
                questionData.optionD,
                questionData.correctAnswer,
                questionData.subject,
                questionData.difficulty,
                questionData.marks,
                questionData.createdBy
            ];
            
            db.query(query, values, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ id: result.insertId, ...questionData });
            });
        });
    },

    /**
     * Get all questions
     */
    getAll: (filters = {}) => {
        return new Promise((resolve, reject) => {
            let query = `
                SELECT q.*, u.name as created_by_name
                FROM questions q
                LEFT JOIN users u ON q.created_by = u.id
                WHERE q.status = 'active'
            `;
            
            const conditions = [];
            const values = [];

            if (filters.subject) {
                conditions.push('q.subject = ?');
                values.push(filters.subject);
            }

            if (filters.difficulty) {
                conditions.push('q.difficulty = ?');
                values.push(filters.difficulty);
            }

            if (filters.search) {
                conditions.push('q.question_text LIKE ?');
                values.push(`%${filters.search}%`);
            }

            if (conditions.length > 0) {
                query += ' AND ' + conditions.join(' AND ');
            }

            query += ' ORDER BY q.created_at DESC';

            db.query(query, values, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },

    /**
     * Get question by ID
     */
    findById: (questionId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT q.*, u.name as created_by_name
                FROM questions q
                LEFT JOIN users u ON q.created_by = u.id
                WHERE q.id = ? AND q.status = 'active'
                LIMIT 1
            `;
            
            db.query(query, [questionId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0] || null);
            });
        });
    },

    /**
     * Update question
     */
    update: (questionId, questionData) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE questions 
                SET question_text = ?, 
                    option_a = ?, 
                    option_b = ?, 
                    option_c = ?, 
                    option_d = ?,
                    correct_answer = ?,
                    subject = ?,
                    difficulty = ?,
                    marks = ?,
                    updated_at = NOW()
                WHERE id = ?
            `;
            
            const values = [
                questionData.questionText,
                questionData.optionA,
                questionData.optionB,
                questionData.optionC,
                questionData.optionD,
                questionData.correctAnswer,
                questionData.subject,
                questionData.difficulty,
                questionData.marks,
                questionId
            ];
            
            db.query(query, values, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    /**
     * Delete question (soft delete - set status to inactive)
     */
    delete: (questionId) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE questions 
                SET status = 'inactive', updated_at = NOW()
                WHERE id = ?
            `;
            
            db.query(query, [questionId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    /**
     * Get questions count by filters
     */
    getCount: (filters = {}) => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT COUNT(*) as count FROM questions WHERE status = "active"';
            const conditions = [];
            const values = [];

            if (filters.subject) {
                conditions.push('subject = ?');
                values.push(filters.subject);
            }

            if (filters.difficulty) {
                conditions.push('difficulty = ?');
                values.push(filters.difficulty);
            }

            if (conditions.length > 0) {
                query += ' AND ' + conditions.join(' AND ');
            }

            db.query(query, values, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0].count);
            });
        });
    },

    /**
     * Get questions by IDs (for test creation)
     */
    getByIds: (questionIds) => {
        return new Promise((resolve, reject) => {
            if (!questionIds || questionIds.length === 0) {
                return resolve([]);
            }

            const placeholders = questionIds.map(() => '?').join(',');
            const query = `
                SELECT * FROM questions 
                WHERE id IN (${placeholders}) AND status = 'active'
            `;
            
            db.query(query, questionIds, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
};

module.exports = Question;