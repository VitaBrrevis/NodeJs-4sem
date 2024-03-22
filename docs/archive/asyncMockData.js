manager = require('./mockData.js');

//Call async function using callback
manager.getNotes_callback().then(data => {
    console.log("cllbck", data);
});

//Call async function using promise
manager.getNotes_promise().then(data => {
    console.log("promise", data);
});

//Call async function using async/wait
manager.getNotes_async().then(data => {
    console.log("async", data);
});