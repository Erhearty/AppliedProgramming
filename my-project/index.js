import logger from './logger.js';

logger.emit('log', { level: 'info', message: 'Server started successfully' });

setTimeout(() => {
    logger.emit('log', { level: 'info', message: 'GET / accessed' });
}, 1000);

setTimeout(() => {
    logger.emit('log', { level: 'warning', message: 'Unknown route requested' });
}, 2000);

setTimeout(() => {
    logger.emit('log', { level: 'error', message: 'Internal server error' });
}, 3000);
