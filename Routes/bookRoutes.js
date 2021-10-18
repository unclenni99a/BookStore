const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');
const app = express.Router();
let upload = multer();

// Models
const books = require('../Database/Models/book');
// Authorization Middlewares
const isAuthorized = require('../Middlewares/authorization.middleware');
const authorCheck = require('../Middlewares/authorCheck.middleware');
const bookCheck = require('../Middlewares/bookCheck.middleware');

// For handeling navigating through the server
const path = require('path');

app.get('/allbooks', (req,res) => {
    books.find().then((allBooks) => {
        res.json(allBooks)
    })
    .catch((err) => {
        res.status(404).send(err)
    })
    }
)

app.post('/addBook',isAuthorized, upload.single('image'), authorCheck, (req,res) => {
    let newBook = {
            token: req.headers.authorization,
            title: req.body.title,
            publishDate: req.body.publishDate,
            price: req.body.price,
            authorId: req.body.authorId,
            userId: req.body.userId,
            imagePath: ''
    };

    // Generating the folder of the  user if it doesn't exist
    const folderName = path.join(__dirname , "../Users/" , newBook.userId);
    if(!fs.existsSync(folderName))
    {    
        fs.mkdirSync(folderName);
    }

    // Setting the image path and name
    newBook.imagePath = path.join(folderName,"\\",req.file.originalname);

    // Saving the image inside of it's user's folder
    fs.writeFile(newBook.imagePath, req.file.buffer,(err) => {
        if(err)
        {
            return res.status(400).send("An error occured while saving the image");
        }
        else
        {
            const book = new books({...newBook});
            book.save().then(result => {
                console.log("here");
                return res.status(200).send(result);
            })
            .catch(err => {
                return res.status(400).send(err);
            })
        }
    })
})

app.get("/getBook", bookCheck, (req,res) => {
    books.findById(req.body.bookId, (err,book) => {
        if(err)
        {    
            res.status(404).send(err)
        }
        else
        {
            res.send(book)
        }
    }
)})

module.exports = app