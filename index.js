const express = require('express')
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const fileUpload = require('express-fileupload')
const app = express()

require('dotenv').config()

app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload())

const port = process.env.PORT || 1526;


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aifw0.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db(process.env.DB_DATABASE).collection("Services");


    //Adding the services to the database
    app.post('/addService', (req, res) => {
        const file = req.files.file
        const title = req.body.title
        const description = req.body.description;
        const newImg = file.data;
        const encImg = newImg.toString('base64')

        const image = {
            contentType: file.mimeType,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        }

        serviceCollection.insertOne({ title, description, image })
            .then((result) => {
                res.send(result.insertedCount > 0)
            })
    })
    //Getting the services data form the database
    app.get('/getServices', (req, res) => {
        serviceCollection.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    })
    //Getting Data Of Spacific Service form Database
    app.get('/serviceDetails/:id', (req, res) => {
        const id = req.params.id;
        serviceCollection.find({ "_id": ObjectId(id) })
            .toArray((err, document) => {
                res.send(document);
            })
    })


    console.log('Database Connected');
});




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})