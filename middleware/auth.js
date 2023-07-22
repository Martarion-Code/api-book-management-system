const jwt = require('jsonwebtoken');

const User = require('../models').User;
const Role = require('../models').Role;
const db = require('../models/index');
const config = require('../config/configRoles')
const ROLEs = config.ROLEs;

module.exports ={
    checkDuplicateUserNameOrEmail(req, res, next) {
        console.log('asdasd');
        console.log(req);
        User.findOne({
            where: {
                id: req.body.id
            }
        }).then(user =>{
            if(user){
                res.status(400).send({
                    auth: false, 
                    id:req.body.id,
                    message: "Error",
                    errors: "Id is already taken",
                })
                return;
            }
        })
        
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(user =>{
            if(user){
                res.status(400).send({
                    auth: false, 
                    id:req.body.id,
                    message: "Error",
                    errors: "Email is already taken",
                })
                return;
            }
            next();
        })
        
    }, 

    checkRolesExisted(req, res, next){
        for(let i = 0; i < req.body.roles.length; i++){
            if(!ROLEs.includes(req.body.roles[i].toUpperCase())){
                res.status(400).send({
                    auth: false, 
                    id: req.body.id,
                    message: "Error",
                    errors: "Does not Exist Role = " + req.body.roles[i],

                })
                return;
            }
        }
        next();
    },
    verifyJWT(req, res, next){
        const authHeader = req.headers.authorization || req.headers.Authorization
        console.log(authHeader)
        if(!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);

        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=>{
            if(err){
                return res.sendStatus(403);
            }
            req.user = decoded.UserInfo.email;
            req.roles = decoded.UserInfo.roles;
            next();
        })
    }
}