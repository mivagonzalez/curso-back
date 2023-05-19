const { Router } = require("express");
const handlePolicies = require("../middleware/handlePolicies.middleware");
const { policies } = require('../middleware/constants');
const LogsController = require('../controllers/logs.controller')
const { API_VERSION } = require('../config/config');

class LogsRoutes {
    path = `/api/${API_VERSION}/loggerTest`;
    router = Router();
    controller = new LogsController();

    constructor() {
        this.initCoursesRoutes();
    }

    initCoursesRoutes() {
        this.router.get(this.path, handlePolicies([policies.PUBLIC]), this.controller.createLogs);
    }
}

module.exports = LogsRoutes;
