const winston = require('winston');

const levels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
};

const colors = {
    debug: 'blue',
    http: 'green',
    info: 'cyan',
    warning: 'yellow',
    error: 'red',
    fatal: 'magenta'
};

winston.addColors(colors);

let transports = [];

switch (process.env.NODE_ENV) {
    case 'development':
        transports = [
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                ),
            }),
        ];
        break;
    default:
        transports = [
            new winston.transports.Console({
                level: 'info',
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                ),
            }),
            new winston.transports.File({
                filename: 'errors.log',
                level: 'error',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                ),
            }),
        ];
        break;
}

const Logger = winston.createLogger({ levels, transports });

module.exports = Logger;
