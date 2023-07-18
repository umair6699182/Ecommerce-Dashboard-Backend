//          Imports Links

const express = require("express");
const core = require("cors")
require("./Database/config.js");
const User = require("./Database/User.js")
const Product = require("./Database/Product.js");
const Jwt = require("jsonwebtoken")
const jwtKey = 'e-comm'


const app = express();
app.use(express.json());
app.use(core())


//       Register Api

app.post("/register", async (req, resp) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password
        Jwt.sign({result},jwtKey,{expiresIn:"2h"},(err,token)=>{
            if(err){
                console.log("somethig went Wrong");
            }
            resp.send({ result ,auth : token})
        })  
})


//      Login Api

app.post("/login", async (req, resp) => {
    console.log(req.body);
    let user = await User.findOne(req.body).select("-password");

    if (req.body.email && req.body.password) {    
        if (user) {
            Jwt.sign({user},jwtKey,{expiresIn:"2h"},(err,token)=>{
                if(err){
                    console.log("somethig went Wrong");
                }
                resp.send({ user ,auth : token})
            })
        } else {
            resp.send(JSON.stringify("No User Found"))
        }
    }else{
        resp.send(JSON.stringify("No User Found"))
    }
})

// Add Product Api
app.post("/add-product", async (req,resp)=>{
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result);
})

// Add Match Product Api

app.get("/find-product",async(req,resp)=>{
    let products = await Product.find();
    if(products.length>0){
        resp.send(products);
    }else{
        resp.send({result:"Result Not Found"});
    }
})

// Delete Product API

app.delete("/product/:id", async (req,resp)=>{
    const result = await Product .deleteOne({_id:req.params.id});
    resp.send(result);
})

// Update Product API

app.get("/update-product/:id", async (req,resp)=>{
    let result = await Product.findOne({_id:req.params.id});
    
    if(result){
        resp.send(result);
    }
})

app.put("/product/:id", async (req,resp)=>{
    let result = await Product.updateOne(
        {_id: req.params.id},
        {$set : req.body}
    )
    resp.send(result);
})

//       serach API
app.get("/search/:key" , async (req,resp)=>{
    let result = await Product.find({
        "$or":[
            {name:{$regex:req.params.key}},
            {category:{$regex:req.params.key}},
            {company:{$regex:req.params.key}}
        ]
    })
    resp.send(result);
})


//   Server Running Ports

app.listen(5000,()=>{
    console.log("Server is Runninng on 5000 ports")
});