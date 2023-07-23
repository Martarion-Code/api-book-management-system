const Role = require('../models').Role;


module.exports = {

    async getAllRoles () {
        const allRoles = await Role.findAll({raw: true});
        console.log(allRoles)
        return allRoles;
    }
}