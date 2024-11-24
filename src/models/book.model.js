const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        title: String,
        author: String,
        genero: String,
        fecha_publicacion: String
    }
);

module.exports = mongoose.model('Book',bookSchema);