const fs = require('fs');
const filepath = "./models/storage.json";

//Function that reads the file and returns the data in a async/wait way
const readFileAsync = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

//Function that reads the file and returns the data in a callback way
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

//Sync function that simply reads the file and returns the data in a sync way
function sync() {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

//Function that allows to call callback function and read notes with out waiting on the pending result
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

////Function that reads the file and returns the data in a promise way
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

//Function that allows to call async/wait function and read notes with out waiting on the pending result
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

//Function that adds new note to the file
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

//Search and delete notes from the file by id
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

//Function that exports when importing module in other file
module.exports = {
    getNotes_sync: sync,
    getNotes_callback: cllbck,
    getNotes_promise: promise,
    getNotes_async: async,
    addNotes: addNotes,
    deleteNotes: deleteNotes
};