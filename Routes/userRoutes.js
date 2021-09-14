const app = require('express').Router()
const users = require('../Database/Models/user')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken')

app.get('/allusers', async (req,res) => {
    const allUsers = await users.find()
    console.log(allUsers)
    res.json(allUsers)
})

app.post('/register', async (req,res) => {
    const newPass = await bcrypt.hash(req.body.password,saltRounds).then(newPass => newPass)
    let newUser = {
        "userName" : req.body.userName,
        "email" : req.body.email,
        "password": newPass,
        "birthday" : req.body.birthday,
        "favoriteBooks" : req.body.favoriteBooks,
    }

    var user = new users(newUser);
    user.save().then((response) => {
        console.log(response)
        if(!response){
            console.log(response)
            res.status(400).send();
        }
        else{
            console.log(response)
        }
        res.status(200).send(response)
    }).catch(error => {
        console.log(error)
        res.status(400).send(error)
    })

})


app.post('/login', async (req,res) => {

    const authorization = req.header.authorization;
    if(authorization != null || authorization != undefined)
    {
        console.log(authorization)
        const requestToken = authorization.split(',')[0]
        const user = users.findOne({requestToken})
        if(user != null || user != undefined)
        {
            console.log(user + "asfdasfasfasfas")
            res.status(200).send(user);
        }
    }
    const userName = req.body.userName
    const password = req.body.password

    // Getting the user
    const currentUser = await users.findOne({userName})

    // Checking for Validity
    if(currentUser == null)
    {
        res.status(404).send("Username or password are incorrect")
        return
    }
    
    // Checking if the password matches
    const hash = currentUser.password
    bcrypt.compare(password,hash).then(result => {
        // Tenary expression to check the validity of the password in comparison to the username. 
        if(result)
        { 
            currentUser.generateToken();
            res.status(200).send(currentUser);
        } 
        else 
        {
            res.status(406).send("Username or password are incorrect")
        }
    })
    .catch(error => {
        console.log(error)
        res.status(400).send(error)
    })
})


module.exports = app