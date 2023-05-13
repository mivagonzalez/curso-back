const ticketModel = require("../models/ticket.model");
const {ERRORS, CustomError } = require('../../services/errors/errors')


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
            CustomError.createError(ERRORS.CREATION_ERROR.name,'','Can not create ticket', ERRORS.CREATION_ERROR.code)
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
            CustomError.createError(ERRORS.INVALID_PARAMETER_ERROR.name,'','can not get ticket with provided query', ERRORS.INVALID_PARAMETER_ERROR.code)
        }
    }


};

module.exports = TicketManager;