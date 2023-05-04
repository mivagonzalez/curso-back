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
}
