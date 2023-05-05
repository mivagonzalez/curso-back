const { v4: uuidv4 } = require('uuid');

class TicketDTO {
    constructor(ticket){
        this.purchase_datetime = ticket.purchase_datetime;
        this.code = uuidv4();
        this.amount = ticket.amount || 0;
        this.purchaser = ticket.purchaser || "";
    }
}

module.exports = TicketDTO;