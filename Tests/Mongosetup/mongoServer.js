const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod = null;

const mongoServer = {
    async connect() {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        
        mongod = await MongoMemoryServer.create();
        const mongoUri = mongod.getUri();
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
    },

    async disconnect() {
        await mongoose.disconnect();
        if (mongod) {
            await mongod.stop();
        }
    }
};

module.exports = mongoServer;