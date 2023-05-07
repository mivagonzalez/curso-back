const { generateProducts } = require('../utils');

class MocksController {

    getMockProducts = async (req, res) => {
        
        const products = generateProducts(100);
        if (products) {
            return res.json({
                status: 'success',
                paytload: products
            })
        }
    };
}

module.exports = MocksController;