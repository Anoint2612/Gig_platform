const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io;

const initSocket = (socketIo) => {
    io = socketIo;

    io.use(async (socket, next) => {
        try {
            const cookies = cookie.parse(socket.handshake.headers.cookie || '');
            const token = cookies.token;

            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return next(new Error('User not found'));
            }

            socket.user = user;
            next();
        } catch (error) {
            console.error('Socket auth error:', error.message);
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.email} (${socket.id})`);

        // Join a room with the user's ID so we can emit to them specifically
        socket.join(socket.user._id.toString());

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = { initSocket, getIO };
