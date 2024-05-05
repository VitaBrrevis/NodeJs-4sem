let sqlite3 = require('sqlite3');
let TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;
//a model for users table of SQLite3 database with one method to delete all user notes if user is deleted
module.exports = class Users {
    constructor(db) {
        this.db = new sqlite3.Database(db, (err) => {
            if (err) {
                console.error('Database opening error:', err);
            } else {
                console.log('Connected to the SQLite database.');
            }
        })
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            let db = new TransactionDatabase( this.db );
            db.beginTransaction(function(err, transaction) {
                transaction.run('DELETE FROM notes WHERE userid = ?', [id]);
                transaction.run('DELETE FROM users WHERE id = ?', [id]);
                transaction.commit(function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                })
            });
        });
    }
}