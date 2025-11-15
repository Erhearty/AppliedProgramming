import { EventEmitter } from 'events';
import chalk from 'chalk';

class Logger extends EventEmitter {}

const logger = new Logger();

// Прослуховування події "log"
logger.on('log', ({ level, message }) => {
    const time = new Date().toLocaleString();

    let coloredMessage;

    switch (level) {
        case 'info':
            coloredMessage = chalk.greenBright(message);
            break;
        case 'warning':
            coloredMessage = chalk.yellowBright(message);
            break;
        case 'error':
            coloredMessage = chalk.redBright(message);
            break;
        default:
            coloredMessage = message;
    }

    console.log(`[${time}] ${level.toUpperCase()}: ${coloredMessage}`);
});

export default logger;
