const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path")
const fs = require("fs")
const hbs = require('express-handlebars');
const formidable = require('formidable');
const { application } = require("express");
const { log } = require("console");
const cookieparser = require("cookie-parser");
const contentForFiles = ['body {\n  background: red\n}', `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
</body>
</html>`, '{\n   "a":1,\n   "b":2,\n   "c":3\n}']
let dane = { files: [], directories: [], root: '', path: [] }
let track = 'home'

app.use(express.static('static'))
app.use(express.json());
app.use(cookieparser())
//przygotować tablice z contentem do wpisywania w pliki
function send(req, res) {
    //przygotowanie tavblicy z ściezkami
    let tab = track.split("/")
    let arr = []
    for (let i = 1; i < tab.length; i++) {
        let obj = { name: tab[i], path: '' }
        for (let x = 0; x < tab.length - 1; x++) {
            if (x == tab.length - 2) {
                obj.path = obj.path + tab[x]
            }
            else {
                obj.path = obj.path + tab[x] + '/'
            }
        }
        arr.push(obj)
    }
    //przygotowanie tablicy z listami pliów i katalogów
    const files = fs.readdirSync(track);
    dane = { files: [], directories: [], root: track, path: arr }
    files.forEach((file) => {
        const stats = fs.lstatSync(path.join(track, file));
        if (stats.isDirectory() == true) {
            dane.directories.push({ name: file })
        }
        else {
            dane.files.push({ name: file })
        }
    });
    //wyrzucić rendera poza funkcję
    res.render('filemanager_2.hbs', dane)
}
function oneFromThree(name) {
    if (name.includes('.css')) {
        return 'css'
    }
    else if (name.includes('.html')) {
        return 'html'
    }
    else if (name.includes('.json')) {
        return 'json'
    }
}
function write(data, name, req, res, root) {
    //wyrzucić send 
    console.log(root);
    fs.writeFile(root + '/' + name, "" + data + "", (err) => {
        if (err) throw err
        send(req, res)
    })
}
app.get("/", function (req, res) {
    track = 'home'
    send(req, res)
    res.render("filemanager_2.hbs")
})
app.get("/#", function (req, res) {
    track = 'home'
    send(req, res)
    res.render("filemanager_2.hbs")
})
app.get("/filemanager_2", function (req, res) {
    track = 'home'
    send(req, res)
})
app.get("/createFile", function (req, res) {
    let name = req.query.name
    let root = req.query.root
    if (!fs.existsSync(root + '/' + name)) {
        switch (oneFromThree(name)) {
            case 'css':
                write(contentForFiles[0], name, req, res, root)
                break;
            case 'html':
                write(contentForFiles[1], name, req, res, root)
                break;
            case 'json':
                write(contentForFiles[2], name, req, res, root)
                break;
            default:
                write("", name, req, res, root)
                break;
        }
    }
    else {
        for (let i = 0; i < 1000; i++) {
            if (!fs.existsSync(root + '/' + name + '_copy_' + i)) {
                fs.writeFile(root + '/' + name + '_copy_' + i, "", (err) => {
                    if (err) throw err
                    send(req, res)
                })
                break
            }
        }
    }
})
app.get("/createCatalog", function (req, res) {
    let name = req.query.name
    let root = req.query.root
    if (!fs.existsSync(root + "/" + name)) {
        fs.mkdir(root + "/" + name, (err) => {
            if (err) throw err
            send(req, res)
        })
    }
    else {
        for (let j = 0; j < 10000; j++) {
            if (!fs.existsSync(root + "/" + name + ' copy_' + j)) {
                fs.mkdir(root + "/" + name + ' copy_' + j, (err) => {
                    if (err) throw err
                    send(req, res)
                })
                break
            }
        }
    }

})
app.get("/delete", function (req, res) {
    let name = req.query.name
    if (fs.existsSync(track + '/' + name)) {
        fs.lstat(track + '/' + name, (err, stats) => {
            if (stats.isFile() == true) {
                fs.unlink(track + '/' + name, (err) => {
                    if (err) throw err
                    send(req, res)
                })
            }
            else {
                fs.rm(track + '/' + name, { recursive: true }, (err) => {
                    if (err) throw err
                    send(req, res)
                })
            }
        })
    }
    else {
        send(req, res)
    }
})
app.post("/send", function (req, res) {
    let form = formidable({});
    form.multiples = true
    form.uploadDir = __dirname + '/' + track + '/'
    form.parse(req, function (err, fields, files) {
        if (Array.isArray(files.imageupload) == true) {
            for (let i = 0; i < files.imageupload.length; i++) {
                fs.renameSync(files.imageupload[i].path, form.uploadDir + files.imageupload[i].name, function (err) {
                    if (err) throw err
                })
            }
        }
        else {
            fs.renameSync(files.imageupload.path, form.uploadDir + files.imageupload.name, function (err) {
                if (err) throw err
            })
        }
        send(req, res)
    })
})
app.get('/redirect', function (req, res) {
    let name = req.query.name
    track = track + '/' + name
    send(req, res)
})
app.get('/backTo', function (req, res) {
    track = req.query.path
    send(req, res)

})
app.get('/changeName', function (req, res) {
    let newName = req.query.newName
    let oldPath = req.query.root
    let arr = oldPath.split("/")
    let newPath = ''
    for (let i = 0; i < arr.length - 1; i++) {
        newPath = newPath + arr[i] + '/'
    }
    newPath += newName
    track = newPath
    if (!fs.existsSync(newPath)) {
        fs.rename(oldPath, newPath, function (err) {
            if (err) console.log(err)
            else {
                send(req, res)
            }
        })
    }
    else {
        res.send("Taki folder już istnieje, musisz użyć innej nazwy")
    }
})
app.get('/changeFileName', function (req, res) {
    let newName = req.query.newName
    let oldPath = req.query.root
    let arr = oldPath.split("/")
    let newPath = ''
    let need = arr[arr.length - 1].split(".")
    let extension = '.' + need[need.length - 1]
    for (let i = 0; i < arr.length - 1; i++) {
        newPath = newPath + arr[i] + '/'
    }
    newPath += newName + extension
    track = oldPath.slice(0, (arr.length - 1) - arr[arr.length - 1].length - 2);
    if (!fs.existsSync(newPath)) {
        fs.rename(oldPath, newPath, function (err) {
            if (err) console.log(err)
            else {
                fs.readFile(newPath, (err, data) =>{
                    let content = data.toString();
                    let obj = { path: track, name: newName + extension, root: newPath , content: content}
                    res.render('edit.hbs', obj)
                })
            }
        })
    }
    else {
        res.send("Taki plik już istnieje, musisz użyć innej nazwy")
    }
})
app.get('/editFile', function (req, res) {
    let name = req.query.name
    console.log("nazwa katalogu: " + name);
    console.log('ścieżka: ' + track);
    let root = track + "/" + name
    let content = ''
    fs.readFile(root, (err, data) => {
        if (err) throw err
        content = data.toString();
        let obj = { path: track, name: name, root: root, content: content }
        console.log(obj.content);
        res.render('edit.hbs', obj)
    })
})
app.get('/saveChanges', function (req, res){
    let content=req.query.content
    let root=req.query.root
    console.log(root);
    console.log(content);
    fs.unlinkSync(root, (err) => {
        if (err) throw err
    })
    fs.writeFileSync(root, content, (err)=> {
            if (err) throw err
            console.log("plik zapisany");
        })
    send(req,res)
})
app.post('/data', (req, res) => {
    console.log('Otrzymane dane:', req.body);
    fs.writeFile('config.json', JSON.stringify(req.body.message, null, 5), (err) => {
        if (err) throw err
    })
    res.json(req.body);
  });
app.get('/take', (req, res) => {
    fs.readFile('config.json', (err, data) => {
        if (err) throw err
        let content = data.toString();
        res.send(content)
    })
  });
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})