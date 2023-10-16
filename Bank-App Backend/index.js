//Create server using express

//1.import express

const express = require('express');

//4.import cors
const cors = require('cors');

//import logic

const logic = require('./services/logic')


//import jwt
const jwt = require('jsonwebtoken')


//2.create server using express

const server = express()

//5.using cors in server app

server.use(cors({
    origin:'http://localhost:4200'
} ))

// 6 to parse json data to js in server app - use express.json()

server.use(express.json())


//3.setup port for server application(backend run)

server.listen(5000,()=>{
    console.log('server listening on port 5000');
})


//7. to resolve bind request in server(api fetching)

// server.get('/',(req,res)=>{
//     res.send('get method')
// })





//application specific middleware

const appMiddleware =(req,res,next)=>{
    console.log('application specific middleware');
next();
}
server.use(appMiddleware)//function call

//router specific middleawre

const jwtMiddleware =(req,res,next)=>{

    //middleware for verifying token to check user is logged in or not

    console.log('Router specific middleawre');
    //get the token from the request headers

    const token = req.headers['verify-token'];
    console.log(token);
    try{
        //verify token
        const data =jwt.verify(token,'superkey2023')
        console.log(data);
        req.currentAcno=data.loginAcno // to get currentAcno


        next();
    }
    catch{
res.status(401).json({message:"Please login..."})
    }

//verify the token


}



//register -post

server.post('/register',(req,res)=>{
    console.log("inside register api")
    console.log(req.body)


    //logic for register

logic.register(req.body.acno,req.body.password,req.body.username).then((result)=>{
    res.status(result.statusCode).json(result)
})

    // res.send("register request received")



})





//login

server.post('/login',(req,res)=>{
    console.log('inside login api');
console.log(req.body);
logic.login(req.body.acno,req.body.password).then((result)=>{
    res.status(result.statusCode).json(result)
});

} )


//balance enquiry

server.get('/balance/:acno',jwtMiddleware,(req,res)=>{
    console.log('Inside the getbalance api');
    console.log(req.params);
    logic.getBalance(req.params.acno).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})


//fund transfer


server.post('/fund-transfer',jwtMiddleware,(req,res)=>{
    console.log('Inside the fund transfer api');
    console.log(req.body);
    logic.fundTransfer(req.currentAcno,req.body.password,req.body.toAcno,req.body.amount).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})





//get transaction


server.get('/get-transaction',jwtMiddleware,(req,res)=>{
    console.log('Inside the get transaction api');
    
    logic.getTransaction(req.currentAcno).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//delete account
server.delete('/delete-account',jwtMiddleware,(req,res)=>{
    console.log('Inside the delete ac api');

    logic.deleteMyAccount(req.currentAcno).then((result)=>{
        res.status(result.statusCode).json(result)
  
    })
})








