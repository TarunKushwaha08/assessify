const db = require('../config/db');

const User = {
    /**
     * Find user by username and user type
     */
    findByUsername: (username, userType) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM users 
                WHERE username = ? AND user_type = ?
                LIMIT 1
            `;
            
            db.query(query, [username, userType], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0] || null);
            });
        });
    },

    /**
     * Find user by ID
     */
    findById: (userId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM users 
                WHERE id = ?
                LIMIT 1
            `;
            
            db.query(query, [userId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0] || null);
            });
        });
    },

    /**
     * Create a new user
     */
    create: (userData) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO users (username, password, name, user_type, email, status, created_at)
                VALUES (?, ?, ?, ?, ?, 'active', NOW())
            `;
            
            const values = [
                userData.username,
                userData.password,
                userData.name,
                userData.userType,
                userData.email || null
            ];
            
            db.query(query, values, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve({ id: result.insertId, ...userData });
            });
        });
    },

    /**
     * Update last login timestamp
     */
    updateLastLogin: (userId) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE users 
                SET last_login = NOW() 
                WHERE id = ?
            `;
            
            db.query(query, [userId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    /**
     * Update user password
     */
    updatePassword: (userId, hashedPassword) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE users 
                SET password = ?, updated_at = NOW() 
                WHERE id = ?
            `;
            
            db.query(query, [hashedPassword, userId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    /**
     * Get all students
     */
    getAllStudents: () => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT id, username, name, email, status, created_at, last_login
                FROM users 
                WHERE user_type = 'student'
                ORDER BY created_at DESC
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
     * Get all teachers
     */
    getAllTeachers: () => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT id, username, name, email, status, created_at, last_login
                FROM users 
                WHERE user_type = 'teacher'
                ORDER BY created_at DESC
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
     * Update user status (active/inactive)
     */
    updateStatus: (userId, status) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE users 
                SET status = ?, updated_at = NOW() 
                WHERE id = ?
            `;
            
            db.query(query, [status, userId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    /**
     * Delete user
     */
    delete: (userId) => {
        return new Promise((resolve, reject) => {
            const query = `
                DELETE FROM users 
                WHERE id = ?
            `;
            
            db.query(query, [userId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    /**
     * Check if username exists
     */
    usernameExists: (username, userType) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT COUNT(*) as count 
                FROM users 
                WHERE username = ? AND user_type = ?
            `;
            
            db.query(query, [username, userType], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0].count > 0);
            });
        });
    }
};

module.exports = User;