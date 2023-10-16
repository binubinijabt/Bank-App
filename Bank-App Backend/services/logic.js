const { response } = require('express');

//import db.js
const db = require('./db')

//import jwt token

const jwt = require('jsonwebtoken')


const register = (acno, password, username) => {
    console.log('inside the register function');
    //to check acno in mongodb

    return db.User.findOne({ acno }).then((response) => {
        console.log(response);
        if (response) {
            return {
                statusCode: 401,
                message: "Account already registerd"
            }
        }

        else {
            const newUser = new db.User({
                acno, password, username, balance: 5000, transaction: []
            })

            // acno is not present in mongodb,then it register new accunt
            //to store new account in mongo db

            newUser.save()

            return {
                statusCode: 200,
                message: "account registered successfully"
            }

        }
    })
}






const login = (acno, password) => {
    console.log('inside the login function');
    //to check acno in mongodb

    return db.User.findOne({ acno, password }).then((result) => {

        if (result) {

            //generate token
            const token = jwt.sign({ loginAcno: acno }, 'superkey2023')


            // send response as login success to client
            return {
                statusCode: 200,
                message: "login Successfully",
                currentUser: result.username,  // sent username to client
                token,
                currentAcno: result.acno
            }
        }

        else {
            // send response as login fail to client
            return {
                statusCode: 401,
                message: " Not A Valid Data"
            }
        }

    })
}




const getBalance = (acno) => {

    //check account number mongodb
    return db.User.findOne({ acno }).then((result) => {
        if (result) {
            return {
                statusCode: 200,
                balance: result.balance //send balance to client
            }
        }

        else {
            return {
                statusCode: 401,
                message: "Invalid Account Number"// send serror msg to client
            }
        }

    })



}


const fundTransfer = (fromAcno, fromAcnoPswd, toAcno, amt) => {
    //logic of transfer
    //1 convert amount to number
    let amount = parseInt(amt)
    //2 check fromAcno in Mongodb
    return db.User.findOne({ acno: fromAcno, password: fromAcnoPswd }).then((debit) => {
        if (debit) {
            //to check toAcno in mongodb
            return db.User.findOne({ acno: toAcno }).then((credit) => {
                if (credit) {

                    if (debit.balance >= amount) {
                        debit.balance -= amount;
                        debit.transaction.push({
                            type: 'Debit',
                            amount,
                            fromAcno,
                            toAcno,
                        })

                        //save changes in mongodb
                        debit.save()

                        // update in toAcno
                        credit.balance += amount
                        credit.transaction.push({
                            type: 'Credit',
                            amount,
                            fromAcno,
                            toAcno,
                        })
                        //save changes in mongodb
                        credit.save()
                        //send response to the client

                        return {
                            statusCode: 200,
                            message: "fund transfer successful"
                        }


                    }
                    else {
                        return {
                            statusCode: 401,
                            message: "insufficient funds"
                        }
                    }


                }
                else {
                    return {

                        statusCode: 401,
                        message: "invalid credit details"
                    }
                }
            })
        }

        else {
            return {

                statusCode: 401,
                message: "invalid debit details"
            }
        }
    })
}



const getTransaction=(acno)=>{

// get all transaction from mongodb
//1. check acno in mongodb
return db.User.findOne({acno}).then((result)=>{
    if (result) {
        return{
            statusCode:200,
            transaction:result.transaction
        }
    }
    else{
        return{
            statusCode:404,
            message:'Invalid Data'
        }
    }
})



}


const deleteMyAccount=(acno)=>{
    //delete account from mongo db
return db.User.deleteOne({acno}).then((result)=>{
    return{
        statusCode:200,
        message:"Your account has been deleted"
    }
})
}


module.exports = {
    register,
    login,
    getBalance,
    fundTransfer,
    getTransaction,
    deleteMyAccount
}




/////





