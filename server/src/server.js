require('dotenv').config();
// Actually, if I run from server dir, it's just .env. If I run from root, it's server/.env. 
// Standard practice: require('dotenv').config(); and run from the dir where .env is.
// I placed .env in server/.env. So if I run `node src/server.js` from `server` dir, `require('dotenv').config()` works.

const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { initSocket } = require('./sockets');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in .env');
    process.exit(1);
}

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:3000', process.env.CLIENT_URL],
        credentials: true,
    },
});

initSocket(io);

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
