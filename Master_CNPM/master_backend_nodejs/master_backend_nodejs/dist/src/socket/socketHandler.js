"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketHandlers = void 0;
var setupSocketHandlers = function (io) {
    io.on('connection', function (socket) {
        console.log('Client connected:', socket.id);
        socket.on('disconnect', function () {
            console.log('Client disconnected:', socket.id);
        });
        // Add more socket event handlers here
    });
};
exports.setupSocketHandlers = setupSocketHandlers;
