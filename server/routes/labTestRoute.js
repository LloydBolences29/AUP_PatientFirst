const {Router} = require("express");
const router = Router();
const LabTest = require("../model/labTest"); // Import the LabTest model
const Patient = require("../model/Patient"); // Import the Patient model
const Billing = require("../model/BillingModel"); // Import the Billing model

router.get("/getLabTest", async (req, res) => {
    try {
        const labTests = await LabTest.find();
        res.status(200).json(labTests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching lab test data", error });
    }
});

    router.get("/getLabTest/:category", async (req, res) => {
        const { category } = req.params;
        console.log("Category received:", category); // Add this log

        try{
            const test = await LabTest.find({ category: { $regex: new RegExp(category, 'i') } });
            
            if (!test) {
                return res.status(404).json({ message: "Lab test category not found" });
            }

            res.status(200).json(test);
        } catch (error) {
            console.error("Error fetching lab test data:", error);
            res.status(500).json({ message: "Error fetching lab test data", error });
        }
    })

    router.post ("/sendLabBilling/:patientId", async (req, res) => {   
    try {
        const { patientId } = req.params;
        const { items } = req.body; // Expecting items to be an array of selected procedures
    
        if (!patientId) {
            return res.status(400).json({ message: "Patient ID is required" });
        }
    
        const patient = await Patient.findOne({ patient_id: patientId });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
    
    
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Items must be a non-empty array" });
        }
    
    
        // Fetch prices from the X-ray model
        const processedItems = await Promise.all(items.map(async (item) => {
            // Find the category that includes this procedure
            const lab = await LabTest.findOne({ "name": item.name });
          
            if (!lab) {
              throw new Error(`Lab test "${item.name}" not found`);
            }
          
            return {
              type: "test",
              name: item.name,
              quantity: item.quantity || 1,
              price: item.price,
              total: (item.quantity || 1) * item.price,
            };
          }));
          
    
        // Create the billing entry
        const newBilling  = new Billing({
            patientId: patient._id, // Use the patient's ObjectId
            department: "Laboratory",
            items: processedItems,
            totalAmount: processedItems.reduce((sum, item) => sum + item.total, 0),
            status: "pending",
        });
    
        await newBilling.save();
        res.status(201).json({ message: "Lab billing created successfully!", billing: newBilling });
    } catch (error) {
        console.error("Error sending Lab billing:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
    }
    );




module.exports = router;