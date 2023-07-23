const User = require("../../models").User;
const Role = require("../../models").Role;
const db = require("../../models/index");

const Op = db.Sequelize.Op;

const { Router } = require("express");
const config = require("../../config/configRoles.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ROLEs = config.ROLEs;

module.exports = {
  signUp(req, res) {
    return User.create({
      name: req.body.name,
      id: req.body.id,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    }).then((user) => {
      Role.findOne({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      })
        .then((role) => {
          user.setRole(role).then(() => {
            res.status(200).send({
              auth: true,
              message: "User registered succesfully",
              errors: null,
              id: req.body.id,
            });
          });
        })
        .catch((err) => {
          res.status(500).send({
            auth: false,
            id: req.body.id,
            message: "error",
            errors: err,
          });
        });
    });
  },
  //ver await
  async signUp2(req, res) {
    const createdUser = await User.create({
      name: req.body.name,
      id: req.body.id,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    const roles = await Role.findAll({
      where: {
        name: {
          [Op.or]: req.body.roles,
        },
      },
    });
    await createdUser.setRoles(roles);
  },

  async signIn(req, res) {
    const insertedUser = await User.findOne({
      where: {
        email: req.body.email,
      },
      include: "role"
    });
    if (!insertedUser) {
      return res.status(404).send({
        auth: false,
        accessToken: null,
        id: req.body.id,
        message: "Error",
        errors: "User not found",
      });
    }

    console.log(insertedUser.email);


    const pwdIsValid = bcrypt.compareSync(
      req.body.password,
      insertedUser.password
    );
    console.log(pwdIsValid);
    if (!pwdIsValid) {
      return res.status(401).send({
        id: req.body.id,
        auth: false,
        message: "Error",
        errors: "Password is wrong",
      });
    }

    const token =
      jwt.sign(
        {
          "UserInfo": {
            "email": insertedUser.email,
            "role": config.ROLEs[insertedUser.roleId - 1], //roleId start from one but the ROLEs is an array. That's why we subtract by one
          },
        },
        config.ACCESS_TOKEN_SECRET,
        {
          expiresIn: 86400, //24 h expired
        }
      );

    const refreshToken =
      jwt.sign(
        {
          "UserInfo": {
            "email": insertedUser.email,
            "role": config.ROLEs[insertedUser.roleId - 1], //roleId start from one but the ROLEs is an array. That's why we subtract by one
          },
        },
        config.REFRESH_TOKEN_SECRET,
        {
          expiresIn: 604800, //1 week expired
        }
      );

    try {

      console.log("Before update:", insertedUser);

      const rowsUpdated = await insertedUser.update(
        { refreshToken },
        {
          where: {
            id: insertedUser.id,
          },
        }
      );

      console.log("After update:", insertedUser);

      // if (rowsUpdated > 0) {
      //   console.log("Rows updated successfully");
      // } else {
      //   console.error("User not found or row unchanged");
      // }
    } catch (err) {
      console.error("error updating user email : ", err);
    }

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // const refreshToken
    res.status(200).send({
      auth: true,
      id: req.body.id,
      role: insertedUser.role.name,
      accessToken: token,
      message: "Login Sucessfully",
      errors: null,
    });
},

  //   signIn(req, res) {
  //     User.findOne({
  //       where: {
  //         email: req.body.email,
  //       },
  //     })
  //       .then(async (user) => {
  //         console.log(user.email);
  //         if (!user) {
  //           return res.status(404).send({
  //             auth: false,
  //             accessToken: null,
  //             id: req.body.id,
  //             message: "Error",
  //             errors: "User not found",
  //           });
  //         }

  //         const pwdIsValid = bcrypt.compareSync(req.body.password, user.password);
  //         console.log(pwdIsValid);
  //         if (!pwdIsValid) {
  //           return res.status(401).send({
  //             id: req.body.id,
  //             auth: false,
  //             message: "Error",
  //             errors: "Password is wrong",
  //           });
  //         }

  //         const token =
  //           "Bearer  " +
  //           jwt.sign(
  //             {
  //               UserInfo: {
  //                 email: user.email,
  //                 role: config.ROLEs[user.roleId - 1], //roleId start from one but the ROLEs is an array. That's why we subtract by one
  //               },
  //             },
  //             config.ACCESS_TOKEN_SECRET,
  //             {
  //               expiresIn: 86400, //24 h expired
  //             }
  //           );

  //         const refreshToken =
  //           "Bearer  " +
  //           jwt.sign(
  //             {
  //               UserInfo: {
  //                 email: user.email,
  //                 role: config.ROLEs[user.roleId - 1], //roleId start from one but the ROLEs is an array. That's why we subtract by one
  //               },
  //             },
  //             config.REFRESH_TOKEN_SECRET,
  //             {
  //               expiresIn: 604800, //1 week expired
  //             }
  //           );

  //         try {
  //           const [rowsUpdated] = await User.update(
  //             { refreshToken },
  //             {
  //               where: {
  //                 id: user.id,
  //               },
  //             }
  //           );

  //           if (rowsUpdated > 0) {
  //             // res.status(200).send({message: "Rows updated sucessfuly"})
  //             console.log("Rows updated sucessfully");
  //           } else {
  //             console.error("User not found or row unchanged");
  //           }
  //         } catch (err) {
  //           console.error("error updating user email : ", err);
  //         }

  //         // const refreshToken
  //         res.status(200).send({
  //           auth: true,
  //           id: req.body.id,
  //           accessToken: token,
  //           message: "Login sukses",
  //           errors: null,
  //         });
  //       })
  //       .catch((err) => {
  //         res.status(500).send({
  //           auth: false,
  //           id: req.body.id,
  //           accessToken: null,
  //           message: "error",
  //           errors: `${err}`,
  //         });
  //       });
  //   },
  async handleRefreshToken(req, res) {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    console.log(refreshToken);

    const foundUser = await User.findOne({
      where: {
        refreshToken,
      },
      include: "role",
    });

    if (!foundUser) return res.sendStatus(403); // forbidden

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.username !== decoded.username)
          return res.sendStatus(403);
        const role = foundUser.role;
        const accessToken = jwt.sign(
          {
            "UserInfo": {
              "email": decoded.email,
              "role": role,
            },
          },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "30m" }
        );
        res.json({ role: role.name, accessToken });
      }
    );
  },
};
