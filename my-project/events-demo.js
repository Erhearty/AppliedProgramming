import { EventEmitter } from 'events';
const emitter = new EventEmitter();
emitter.on('userLoggedIn', (username) => {
console.log(`User ${username} has logged in.`);
});
emitter.emit('userLoggedIn', 'student01');
