const { Router } = require("express");
const { API_VERSION } = require('../config/config');
const TicketController = require('../controllers/ticket.controller')
const authMdw = require("../middleware/auth.middleware");
const handlePolicies = require("../middleware/handlePolicies.middleware");
const { policies } = require('../middleware/constants');
class TicketRoutes {
  path = `/api/${API_VERSION}/ticket`;
  router = Router();
  controller = new TicketController()

  constructor() {
    this.initCoursesRoutes();
  }

  initCoursesRoutes() {
    this.router.get(`${this.path}`, authMdw, handlePolicies([policies.USER]), this.controller.getTicket);
    this.router.post(`${this.path}`, authMdw, handlePolicies([policies.USER]), this.controller.createTicket);
    
  }
}

module.exports = TicketRoutes;
