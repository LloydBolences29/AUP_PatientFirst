const express = require("express");
const router = express.Router();
const Queue = require("../model/queueModel");
const QueueCounter = require("../model/queueCounter");
const { getIo } = require('../sockets/sockets'); // adjust path as needed


const getQueuePrefix = (department) => {
    const prefixes = {
      pharmacy: 'PH',
      cashier: 'CA',
      lab: 'LB',
      xray: 'XR',
      consultation: 'CN',
    };
  
    return prefixes[department] || 'XX';
  };

// Generate a queue number for a specific department
const generateQueueNumber = async (department) => {
    let counter = await QueueCounter.findOne({ department });
  
    if (!counter) {
      counter = await QueueCounter.create({ department, nextQueueNumber: 1 });
    } else {
      counter.nextQueueNumber = counter.nextQueueNumber >= 999 ? 1 : counter.nextQueueNumber + 1;
      await counter.save();
    }
  
    const prefix = getQueuePrefix(department);
    const formattedNumber = String(counter.nextQueueNumber).padStart(3, '0');
  
    return `${prefix}-${formattedNumber}`;
  };

router.post("/generateQueue", async (req, res) => {
    const { department } = req.body;  // Get department from request body

  if (!department || !['pharmacy', 'cashier', 'lab', 'xray', 'consultation'].includes(department)) {
    return res.status(400).json({ error: 'Invalid department' });
  }

  try {
    // Generate the queue number for the department
    const queueNumber = await generateQueueNumber(department);

    // Create a new queue transaction document
    const queueTransaction = new Queue({
      queueNumber: queueNumber.toString(),
      department: department,
      status: 'waiting',  // Default status is "waiting"
    });

    // Save the queue transaction to the database
    await queueTransaction.save();

    const io = getIo();
    io.emit('queueGenerated', { 
      department: department,
      queueNumber: queueNumber.toString(),
      status: 'waiting',
    });

    // Respond with the generated queue number and transaction details
    res.status(201).json({ message: 'Queue created', queueNumber, department });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

//get all the queues in the system in order FIFO
router.get('/all-queues', async (req, res) => {
  try {
    const queues = await Queue.find().sort({ createdAt: 1 }); // FIFO based on creation time
    res.json(queues);
  } catch (error) {
    console.error("Error fetching queues:", error);
    res.status(500).json({ error: 'Server error' });
  }
})

//get the queue according to the queueNumber in the system
router.get('/queue/:queueNumber', async (req, res) => {
  const { queueNumber } = req.params;

  try {
    const queue = await Queue.findOne({ queueNumber });

    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    res.json(queue);
  } catch (error) {
    console.error("Error fetching queue:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/queues', async (req, res) => {
  const { department, status } = req.query;

  if (!department || !status) {
    return res.status(400).json({ message: 'Department and status are required' });
  }

  try {
    const statusArray = statuses?.split(','); // e.g., "waiting,sent-to-cashier"

    const queues = await Queue.find({
      department,
      status: { $in: statusArray }
    }).sort({ createdAt: 1 }); // optional: oldest first

    res.json(queues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

//fetch the entries according to their status
router.get('/status/:status', async (req, res) => {
  const { status } = req.params;
  const { department } = req.query; // Get department from query parameters

  try {
    const queues = await Queue.find({ status, department }).sort({ createdAt: 1 }); // FIFO based on creation time

    if (!queues.length) {
      return res.status(404).json({ message: 'No queues found with this status' });
    }

    res.json(queues);
  } catch (error) {
    console.error("Error fetching queue:", error);
    res.status(500).json({ error: 'Server error' });
  }
})
// fetch waiting queue transactions in the correct order
router.get('/current/:department', async (req, res) => {
  const { department } = req.params;

  try {
    const queues = await Queue.find({
      department,
      status: 'waiting'
    }).sort({ createdAt: 1 }); // FIFO based on creation time

    res.json(queues);
  } catch (error) {
    console.error("Error fetching queue:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

//Serve next 
router.post('/serve-next/:department', async (req, res) => {
  const { department } = req.params;

  try {
    const next = await Queue.findOneAndUpdate(
      { department, status: 'waiting' },
      { status: 'serving' },
      { sort: { createdAt: 1 }, new: true }
    );

    if (!next) {
      return res.status(404).json({ message: 'No waiting queue found' });
    }

    res.json(next);
  } catch (error) {
    console.error("Error serving queue:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

//finish a queue
router.patch('/complete/:queueNumber', async (req, res) => {
  const { queueNumber } = req.params;
  const { status } = req.body; // <-- This is your status update

  try {
    const updated = await Queue.findOneAndUpdate(
      { queueNumber },
      { status }, // <-- Use provided status
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    // Emit socket event after successful update
    const io = getIo();
    io.emit("queueStatusUpdate", {
      queueNumber,
      newStatus: status, // <-- Use the actual status from request
    });

    res.json(updated); // Respond after emit
  } catch (error) {
    console.error("Error updating queue status:", error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get("/waiting", async (req, res) => {
  const { department } = req.query; // Get department from query parameters
  try {
    const waitingQueues = await Queue.find({ status: "waiting", department });
    res.status(200).json(waitingQueues);
  } catch (error) {
    console.error("Error fetching waiting queues:", error);
    res.status(500).json({ error: "Server error" });
  }
})          

router.get("/sentToCashier", async (req, res) => {
  const { department } = req.query; // Get department from query parameters
  try {
    const sentToCashierQueues = await Queue.find({ status: "sent-to-cashier", department });
    res.status(200).json(sentToCashierQueues);
  } catch (error) {
    console.error("Error fetching sent to cashier queues:", error);
    res.status(500).json({ error: "Server error" });
  }
  
})

router.get("/dispensed", async (req, res) => {
  const { department } = req.query; // Get department from query parameters
  try {
    const dispensedQueues = await Queue.find({ status: "dispensing", department });
    res.status(200).json(dispensedQueues);
  } catch (error) {
    console.error("Error fetching dispensed queues:", error);
    res.status(500).json({ error: "Server error" });
  }
})



module.exports = router;