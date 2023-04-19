import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    console.log("/jobs");
    res.status(200).json({
        msg: "jobs",
    });
});

export default router;
