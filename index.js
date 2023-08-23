
const express = require('express')
const app = express()
const cors = require("cors")
require("dotenv").config()
const port = process.env.PORT;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")


app.use(express.json())
app.use(cors())

const uri = process.env.DATABASE_URL

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        await client.connect();
        const productCollection = client.db("pc-builder").collection('products');


        app.get('/products', async (req, res) => {
            const products = await productCollection.find({}).toArray();
            res.send({ message: 'success', status: 200, data: products })
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id
            const product = await productCollection.findOne({_id: new ObjectId(id)})
            res.send({ message: 'success', status: 200, data: product })
        })



    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Server worked!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
