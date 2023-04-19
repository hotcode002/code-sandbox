import express from "express";
import { spawn, spawnSync } from "child_process";
const router = express.Router();

router.get("/", (req, res) => {
    console.log("/jobs");
    res.status(200).json({
        msg: "jobs",
    });
});

router.get("/:id", (req, res) => {
    console.log("get the status of a submission id");
});

/**
 * Create a new submission.
 * 1. A unique id needs to be sent per submission.
 * 2. The unique id is needed to later update the status of the submission
 * 3. All the data needed to execute a code needs to be sent in the body
 * 4.
 *
 */
router.post("/:id", async (req, res) => {
    /**
     * Initialize a box
     */
    let boxId = 10;
    const initOptions = ["--init", "--cg", `--box-id=${boxId}`];
    const child = spawnSync("isolate", initOptions);
    res.status(200).json({
        msg: child,
    });

    // child.on("exit", (code, signal) => {
    //     console.log(
    //         "child process exited with " + `code ${code} and signal ${signal}`
    //     );
    //     res.status(200).json({
    //         msg: "job submitted",
    //     });
    // });
});

export default router;
