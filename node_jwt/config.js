const mongoose = require('mongoose') 
mongoose.connect('mongodb+srv://milandudhat:milan@cluster0.gjkd4ik.mongodb.net/auth?retryWrites=true&w=majority').then(()=>{
    console.log("Database Connected");
}).catch((err)=>{
    console.log(err);
})