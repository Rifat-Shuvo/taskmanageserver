const express = require("express");
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware

app.use(cors())
app.use(express.json())

// https://server-task-three.vercel.app/

//mongodb connection

const uri = process.env.DB_URI

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const alltask = client.db('taskmanage').collection('alltask')

        app.post('/add', async (req, res) => {
            const addnew = req.body
            const result = await alltask.insertOne(addnew)
            res.send(result)
        })

        app.get('/all/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await alltask.find(query).toArray()
            res.send(result)
        })

        app.patch('/ongoing/:id', async(req, res)=>{
            const id = req.params.id
            const filter = {_id: new ObjectId(id)}
            const updateddoc = {
                $set:{
                    status: 'ongoing'
                }
            }
            const result = await alltask.updateOne(filter, updateddoc)
            res.send(result)
        })
        app.patch('/completed/:id', async(req, res)=>{
            const id = req.params.id
            const filter = {_id: new ObjectId(id)}
            const updateddoc = {
                $set:{
                    status: 'completed'
                }
            }
            const result = await alltask.updateOne(filter, updateddoc)
            res.send(result)
        })
        app.patch('/todo/:id', async(req, res)=>{
            const id = req.params.id
            const filter = {_id: new ObjectId(id)}
            const updateddoc = {
                $set:{
                    status: 'todo'
                }
            }
            const result = await alltask.updateOne(filter, updateddoc)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send(`hello from ${port}`)
})
app.listen(port, () => {
    console.log('lisening on port');
})