import express from "express";
import { validateToken } from "../lib/auth.js";
import { Worker } from "worker_threads";

const router = express.Router();

/**
 * Create a new submission.
 * 1. All the data needed to execute a code needs to be sent in the body
 */
router.post("/", validateToken, async (req, res) => {
    const response = {};
    const timer = { start: Date.now() };
    try {
        /**
         * Initialize a box
         */
        if (global.box_id > 999) {
            global.box_id = 1;
        } else {
            global.box_id = global.box_id + 1;
        }

        // Get a local copy of the box_id for further processing
        const box_id = global.box_id;

        /**
         * Get input parameters
         */
        const language = req.body.language;
        const source_code = req.body.source_code;

        const time = req.body.time || 5;

        /**
         * This is the worker that compiles and runs the code
         */
        const worker = new Worker("./app/submission/worker.js", {
            workerData: {
                box_id,
                language,
                source_code,
                timer,
                time,
            },
        });

        /**
         * The response is got here.
         */
        worker.on("message", (response) => {
            console.log("message", response);
            return res.status(200).json({
                msg: "ok",
                response,
            });
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            msg: "not ok",
            response,
        });
    }
});

export default router;
