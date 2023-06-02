
const yaml = require('js-yaml');
const fs = require('fs');

const components = yaml.load(fs.readFileSync('./src/docs/components.yaml', 'utf8'));
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Ecommerce API Documentation",
            description: "Ecommerce api documentation. It includes product and cart modules documentation"
        },
        components: components.components // add this line
    },
    apis: [`${process.cwd()}/src/docs/**/*.yaml`]
}

module.exports = swaggerOptions; 