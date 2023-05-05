
const { TicketService } = require('../services')
const moment = require('moment')
const { TicketDTO } = require('../dto')
class TicketController {

    createTicket = async (req, res) => {
        try {
            const { amount } = req.body;
            if( !amount || Number(amount) <= 0 ) {
                console.log('Ticket can not be created without amount');
                return null;
            }
            const purchase_datetime = moment().format('MMMM Do YYYY, h:mm:ss a');
            const purchaser = req.user.email;
            const ticketDTO = new TicketDTO({purchaser, purchase_datetime, amount})
            console.log(purchase_datetime,purchaser,amount,'DATOSSS')
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
            console.log(
                "🚀 Error when creating ticket. Error:",
                error
            );
        }
    };

    getTicket = async (req, res) => {
        try {
            const {email} = req.query;
            console.log(email)
            const ticket = await TicketService.getTicket({purchaser: email });
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
            console.log(
                "🚀Error when searching for ticket. Error:",
                error
            );
        }
    };

}

module.exports = TicketController;