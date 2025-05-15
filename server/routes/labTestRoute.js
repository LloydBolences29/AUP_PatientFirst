const { Router } = require("express");
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

  try {
    const test = await LabTest.find({
      category: { $regex: new RegExp(category, "i") },
    });

    if (!test) {
      return res.status(404).json({ message: "Lab test category not found" });
    }

    res.status(200).json(test);
  } catch (error) {
    console.error("Error fetching lab test data:", error);
    res.status(500).json({ message: "Error fetching lab test data", error });
  }
});

router.post("/sendLabBilling/:patientId", async (req, res) => {
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
      return res
        .status(400)
        .json({ message: "Items must be a non-empty array" });
    }

    // Fetch prices from the X-ray model
    const processedItems = await Promise.all(
      items.map(async (item) => {
        // Find the category that includes this procedure
        const lab = await LabTest.findOne({ name: item.name });

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
      })
    );

    // Create the billing entry
    const newBilling = new Billing({
      patientId: patient._id, // Use the patient's ObjectId
      department: "Laboratory",
      items: processedItems,
      totalAmount: processedItems.reduce((sum, item) => sum + item.total, 0),
      status: "pending",
    });

    await newBilling.save();
    res
      .status(201)
      .json({
        message: "Lab billing created successfully!",
        billing: newBilling,
      });
  } catch (error) {
    console.error("Error sending Lab billing:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

  router.get("/sales-over-time", async (req, res) => {
    const { type } = req.query;
  
    if (!type) {
      return res.status(400).json({ error: "Type is required" });
    }
  
    let dateFormat;
    if (type === "daily") dateFormat = "%Y-%m-%d";
    else if (type === "monthly") dateFormat = "%Y-%m";
    else if (type === "yearly") dateFormat = "%Y";
  
    try {
      const result = await Billing.aggregate([
        {
          $match: {
            department: "Laboratory",
            status: "paid",
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: dateFormat, date: "$createdAt" },
            },
            totalSales: { $sum: "$totalAmount" },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      const formatted = result.map((item) => ({
        date: item._id,
        sales: item.totalSales,
      }));
  
      res.json(formatted);
    } catch (error) {
      console.error("Error generating chart data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

    router.get("/sales-summary", async (req, res) => {
      try {
        const now = new Date();
    
        // Start of today
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);
    
        // Start of month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
        // Start of year
        const startOfYear = new Date(now.getFullYear(), 0, 1);
    
        const [totals] = await Billing.aggregate([
          {
            $match: {
              department: "Laboratory", // Ensure this matches the department in your model                                 
              status: "paid",
            },
          },
          {
            $facet: {
              today: [
                { $match: { createdAt: { $gte: startOfToday } } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } },
              ],
              month: [
                { $match: { createdAt: { $gte: startOfMonth } } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } },
              ],
              year: [
                { $match: { createdAt: { $gte: startOfYear } } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } },
              ],
            },
          },
        ]);
    
        res.json({
          today: totals.today[0]?.total || 0,
          month: totals.month[0]?.total || 0,
          year: totals.year[0]?.total || 0,
        });
      } catch (error) {
        console.error("Error fetching sales summary:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    
<<<<<<< HEAD
      router.get("/visit-count", async (req, res) => {
        const { type } = req.query;
      
        if (!type) {
          return res.status(400).json({ error: "Type is required" });
        }
      
        let dateFormat;
        let now = new Date();
        let startDate;
      
        if (type === "daily") {
          dateFormat = "%Y-%m-%d";
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // today 00:00
        } else if (type === "monthly") {
          dateFormat = "%Y-%m";
          startDate = new Date(now.getFullYear(), now.getMonth(), 1); // 1st of this month
        } else if (type === "yearly") {
          dateFormat = "%Y";
          startDate = new Date(now.getFullYear(), 0, 1); // Jan 1st of this year
        } else {
          return res.status(400).json({ error: "Invalid type" });
        }
      
        try {
          const result = await Billing.aggregate([
            {
              $match: {
                department: "Laboratory",
                status: "paid",
              },
            },
            {
              $group: {
                _id: {
                  $dateToString: { format: dateFormat, date: "$createdAt" },
                },
                visitCount: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ]);
      
          const data = result.map((item) => ({
            date: item._id,
            count: item.visitCount,
          }));
      
          // Get the most recent record (today's/month's/year's count)
          const todayKey = formatDateKey(now, type);
          const todayData = data.find((item) => item.date === todayKey);
          const totalCountForPeriod = todayData ? todayData.count : 0;
      
          res.json({
            chartData: data,
            totalForSelectedPeriod: totalCountForPeriod,
          });
        } catch (error) {
          console.error("Error:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      
        function formatDateKey(date, type) {
          const y = date.getFullYear();
          const m = `${date.getMonth() + 1}`.padStart(2, "0");
          const d = `${date.getDate()}`.padStart(2, "0");
      
          if (type === "daily") return `${y}-${m}-${d}`;
          if (type === "monthly") return `${y}-${m}`;
          if (type === "yearly") return `${y}`;
        }
      });
    
=======
>>>>>>> 1eea76120af253bb703e77d4c23d8974cd9e4ebc



module.exports = router;
