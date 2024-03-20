const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config({path:__dirname + '/.env'})

const Scheme = mongoose.Schema

const noteScheme = new Scheme({title: String, description: String, key: String})
const Note = mongoose.model('notes', noteScheme)

const app = express()

app.use(cors())
app.use(express.json())

const urlencodedParser = bodyParser.urlencoded({
    extended: false
})

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING

async function main() {
 
    try{
        await mongoose.connect(CONNECTION_STRING);
        app.listen(3000);
        console.log("Сервер ожидает подключения...");
    }
    catch(err) {
        return console.log(err);
    }
}

app.get('/api/notes', async function(req, res){

    res.header('Access-Control-Allow-Origin', '*')

    const notes = await Note.find({})
    let html = ``

    notes.forEach(el => {
        html += `<h1>${el.title}</h1>
                 <p>${el.key}</p>
                 <p>${el.description}</p>`
    })

    res.status(200).json(notes)

})

app.get('/api/create', async function(req, res) {

    res.header('Access-Control-Allow-Origin', '*')

    const notes = await Note.find({})

    let html = ``

    notes.forEach(el => {
        if(el.title.toLowerCase().indexOf(req.params['title']) >= 0) {
            html += `<h1>${el.title}</h1>
                     <p>${el.description}</p>`
        }
    })

    res.send(html)
})

app.get('/create', async function(req, res) {
    let html = `
                <form action="/create" method="POST">
                    <input name="title" type="text">
                    <input name="description" type="text">
                    <button type="submit">CREATE</button>
                </form>
                `

    res.send(html)

})

app.post('/api/create', urlencodedParser, async function(req, res) {

    res.header('Access-Control-Allow-Origin', '*')
    
    if(!req.body) return res.sendStatus(400)

    const newNote = new Note({title: req.body.title, description: req.body.description, key: req.body.key})

    const note = await newNote.save()

    res.status(200).json(note)

})

app.put('/:id', urlencodedParser, async function(req, res) {

    if(req.params) {

        const { id } = req.params

        const currentNote = await Note.findById(id)
        currentNote.title = req.body.title
        currentNote.description = req.body.description
        currentNote.key = req.body.key

        const note = await currentNote.save()

        res.status(200).json(note)


    }

})

app.delete('/:id', async function(req, res) {

    if(req.params) {

        const { id } = req.params

        const note = await Note.findByIdAndDelete(id)
        res.status(200).json(note)

    }
    
})

main()

process.on("SIGINT", async() => {
    
    await mongoose.disconnect()
    console.log('Приложение завершило работу')
    process.exit()

})