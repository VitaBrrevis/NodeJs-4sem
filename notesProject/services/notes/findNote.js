async function findNote(req, res, id, action) {
    try {
        const note = await Notes.findOne({ where: { id } });
        if (!note) {
            req.flash('warning', 'Note not found');
            return res.redirect('/notes');
        }

        if (note.userid !== req.session.user.id) {
            const message = `You don't have permission to ${action} this note`;
            req.flash('warning', message);
            return res.redirect('/notes');
        }

        return note;
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error occurred, try again later');
        return res.redirect('/notes');
    }
}

module.exports = findNote;