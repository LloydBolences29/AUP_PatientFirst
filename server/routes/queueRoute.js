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

module.exports = router;