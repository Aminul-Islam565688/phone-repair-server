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
    const customerCollection = client.db(process.env.DB_DATABASE).collection("Customers");
    const adminCollection = client.db(process.env.DB_DATABASE).collection("Admins");
    const reviewCollection = client.db(process.env.DB_DATABASE).collection("Review");
    const corpoServiceCollection = client.db(process.env.DB_DATABASE).collection("CorporateServices");
    //Adding the services to the database
    app.post('/addService', (req, res) => {
        const file = req.files.file
        const title = req.body.title
        const description = req.body.description;
        const cost = req.body.cost;
        const newImg = file.data;
        const encImg = newImg.toString('base64')

        const image = {
            contentType: file.mimeType,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        }

        serviceCollection.insertOne({ title, description, image, cost })
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
    //Add Customer to The Database
    app.post('/addCustomer', (req, res) => {
        const customerData = req.body;
        customerCollection.insertOne(customerData)
            .then((result) => {
                res.send(result.insertedCount > 0)
            })
    })
    //Getting Customer Data from Database
    app.get('/getCustomers', (req, res) => {
        customerCollection.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    })
    //Make Admin
    app.post('/makeAdmin', (req, res) => {
        const adminData = req.body;
        console.log(adminData);
        adminCollection.insertOne(adminData)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
    //is Admin or Not
    app.post('/isAdmin', (req, res) => {
        const adminEmail = req.body.email;
        console.log(adminEmail);
        adminCollection.find({ adminEmail: adminEmail })
            .toArray((err, admin) => {
                res.send(admin.length > 0)
            })
    })
    //Customer Service List 
    app.get('/customerServiceList', (req, res) => {
        const customerEmail = req.query.email
        console.log(customerEmail);
        customerCollection.find({ email: customerEmail })
            .toArray((err, document) => {
                res.send(document)
            })
    })
    //Add Review Data
    app.post('/customerReview', (req, res) => {
        const reviewData = req.body;
        reviewCollection.insertOne(reviewData)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
    //Get Review Data
    app.get('/getCustomerReview', (req, res) => {
        reviewCollection.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    })
    //Service Delete
    app.delete('/serviceDelete/:id', (req, res) => {
        serviceCollection.deleteOne({
            _id: ObjectId(req.params.id),
        })
            .then((err, result) => {
                res.send(err.deleteCount > 0);
            });
    })

    //add Corporate Service Data
    // app.post('/addCorpoService', (req, res) => {
    // const file = req.files.file
    // const corpoTitle = req.body
    // const description = req.body.description;
    // const cost = req.body.cost;
    // const newImg = file.data;
    // const encImg = newImg.toString('base64')
    // console.log(corpoTitle);
    // const image = {
    //     contentType: file.mimeType,
    //     size: file.size,
    //     img: Buffer.from(encImg, 'base64')
    // }

    // corpoServiceCollection.insertOne({ title, description, image, cost })
    //     .then((result) => {
    //         res.send(result.insertedCount > 0)
    //     })
    // })

    console.log('Database Connected');
});




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})