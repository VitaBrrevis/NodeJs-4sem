manager = require('./mockData.js');

console.log('sync', manager.getNotes_sync());
manager.getNotes_callback().then(data => {
    console.log("cllbck", data);
});

manager.getNotes_promise().then(data => {
    console.log("promise", data);
});

manager.getNotes_async().then(data => {
    console.log("async", data);
});