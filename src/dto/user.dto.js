const { createHash } = require('../utils');

class UserDTO {
    constructor(user){
        this.email = user.email;
        this.password = createHash(user.password);
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.age = user.age;
        this.address = user.address;
        this.cart = user.cart;
        this.role = role === 'admin' ? 'admin' : 'user';
    }
}

module.exports = UserDTO