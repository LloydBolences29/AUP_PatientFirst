const express = require("express");
const router = express.Router();
const Checkup = require("../model/checkup");
const icdModel  = require("../model/icdcode")

router.get("/mostDiagnosed", async (req, res) => {
    try {
      const { groupBy } = req.query; // 'day', 'month', or 'year'
      const dateFormat =
        groupBy === "month" ? "%Y-%m" :
        groupBy === "year" ? "%Y" :
        "%Y-%m-%d"; // default to daily

        const icdCollectionName = icdModel.collection.name;
        console.log("ICD collection name:", icdCollectionName);


        const trylang = [
            { $match: { icd: { $exists: true, $ne: [] } } },
            { $unwind: "$icd" },
            { 
              $lookup: {
                from: icdCollectionName,
                localField: "icd",
                foreignField: "_id",
                as: "icdData"
              } 
            },
            // Log the intermediate results to check the lookup
            { $limit: 1 }
          ];
          
          const intermediateResult = await Checkup.aggregate(trylang);
          console.log("Intermediate result:", JSON.stringify(intermediateResult, null, 2));
  
          const pipeline = [
            { $match: { icd: { $exists: true, $ne: [] } } },
            { $unwind: "$icd" },
            // First, try converting the string ID to ObjectId if needed
            {
              $addFields: {
                icdObjectId: { 
                  $toObjectId: { $ifNull: ["$icd", "000000000000000000000000"] } 
                }
              }
            },
            { 
              $lookup: {
                from: icdCollectionName,
                localField: "icdObjectId", // Use the converted ObjectId
                foreignField: "_id",
                as: "icdData"
              } 
            },
            { $unwind: { path: "$icdData", preserveNullAndEmptyArrays: true } },
            {
              $group: {
                _id: { $ifNull: ["$icdData.shortdescription", "Unknown"] },
                count: { $sum: 1 }
              }
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
              $project: {
                _id: 0,
                diagnosis: "$_id",
                count: "$count"
              }
            }
          ];
      
          const result = await Checkup.aggregate(pipeline);
          console.log("Final result:", result);
          
          res.status(200).json(result);
    } catch (error) {
      console.error("Failed to fetch most diagnosed illnesses:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  

module.exports = router