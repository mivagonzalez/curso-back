const { Router } = require("express");
const authMdw = require("../middleware/auth.middleware");
const handlePolicies = require("../middleware/handlePolicies.middleware");
const { policies } = require('../middleware/constants');
const MocksController = require('../controllers/mocks.controller')

class MockRoutes {
    path = `/`;
    router = Router();
    controller = new MocksController();

    constructor() {
        this.initCoursesRoutes();
    }

    initCoursesRoutes() {
        this.router.get(`${this.path}mockingproducts`,authMdw, handlePolicies([policies.PUBLIC]), this.controller.getMockProducts);
    }
}

module.exports = MockRoutes;
