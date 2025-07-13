const fs = require("fs")
const path = require("path")
const filepath = path.join(__dirname, "files", "file01.txt")
const filepath2 = path.join(__dirname, "files", "file02.txt")

const filepath3 = path.join(__dirname, "files", "file03.txt")
const filepath4 = path.join(__dirname, "files", "file04.txt")

fs.writeFile(filepath3, "tekst do zapisania", (err) => {
    if (err) throw err
    console.log("plik utworzony - czas 1: " + new Date().getMilliseconds());

    fs.appendFile(filepath3, "\n\ntekst do dopisania", (err) => {
        if (err) throw err
        console.log("plik zmodyfikowany - czas 2: " + new Date().getMilliseconds());

    })
})


