const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
var cors = require('cors')


const app =express()
const port = 5000
const ObjectId = require('mongodb').ObjectId



//MiddleWare
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pfshu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect()
        // console.log('Connected to Database');
        const database = client.db("carMechanic");
        const ServicesCollection = database.collection("services");

        /* Get API Started */
        app.get('/services', async(req, res) => {
            const cursor = ServicesCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })
        /* Get Single Api */
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id
            console.log('Getting Specific Service', id);
            const query = {_id: ObjectId(id)}
            const service = await ServicesCollection.findOne(query)
            res.json(service)
        })

        /* Post API Started */
        app.post ('/services', async(req, res) => {
            const service = req.body
            console.log('Hit the post api', service);
            const result = await ServicesCollection.insertOne(service)
            console.log(result);
            res.json(result);
        })
        /* Delete API Started */
        app.delete('/services/:id', async(req, res) => {
            const id = req.params.id
            console.log('Deleting Specific Service', id);
            const query = {_id: ObjectId(id)}
            const result = await ServicesCollection.deleteOne(query);
            res.json(result)

        })

        


    }
    finally {
        // await client.close()
    } 
} 

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Genius Server');
})

app.listen(port, () => {
    console.log("running genius server on :", port);
})