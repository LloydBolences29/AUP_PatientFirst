const {Router} = require("express");
const router = Router();
const Xray = require("../model/xrayModel"); // Import the X-ray model
const Patient = require("../model/Patient"); // Import the Patient model
const Billing = require("../model/BillingModel"); // Import the Billing model

router.get("/getXray", async (req, res) => {
    try {
        const xray = await Xray.find();
        res.status(200).json(xray);
    } catch (error) {
        res.status(500).json({ message: "Error fetching xray data", error });
    }
});

// Get xray by Procedure name
router.get("/getXray/:category", async (req, res) => {
    const { category } = req.params;
    console.log("Category received:", category); // Add this log


    try {
        // Find the category by name and return all its procedures
        const xray = await Xray.findOne({ Category: { $regex: new RegExp(category, 'i') } });

        if (!xray) {
            return res.status(404).json({ message: "X-ray category not found" });
        }

        // Return the category and the list of procedures under that category
        res.status(200).json({
            Category: xray.Category,
            Procedures: xray.Procedures
        });
    } catch (error) {
        console.error("Error fetching X-ray data:", error);
        res.status(500).json({ message: "Error fetching X-ray data", error });
    }
});

router.post ("/sendXrayBilling/:patientId", async (req, res) => {   
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
        const xray = await Xray.findOne({ "Procedures.Procedure": item.Procedure });
      
        if (!xray) {
          throw new Error(`X-ray procedure "${item.Procedure}" not found`);
        }
      
        const procedure = xray.Procedures.find(proc => proc.Procedure === item.Procedure);
      
        if (!procedure) {
          throw new Error(`Procedure "${item.Procedure}" not found in category "${xray.Category}"`);
        }
      
        return {
          type: "procedure",
          name: item.Procedure,
          quantity: item.quantity || 1,
          price: procedure.Price,
          total: (item.quantity || 1) * procedure.Price,
        };
      }));
      

    // Create the billing entry
    const newBilling  = new Billing({
        patientId: patient._id, // Use the patient's ObjectId
        department: "X-ray",
        items: processedItems,
        totalAmount: processedItems.reduce((sum, item) => sum + item.total, 0),
        status: "pending",
    });

    await newBilling.save();
    res.status(201).json({ message: "X-ray billing created successfully!", billing: newBilling });
} catch (error) {
    console.error("Error sending X-ray billing:", error);
    res.status(500).json({ message: "Server error", error: error.message });
}
}
);




module.exports = router;