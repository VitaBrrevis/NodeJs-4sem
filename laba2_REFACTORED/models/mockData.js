const fs = require('fs');
const filepath = "./models/storage.json";


const readFileAsync = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

function readFileCallback(callback) {
    fs.readFile('storage.json', 'utf8', (err, data) => {
        if (err) {
            callback(err, null);
            return;
        }
        const notes = JSON.parse(data);
        callback(null, notes);
    });
}

function sync() {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

async function cllbck() {
    try {
        const data = await new Promise((resolve, reject) => {
            readFileCallback((error, data) => {
                if (error) {
                    console.error('Something went wrong while reading new note:', error);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
        return data;
    } catch (error) {
        console.error('Something went wrong while reading new note:', error);
        return [];
    }
}

async function promise() {
    try {
        const data = await readFileAsync(filepath);
        const notes = JSON.parse(data);
        return notes;
    } catch (error) {
        console.error('Something went wrong while reading new note:', error);
        return [];
    }
}

async function async() {
    try {
        const data = await readFileAsync(filepath);
        const notes = JSON.parse(data);
        return notes;
    } catch (error) {
        console.error('Something went wrong while reading new note:', error);
        return [];
    }
}

function addNotes(newNoteContent){
    try {
        storedNotes = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        console.log(storedNotes.length);
        newNote = {
            id: storedNotes.length + 1,
            title: newNoteContent.title,
            content: newNoteContent.content,
            createdBy: "user2",
            createdAt: new Date().toLocaleDateString(),
            updatedAt: new Date().toLocaleDateString()
        };
        storedNotes = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        storedNotes.push(newNote);
        fs.writeFileSync(filepath, JSON.stringify(storedNotes));
        return true;
    } catch (error) {
        console.error('Something went wrong while adding new note:', error);
        return false;
    }
}

function deleteNotes(id){
    try {
        storedNotes = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        storedNotes = storedNotes.filter(note => note.id != id);
        fs.writeFileSync(filepath, JSON.stringify(storedNotes));
        return true;
    } catch (error) {
        console.error('Something went wrong while deleting new note:', error);
        return false;
    }
}

module.exports = {
    getNotes_sync: sync,
    getNotes_callback: cllbck,
    getNotes_promise: promise,
    getNotes_async: async,
    addNotes: addNotes,
    deleteNotes: deleteNotes
};