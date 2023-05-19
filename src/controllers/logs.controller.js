
const { Logger } = require('../helpers')

class LogsController {

    createLogs = async (req, res) => {
            Logger.fatal('FATAL ERROR LOG')
            Logger.error('ERROR LOG')
            Logger.warning('WARNING LOG')
            Logger.info('INFO LOG')
            Logger.debug('DEBUG LOG')
            return res.json({
                status: 'success',
                message: "Logs created"
            })
    };
}

module.exports = LogsController;