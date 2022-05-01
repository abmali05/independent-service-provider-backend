const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@cluster0.n2zk3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&ssl=true`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const inventoryCollection = client.db('inventory').collection('product');

        app.get('/inventory', async (req, res) => {

            const query = {};
            const cursor = inventoryCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);

        });

        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const productDetails = await inventoryCollection.findOne(query);
            res.send(productDetails);
        });


        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const updatedQuantity = req.body;
            console.log(updatedQuantity);
            const filter = { _id: ObjectId(id) };
            console.log(filter);
            const options = { upsert: true };
            const updatedDoc = {
                $set: {

                    quantity: updatedQuantity.quantity,
                },
            };
            const result = await inventoryCollection.updateOne(filter, updatedDoc, options);
            console.log(result);
            res.send(result);

        });



    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Inventory server is runnung successfully')
});

app.listen(port, () => {
    console.log('Inventory server is runnung on  port', port);
})