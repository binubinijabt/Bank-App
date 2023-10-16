//1. import mongoose

const mongoose = require('mongoose');

//2. define connection string between mongoose and express

mongoose.connect('mongodb://localhost:27017/BankServer')

//3. create a model and schema for sharing data between mongoose and express

const User=mongoose.model('User',{
    acno:Number,
    password:String,
    username:String,
    balance:Number,
    transaction:[]
})

//export collection

module.exports={
    User
}




