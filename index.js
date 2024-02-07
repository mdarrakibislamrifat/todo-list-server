const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

const cookieParser=require('cookie-parser')
const app = express();

require("dotenv").config();


const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:['http://localhost:5173'],
    credentials:true
}))





const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d0x6rpk.mongodb.net/?retryWrites=true&w=majority`;


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
        const database = client.db('todo-list');

        const todoItems = database.collection('todoList');
      

        // create todo route
        app.post('/todo',async(req,res)=>{
            const newTodo=req.body;
            const result=await todoItems.insertOne(newTodo);
            res.send(result)
        })


        // get all todo route
        app.get('/allTodo',async(req,res)=>{
            
            const cursor=todoItems.find();
            
            const result=await cursor.toArray();
            res.send(result)
        })

        // delete a todo route
        app.delete('/allTodo/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:new ObjectId(id)}
            const result=await todoItems.deleteOne(query)
            res.send(result)
          })

// get a specific task 
          app.get('/allTodo/new/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:new ObjectId(id)}
            const result=await todoItems.findOne(query)
            res.send(result)
          })

        //   update a task
        app.patch('/allTodo/v1/v2/:id',async(req,res)=>{
            const item=req.body;
            const id=req.params.id;
            const filter={_id: new ObjectId(id)}
            const updatedDoc={
              $set:{
                name:item.name,
                type:item.type,
                typePrior:item.typePrior
              }
            }
            const result=await todoItems.updateOne(filter,updatedDoc)
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
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})