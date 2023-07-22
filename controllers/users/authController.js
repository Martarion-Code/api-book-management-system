const User = require('../../models').User;
const Role = require('../../models').Role;
const db = require('../../models/index');

const Op = db.Sequelize.Op;


const { Router } = require('express');
const config = require('../../config/configRoles.js')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ROLEs = config.ROLEs;

module.exports ={
    signUp(req, res){
        return User.create({
            name: req.body.name,
            id: req.body.id,
            email: req.body.email ,
            password: bcrypt.hashSync(req.body.password, 8),
        }).then(user => {
            Role.findOne({
                where: {
                    name: {
                        [Op.or]: req.body.roles
                    }
                }
            }).then(role =>{
                
                user.setRole(role).then(() =>{
                    res.status(200).send({
                        auth: true, 
                        message: "User registered succesfully",
                        errors: null,
                        id: req.body.id
                    })
                })
            }).catch(err =>{
                res.status(500).send({
                    auth: false,
                    id: req.body.id,
                    message: "error",
                    errors: err
                })
            })
        })
    },
    //ver await
    async signUp2(req, res){
        const createdUser = await User.create({
            name: req.body.name,
            id: req.body.id,
            email: req.body.email ,
            password: bcrypt.hashSync(req.body.password, 8),
        });
        const roles = await   Role.findAll({
            where: {
                name: {
                    [Op.or]: req.body.roles
                }
            }
        });
        await createdUser.setRoles(roles);

        

    },

    signIn(req, res){
        User.findOne({
            where:{
                email: req.body.email
            }
        }).then(async user =>{
            console.log(user.email)
            if(!user) { 
                return res.status(404).send({
                    auth: false,
                    accessToken: null,
                    id: req.body.id,
                    message: "Error",
                    errors: "User not found"
                })

            }

            const pwdIsValid = bcrypt.compareSync(req.body.password, user.password);
            console.log(pwdIsValid);
            if(!pwdIsValid){
                return res.status(401).send({
                    id: req.body.id,
                    auth: false,
                    message: "Error",
                    errors: "Password is wrong"
                })
            }
        
       
            const token = "Bearer  "+  jwt.sign({
                "UserInfo": {
                    "email": user.email,
                    "role" : config.ROLEs[user.roleId-1], //roleId start from one but the ROLEs is an array. That's why we subtract by one 
                }
            }, config.ACCESS_TOKEN_SECRET, {
                expiresIn: 86400 //24 h expired
            });
            res.status(200).send({
                auth: true, 
                id: req.body.id,
                accessToken: token, 
                message: "Login sukses",
                errors: null,
            })
        }).catch((err) =>{
            res.status(500).send({
                auth: false, 
                id: req.body.id,
                accessToken: null, 
                message: "error",
                errors: `${err}`
            })
        });
    }


}