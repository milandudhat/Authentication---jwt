const express = require('express')
const bodyparser = require('body-parser')
const usermodel = require('./models/user');
const jsonparser = bodyparser.json();
const app = express()
const port = 3000
const bcrypt = require("bcrypt");


const jsonwebtoken = require('jsonwebtoken')
jwtkey = 'vOH6sdmpNWjRRIqCc7rdxs01lwHzfr33';

require('./config')

app.post('/register', jsonparser, async (req, res) => {
    const result = new usermodel(req.body);

    const salt = await bcrypt.genSalt(10);
    result.password = await bcrypt.hash(req.body.password, salt);
    result.save().then((data)=>{
        jsonwebtoken.sign({ result }, jwtkey, { expiresIn: '300s' }, (err, token) => {
            res.status(201).json([{ token: token }, data])
        })
    })
    // console.log(data);
})

app.post('/login', jsonparser, async (req, res) => {
    const user = await usermodel.findOne({email:req.body.email})
    if(user){
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (validPassword) {
            res.status(200).json({ message: "Valid password" });
          } else {
            res.status(400).json({ error: "Invalid Password" });
          }
        } else {
          res.status(401).json({ error: "User does not exist" });
    
    }

})

app.get('/users' ,verify , async(req,res)=>{
    usermodel.find().then((result)=>{
        res.status(200).json(result)
        console.log(result);

    })
})

 function verify(req,res,next){
    const bearerHeader = req.Headers["authorization"];
    const bearer = bearerHeader.split(' ')
    req.token = bearer[1];
    jsonwebtoken.verify(req.token , jwtkey , (err , data)=>{
        if(err){
            res.json({
                result:err
            })
        }
        else{
            next();
        }
    })
    if(bearerHeader !== 'undefined'){
        req.send("done")
    }else{
        res.send({
            result:"Token Not provides"
        })
    }
 }
app.listen(port, () => console.log(`Example app listening on port ${port}!`))