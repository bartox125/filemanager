const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path")
const fs = require("fs")
const hbs = require('express-handlebars');
const formidable = require('formidable');
const { application } = require("express");
let dane = { object: [] }
let tab = ['ico', 'jpg', 'pdf', 'png', 'txt']
let objects=[]
app.use(express.static('static'))
function isInDane(find) {
    for (let i = 0; i < dane.object.length; i++) {
        if (dane.object[i].id == find) {
            //console.log();
            return dane.object[i]
        }
    }
}
function isInDan(find) {
    for (let i = 0; i < dane.object.length; i++) {
        if (dane.object[i].id == find) {
            //console.log();
            return dane.object[i].id
        }
    }
}
function addId() {
    if (dane.object.length == 0) {
        return dane.object.length + 1
    }
    else {
        return dane.object[dane.object.length - 1].id + 1
    }
}
app.get("/", function (req, res) {
    res.render('upload.hbs'); // nie podajemy ścieżki tylko nazwę pliku
})
app.get("/file", function (req, res) {
    res.render('filemanager.hbs', dane);
})
app.get("/info", function (req, res) {
    const id = req.query.dane
    //const dataToSend = dane.object[id - 1]
    const dataToSend = isInDane(id)
    console.log(dataToSend);
    res.render('info.hbs', dataToSend);
})
app.get("/show", function (req, res) {
    const id = req.query.dane
    //let name = dane.object[id - 1].path
    let name = isInDane(id).path
    console.log(name);
    let fileName;
    if (name.length == 86) {
        fileName = name.slice(47, 91)
    }
    else {
        fileName = name.slice(47, 92)
    }
    res.sendFile(path.join(__dirname, '/static/upload/' + fileName))
})
app.get("/delete", function (req, res) {
    const id = req.query.dane
    dane.object.splice(isInDan(id) - 1, 1)
    console.log(dane);
    res.render('filemanager.hbs', dane);
})
app.get("/deleteall", function (req, res) {
    const end = dane.object.length
    dane.object.splice(0, end)
    res.render('filemanager.hbs', dane);
})
app.get("/filemanager_2", function (req, res) {
    fs.readdir("pliki", (err, files) => {
        if (err) throw err
        let filesList = files
        console.log(files);
    })
    res.render('filemanager_2.hbs')
})
app.get("/download", function (req, res) {
    const id = req.query.dane
    //let name = dane.object[id - 1].path
    let name = isInDane(id).path
    let fileName;
    if (name.length == 86) {
        fileName = name.slice(47, 91)
    }
    else {
        fileName = name.slice(47, 92)
    }
    res.download(path.join(__dirname, '/static/upload/' + fileName))
})
app.post('/filesSend', function (req, res) {
    let form = formidable({});
    form.multiples = true
    form.uploadDir = __dirname + '/static/upload/' // folder do zapisu zdjęcia
    form.keepExtensions = true // zapis z rozszerzeniem pliku
    form.parse(req, function (err, fields, files) {
        let obj = {
            id: addId(),
            name: files.imageupload.name,
            size: files.imageupload.size,
            type: files.imageupload.type,
            img: img(),
            path: files.imageupload.path,
            time: new Date().getTime()
        }
        dane.object.push(obj)
        res.render('filemanager.hbs', dane)
        function isInTab(dane) {
            let x = 0
            for (let i = 0; i < tab.length; i++) {
                if (dane == tab[i]) {
                    x++
                }
            }
            if (x == 0) {
                return false
            }
            else {
                return true
            }
        }
        function img() {
            let dane = files.imageupload.name.slice(-3)
            if (isInTab(dane) == true) {
                return files.imageupload.name.slice(-3)
            }
            else {
                return 'brak'
            }
        }
    });
});

app.get("/createFile", function (req, res) {
    let name = req.query.name
    const filepath = path.join(__dirname, "pliki", name)
    fs.writeFile(filepath, "", (err) => {
        if (err) throw err
        console.log("plik utworzony")
    })
    //res.render('filemanager_2.hbs')
    fs.readdir('pliki', (err, files) => {
        if (err) throw err
        // foreach
        files.forEach((file) => {
            fs.lstat("pliki/" + file, (err, stats) => {
                console.log(file, stats.isFile());
            })
        })
    })
})
app.get("/createCatalog", function (req, res) {
    let name = req.query.name
    if (!fs.existsSync("pliki/" + name)) {
        fs.mkdir("pliki/" + name, (err) => {
            if (err) throw err
            console.log("utworzono");
        })
    }
    fs.readdir('pliki/', (err, files) => {
        if (err) throw err
        fs.readdir('pliki', (err, files) => {
            if (err) throw err
            // foreach
            files.forEach((file) => {
                fs.lstat("pliki/" + file, (err, stats) => {
                    //console.log(file, stats.isFile());
                    objects.push({name: file, type: stats.isFile()})
                })
            })
        })
    })
    console.log(objects);
    res.render('filemanager_2.hbs', objects)
    objects=[]
})
app.post("/send", function (req, res) {
    let form = formidable({});
    form.multiples = true
    form.uploadDir = __dirname + '/static/upload/'
    form.keepExtensions = true
})

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})