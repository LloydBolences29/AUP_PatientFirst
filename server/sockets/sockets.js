const socketIo = require('socket.io');


let io
const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "https://localhost:5173",  // Frontend origin
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true
    },
    transports: ['websocket'], // Explicitly specify 'websocket' transport
  });

  io.on("connection", (socket) => {
    console.log("Connected to Socket.IO server!");

    // Listen for the 'joinDepartmentRoom' event to add the user to a room
    socket.on("joinDepartmentRoom", (department) => {
      console.log("Joining room for department:", department);
      socket.join(department);  // Join the room named by the department
    });

    // Listen for 'sendQueue' event to generate a queue number
    socket.on("sendQueue", async (data) => {
      const { department, queueNumber } = data;

      console.log("Queue Number Generated for", department, ":", queueNumber);

      // Emit the event to the room for that specific department
      io.to(department).emit("queueGenerated", {
        department,
        queueNumber,
      });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initializeSocket, getIo };