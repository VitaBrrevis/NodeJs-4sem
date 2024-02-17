const notes = [
    {
        id: 1,
        title: "First note",
        content: "This is the content of the first note",
        createdBy: "user1",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        title: "Second note",
        content: "This is the content of the second note",
        createdBy: "user1",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 3,
        title: "Third note",
        content: "This is the content of the third note",
        createdBy: "user2",
        createdAt: new Date(),
        updatedAt: new Date()
    }
];
module.exports = {
    getNotes: () => {
        return notes;
    },
};