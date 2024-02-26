const submitButton = document.getElementById('newNoteSubmitButton');
const titleLabel = document.getElementById('title');
const contentLabel = document.getElementById('content');

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
    titleLabel.value = '';
    contentLabel.value = '';
});