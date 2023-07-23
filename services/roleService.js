const role = require('../database/role')





module.exports = {
    async getAllRoles(){
        const allRoles = await role.getAllRoles();
        return allRoles;
    },

 
    
}