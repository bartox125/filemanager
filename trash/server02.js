// const fs = require("fs")
// const path = require("path")
// let objects=[]

// fs.readdir('pliki', (err, files) => {
//     if (err) throw err
//     // foreach
//     files.forEach((file) => {
//         fs.lstat("pliki/" + file, (err, stats) => {
//             //console.log(file, stats.isFile());
//             objects.push({name: file, type: stats.isFile()})
//         })
//     })
//     console.log(objects);
// })

const fs = require("fs");
const path = require("path");
let objects = [];

// Użyj fs.readdirSync do synchronicznego odczytu katalogu
const files = fs.readdirSync('pliki');

files.forEach((file) => {
    // Użyj fs.lstatSync do synchronicznego otrzymania statystyk pliku
    const stats = fs.lstatSync(path.join('pliki', file));
    objects.push({name: file, type: stats.isFile() ? "file" : "directory"});
});

console.log(objects);

// const filepath3 = path.join(__dirname, "files", "file03.txt")
// const filepath4 = path.join(__dirname, "files", "file04.txt")

// fs.writeFile(filepath3, "tekst do zapisania", (err) => {
//     if (err) throw err
//     console.log("plik utworzony - czas 1: " + new Date().getMilliseconds());
//    
//     fs.appendFile(filepath3, "\n\ntekst do dopisania", (err) => {
//         if (err) throw err
//         console.log("plik zmodyfikowany - czas 2: " + new Date().getMilliseconds());
//        
//     })
// })
// if (!fs.existsSync("./newdir")) {
//         fs.mkdir("./newdir", (err) => {
//             if (err) throw err
//             console.log("jest");
//             if (fs.existsSync("./newdir")) {
//                 fs.rmdir("./newdir", (err) => {
//                     if (err) throw err
//                     console.log("nie ma ");
//                 })
//             }
//         })
//     }
