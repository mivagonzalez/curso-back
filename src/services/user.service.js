const { Logger } = require('../helpers')

module.exports = class UserService {
  constructor(dao) {
    this.dao = dao;
  }

  getAllUsers = async () => {
    try {
      const users = await this.dao.getAllUsers();
      return users;
    } catch (error) {
        Logger.error('Error getting all users on service' ,'Error:', error)
        return null;
    }
  };
  
  getUser = async email => {
    try {
      const user = await this.dao.getUser(email);
      return user;
    } catch (error) {
        Logger.error('Error getting user on getuser' ,'Error:', error)
        return null;
    }
  };

  updateLastLogIn = async (userId) => {
    try {
      return await this.dao.updateLastLogIn(userId);
    } catch (error) {
        Logger.error('Error setting last login on service' ,'Error:', error)
        return null;
    }
  }
  
  updateDocuments = async (userId, updatedDocs) => {
    try {
      return await this.dao.updateDocuments(userId, updatedDocs);
    } catch (error) {
        Logger.error('Error updating documents in service' ,'Error:', error)
        return null;
    }
  }

  getUserById = async id => {
    try {
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
  
  deleteUser = async userId => {
    try {
      return await this.dao.deleteUser(userId);
    } catch (error) {
        Logger.error('Error deleting user user','Error:', error)
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
  
  updateRole = async (userId, newRole) => {
    try {
      return await this.dao.updateRole(userId, newRole);
    } catch (error) {
      Logger.error('Error updating role', error)
      return null;
    }
  }

  deleteInactiveUsers = async () => {
    try {
      return await this.dao.deleteInactiveUsers();
    } catch (error) {
      Logger.error('Error deleting inactive users', error)
      return null;
    }
  }
}


