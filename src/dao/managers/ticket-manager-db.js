const ticketModel = require("../models/ticket.model");


class TicketManager {

    createTicket = async (ticket) => {
        console.log(ticket)
        if(!ticket.code || ticket.code.length < 8 || !ticket.purchase_datetime || !ticket.amount || ticket.amount <= 0 || !ticket.purchaser || ticket.purchaser.length < 5 ) {
            console.log('Ticket can not be created without all the fields');
            return null;
        }
        try {
            return await ticketModel.create(ticket);
        } catch (error) {
            console.log(
                "🚀 Error creating ticket:",
                error
            );
            return null
        }
    }

    getTicket = async (query = {}) => {
        try {
            const ticket = await ticketModel.findOne(query) ?? null;
            return ticket
        } catch (error) {
            console.log(
                "🚀 Error getting ticket:", query, 'Error:',
                error
            );
            return null
        }
    }


};

module.exports = TicketManager;