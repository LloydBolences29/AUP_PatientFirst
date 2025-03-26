const { Router } = require("express");
const router = Router();
const Visit = require("../model/VisitTable")

router.get("/get-patients", async (req, res) => {
    try {
      const visits = await Visit.find({ status: "Waiting" }).populate("patient_id");


      res.status(200).json(visits);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching visits', error });
      }
})

router.get('/visits/:_id', async (req, res) => {
    try {
      const visit = await Visit.findById(req.params._id).populate('patient_id');
      if (!visit) return res.status(404).json({ message: 'Visit not found' });
      res.status(200).json(visit);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching visit', error });
    }
  });
  router.put("/visits/:id/complete", async (req, res) => {
    try {
        const visit = await Visit.findByIdAndUpdate(
            req.params.id,
            { status: "Completed" },
            { new: true }
        );
        if (!visit) return res.status(404).json({ message: "Visit not found" });
        res.status(200).json({ message: "Visit marked as completed", visit });
    } catch (error) {
        res.status(500).json({ message: "Error updating visit status", error });
    }
});

module.exports = router