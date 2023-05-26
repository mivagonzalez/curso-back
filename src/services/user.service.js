const { Logger } = require('../helpers')

module.exports = class UserService {
  constructor(dao) {
    this.dao = dao;
  }

  getUser = async email => {
    try {
      const user = await this.dao.getUser(email);
      return user;
    } catch (error) {
        Logger.error('Error getting user user' ,'Error:', error)
        return null;
    }
  };


  getUserById = async id => {
    try {
      if (!id || typeof (id) !== "string" || id.length < 5) {
        Logger.error("El id ingresado es incorrecto");
        return null
    }
      const user = await this.dao.getUserById(id);
      return user;
    } catch (error) {
        Logger.error('Error getting user user' ,'Error:', error)
        return null;
    }
  };
  
  addUser = async userDto => {
    try {
      const user = await this.dao.addUser(userDto);
      return user;
    } catch (error) {
        Logger.error('Error adding user user',userDto,'Error:', error)
        return null;
    }
  };

  updateUserPassword = async (userId, newPassword) => {
    try {
      return await this.dao.updateUserPassword(userId, newPassword);
    } catch (error) {
      Logger.error('Error updating password', error)
      return null;
    }
  }
}


