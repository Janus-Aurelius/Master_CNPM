import { Server } from 'socket.io';

export const setupSocketHandlers = (io: Server) => {
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });

        // Add more socket event handlers here
    });
}; 