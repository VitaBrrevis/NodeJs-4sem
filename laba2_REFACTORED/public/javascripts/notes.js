const submitButton = document.getElementById('newNoteSubmitButton');
const titleLabel = document.getElementById('title');
const contentLabel = document.getElementById('content');

//Button that sends post request to server to create a new note
submitButton.addEventListener('click', (event) => {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    fetch('/createNote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            content
        })
    })
    location.reload();
});