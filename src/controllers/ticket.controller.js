
const { TicketService } = require('../services')
const moment = require('moment')
const { TicketDTO } = require('../dto')
const { Logger } = require('../helpers')

class TicketController {

    createTicket = async (req, res) => {
        try {
            const { amount } = req.body;
            if( !amount || Number(amount) <= 0 ) {
                Logger.error('Ticket can not be created without amount');
                return null;
            }
            const purchase_datetime = moment().format('MMMM Do YYYY, h:mm:ss a');
            const purchaser = req.user.email;
            const ticketDTO = new TicketDTO({purchaser, purchase_datetime, amount})
            const ticket = await TicketService.createTicket(ticketDTO) ?? null;
            if (!ticket) {
                return res.status(400).json({
                    message: `Ticket not created `,
                    ticket: null
                });
            }

            return res.json({
                message: `Ticket created succesfully`,
                ticket: ticket,
            });
        } catch (error) {
            Logger.error(
                "🚀 Error when creating ticket. Error:",
                error
            );
        }
    };

    getTicket = async (req, res) => {
        try {
            const {email, ticketId} = req.query;
            let queryObject = {};
            if (ticketId) {
                queryObject= {
                    _id : ticketId
                }
            }else if(email) {
                queryObject= {
                    purchaser: email
                }
            }
            const ticket = await TicketService.getTicket(queryObject);
            if (ticket) {
                return res.status(200).json({
                    message: `Ticket found Successfully`,
                    ticket: ticket,
                });
            }

            return res.status(400).json({
                message: `Ticket not found.`,
                ticket: null,
                ok: false
            });

        } catch (error) {
            Logger.error(
                "🚀Error when searching for ticket. Error:",
                error
            );
        }
    };

}

module.exports = TicketController;