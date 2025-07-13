const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path")
const fs = require("fs")
const hbs = require('express-handlebars');
const formidable = require('formidable');
const { application } = require("express");
const multer  = require('multer');


// Konfiguracja multer
const upload = multer({ dest: 'uploads/' });

app.get('/', function(res,req){
    res.render('index.html')
})
app.post('/twoj-endpoint', upload.single('profilePic'), (req, res) => {
    const username = req.body.username;
    // Dostęp do przesłanego pliku można uzyskać za pomocą req.file
    console.log(username, req.file);
    app.get('/', function(res,req){
        res.render('index.html')
    })
});

app.listen(3000, () => {
    console.log('Serwer działa na porcie 3000');
});
