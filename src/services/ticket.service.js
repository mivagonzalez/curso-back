const { Logger } = require('../helpers')

module.exports = class TicketService {
  constructor(dao) {
    this.dao = dao;
  }

  createTicket = async ticketDTO => {
    try {
      const ticket = await this.dao.createTicket(ticketDTO);
      return ticket;
    } catch (error) {
        Logger.error('Error creating ticket in service. Ticket,', ticketDTO, 'Error:', error)
        return null;
    }
  };

  getTicket = async (query = {}) => {
    try {
        const ticket = await this.dao.getTicket(query)
        return ticket;
    } catch (error) {
        Logger.error('Error getting ticket in service', query ,'Error:', error)
        return null;
    }
  };
}
