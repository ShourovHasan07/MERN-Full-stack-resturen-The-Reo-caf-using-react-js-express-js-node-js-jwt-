const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Use environment variables for MongoDB credentials
const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.mv9wo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const userCollection = client.db("reaoCaf").collection("users");
    const menuCollection = client.db("reaoCaf").collection("menu");
    const reviwsCollection = client.db("reaoCaf").collection("reviws");
    const cartCollection = client.db("reaoCaf").collection("carts");

    // user related api 

    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    


     app.post('/users', async ( req,res)=>{
      const user = req.body
     // insert email  if user doesnot exist 
     // you can do this many ways (1.email qunic)
      const query = {email: user.email}
       const existingUser = await userCollection.findOne(query)
       if(existingUser){
        return res.send({message : 'user already axists ' , insertedId: null})
       }



      const result = await userCollection.insertOne(user)
      res.send(result)
     })


    // API endpoint to get menu data
    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });
    // API endpoint to get menu data
    app.get("/reviws", async (req, res) => {
      const result = await reviwsCollection.find().toArray();
      res.send(result);
    });
    // POST request to add a cart item
    app.get("/carts", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cartCollection.find().toArray();
      res.send(result);
    });
    app.post("/carts", async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    });

    // cart item delete 
     
    app.delete('/carts/:id',async(req,res)=>{
      const id = req.params.id 
      const query = {_id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  } finally {
    // Do not close the connection for an API server
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("The restaurant server is running");
});

app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
