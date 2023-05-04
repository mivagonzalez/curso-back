module.exports = class UserService {
  constructor(dao) {
    this.dao = dao;
  }

  getUser = async email => {
    try {
      const user = await this.dao.getUser(email);
      return user;
    } catch (error) {
        console.log('Error getting user user' ,'Error:', error)
        return null;
    }
  };


  getUserById = async id => {
    try {
      if (!id || typeof (id) !== "string" || id.length < 5) {
        console.log("El id ingresado es incorrecto");
        return null
    }
      const user = await this.dao.getUserById(id);
      return user;
    } catch (error) {
        console.log('Error getting user user' ,'Error:', error)
        return null;
    }
  };
  
  addUser = async userDto => {
    try {
      const user = await this.dao.addUser(userDto);
      return user;
    } catch (error) {
        console.log('Error adding user user',userDto,'Error:', error)
        return null;
    }
  };
}


