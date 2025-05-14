const express = require('express');
const router = express.Router();
const FormRequest = require("../model/RequestForms.js");

// GET all pending requests
router.get('/pending', async (req, res) => {
  try {
    const requests = await FormRequest.find({ status: 'Pending' }).populate('patientId', 'firstname lastname');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await FormRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});


// POST a new form request
router.post('/', async (req, res) => {
  try {
    const { patientId, requestTypes, purpose } = req.body;

    if (!patientId || !requestTypes || requestTypes.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newRequest = new FormRequest({
      patientId,
      requestTypes,
      purpose,
      status: 'Pending',
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    console.error('Error creating form request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;
