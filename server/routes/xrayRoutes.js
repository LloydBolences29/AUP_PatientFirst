const {Router} = require("express");
const router = Router();
const Xray = require("../model/xrayModel"); // Import the X-ray model
const Patient = require("../model/Patient"); // Import the Patient model
const Billing = require("../model/BillingModel"); // Import the Billing model
const moment = require("moment");


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

function getDateRange(selectedDate, type) {
    const startDate = new Date(selectedDate);
    let endDate = new Date(selectedDate);
  
    if (type === "daily") {
      endDate.setDate(startDate.getDate() + 1);
    } else if (type === "monthly") {
      startDate.setDate(1);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0); // Set the last day of the month
    } else if (type === "yearly") {
      startDate.setMonth(0);
      startDate.setDate(1);
      endDate.setFullYear(endDate.getFullYear() + 1);
      endDate.setMonth(0);
      endDate.setDate(0);
    }
  
    return { startDate, endDate };
  }
  

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
            department: "X-ray",
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
            department: "X-ray",
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
            department: "X-ray",
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

  // Route: /xray/visit-counts
  router.get("/visit-counts", async (req, res) => {
    try {
      const { startDate, month, year } = req.query;
  
      const startMoment = startDate
        ? moment(startDate) // If startDate is provided, parse it
        : moment().startOf("day"); // Default to today's date if not provided
  
      const monthMoment = month
        ? moment(month, "MMMM YYYY") // If month is provided, parse it
        : moment().startOf("month"); // Default to the start of the current month if not provided
  
      const yearMoment = year
        ? moment(year, "YYYY") // If year is provided, parse it
        : moment().startOf("year"); // Default to the start of the current year if not provided
  
      // Use the same logic to query for visits
      const [todayCount, monthCount, yearCount] = await Promise.all([
        Billing.countDocuments({
          department: "X-ray",
          status: "paid",
          createdAt: { $gte: startMoment.toDate() },
        }),
        Billing.countDocuments({
          department: "X-ray",
          status: "paid",
          createdAt: { $gte: monthMoment.toDate() },
        }),
        Billing.countDocuments({
          department: "X-ray",
          status: "paid",
          createdAt: { $gte: yearMoment.toDate() },
        }),
      ]);
  
      res.json({
        today: todayCount,
        month: monthCount,
        year: yearCount,
      });
    } catch (err) {
      console.error("Error getting visit summary:", err);
      res.status(500).json({ message: "Server error" });
    }
  });


module.exports = router;