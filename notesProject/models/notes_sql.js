// a module exporting a class with CRUD methods on a sqlite3 table notes
let sqlite3 = require('sqlite3');
module.exports = class Notes {
    constructor(db) {

        this.db = new sqlite3.Database(db, (err) => {
            if (err) {
                console.error('Database opening error:', err);
            } else {
                console.log('Connected to the SQLite database.');
            }
        })
    }

    create(title, text, userid) {
        return new Promise((resolve, reject) => {
            this.db.serialize(function() {this.db.run(
                'INSERT INTO notes (title, text, userid) VALUES (?, ?, ?)',
                [title, text, userid],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                }
            );
        })});
    }

    read(id) {
        return new Promise((resolve, reject) => {
            this.db.serialize(function() {this.db.get(
                'SELECT * FROM notes WHERE id = ?',
                [id],
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                }
            );
        })});
    }

    readAll() {
        return new Promise((resolve, reject) => {
            this.db.serialize(function() {this.db.all(
                'SELECT * FROM notes',
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        })});
    }

    //method find all notes by user id and filter by title and text
    readAllByUser(userid, filter) {
        return new Promise((resolve, reject) => {
            this.db.serialize(function() {this.db.all(
                'SELECT * FROM notes WHERE userid = ? AND (title LIKE ? OR text LIKE ?)',
                [userid, `%${filter}%`, `%${filter}%`],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        })});
    }

    update(id, title, text) {
        return new Promise((resolve, reject) => {
            this.db.serialize(function() {this.db.run(
                'UPDATE notes SET title = ?, text = ? WHERE id = ?',
                [title, text, id],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        })});
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            this.db.serialize(function() {this.db.run(
                'DELETE FROM notes WHERE id = ?',
                [id],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        })});
    }
}