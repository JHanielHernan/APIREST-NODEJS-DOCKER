const express = require("express");
const rout = express.Router();
const Book = require('../models/book.model');


//MIDDDLEWARE
const getBook = async(req,res,next) =>{
    let book;
    const{id} = req.params;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json({
            message: 'El ID del libro no es valido'
        })
    }

    try{
        book = await Book.findById(id);
        if(!book){
            return res.status(404).json({
                message:'El libro no fue encontrado'
            })
        }
    }catch(error){
        return res.status(500).json({
            message:error.message
        })
    }

    res.book = book;
    next();
}

//Obtener todos los libros [GET ALL]
rout.get('/',async(req,res)=>{
    try{
        const books = await Book.find();
        console.log("GET ALL ",books);
        if(books.length === 0){
            return res.status(204).json([]);
        }
        res.json(books)
    }catch(error){
        res.status(500).json({message:error.message})
    }
})

//Crear un nuevo libro (recurso) [POST]
rout.post('/',async (req,res) =>{
    const {title,author,genero,fecha_publicacion} = req?.body;
    if(!title || !author || !genero || !fecha_publicacion){
        return res.status(400).json({message: 'Todos los campos son obligatorios.'});
    }

    const book = new Book({
        title,
        author,
        genero,
        fecha_publicacion
    })
    try{
        const newBook = await book.save();
        console.log(newBook)
        res.status(201).json(newBook);
    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }
})


//Obtener un elemento [GET ID]
rout.get('/:id',getBook, async(req,res)=>{
    res.json(res.book);
})


rout.put('/:id',getBook, async (req,res)=>{
    try{
        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genero = req.body.genero || book.genero;
        book.fecha_publicacion = req.body.fecha_publicacion || book.fecha_publicacion;
        const updateBook = await book.save();
        res.json(updateBook);
    }catch(error){
        res.status(400).json({
            message:error.message
        })
    }
})


rout.patch('/:id',getBook,async (req,res)=>{
    if(!req.body.title && !req.body.author && !req.body.genero && !req.body.fecha_publicacion){
        res.status(400).json({
            message: 'Al menos uno de estos campos deve ser enviado: autor, fecha publicacion, genero o titulo'
        })
    }
    try{
        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genero = req.body.genero || book.genero;
        book.fecha_publicacion = req.body.fecha_publicacion || book.fecha_publicacion;
        const updateBook = await book.save();
        res.json(updateBook);
    }catch(error){
        res.status(400).json({
            message:error.message
        })
    }
})

rout.delete('/:id',getBook,async (req,res)=>{
    try{
        const book = res.book;
        await book.deleteOne({
            _id: book._id
        });
        res.json({
            message:`el libro ${book.title} fue eliminado.` 
        })
    }catch(error){
        res.status(400).json({
            message:error.message
        })
    }
})

module.exports = rout