const roleService = require("../services/roleService");

module.exports = {
    async getAllRoles (req, res) {
        const allRoles = await roleService.getAllRoles();
        // return allRoles;
        // console.log(allRoles);
        res.status(200).send({status: "OK", data: allRoles})
    }
}