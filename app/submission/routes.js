import express from "express";
import { spawnSync } from "child_process";
import fs from "fs";
const router = express.Router();

router.get("/:id", async (req, res) => {
    console.log("get the status of a submission id");
    return res.status(200).json({
        msg: req.params.id,
    });
});

router.get("/", async (req, res) => {
    return res.status(200).json({
        msg: "jobs",
    });
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
    console.log(global.box_id);
    if (global.box_id > 999) {
        global.box_id = 1;
    } else {
        global.box_id = global.box_id + 1;
    }

    console.log(global.box_id);

    /**
     * Get input parameters
     */
    const language_id = req.body.language_id;
    const source_code = req.body.source_code;

    const time = req.body.time || 5;

    /**
     * Initialize sandbox
     */
    const initOptions = ["--init", `--box-id=${global.box_id}`];
    const init = spawnSync("isolate", initOptions);

    /**
     * Populate stdin, stdout and meta files
     */
    const boxLocation = `/var/local/lib/isolate/${global.box_id}/box`;
    fs.writeFileSync(`${boxLocation}/stdin.txt`);
    fs.writeFileSync(`${boxLocation}/stdout.txt`);
    fs.writeFileSync(`${boxLocation}/meta.txt`);

    /**
     * Populate the source code. This is based on the programming language
     */

    const fileStructure = languageSpecificFileStructure("C");

    /**
     * Write the source code file
     */
    fs.writeFileSync(
        `${boxLocation}/${fileStructure.sourceFileName}`,
        source_code
    );

    /**
     * Compile
     */
    const options = [
        `--box-id=${global.box_id}`,
        "-p",
        "--env=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
        "--stdin=stdin.txt",
        "--stdout=stdout.txt",
        "--stderr-to-stdout",
        "--meta=meta.txt",
        `--time=${time}`,
        "--run",
        "--",
    ];
    const compileOptions = [...options, `${fileStructure.compilationCommand}`];
    const compile = spawnSync("isolate", compileOptions, { shell: true });

    /**
     * Run
     */
    const runOptions = [...options, `${fileStructure.runCommand}`];
    const run = spawnSync("isolate", runOptions, { shell: true });

    /**
     * Get Run Results
     */
    const stdin = fs.readFileSync(`${boxLocation}/stdin.txt`).toString();
    const stdout = fs.readFileSync(`${boxLocation}/stdout.txt`).toString();
    const meta = fs.readFileSync(`${boxLocation}/meta.txt`).toString();
    /**
     * Clean up sandbox
     */
    // const cleanupOptions = ["--cleanup", `--box-id=${global.box_id}`];
    // const cleanUp = spawnSync("isolate", cleanupOptions);
    res.status(200).json({
        msg: "ok",
        compile: {
            stdout: compile.stdout.toString(),
            stderr: compile.stderr.toString(),
            status: compile.status,
        },
        run: {
            stdin,
            stdout,
            stderr: run.stderr.toString(),
            status: run.status,
            meta,
        },
    });
});

/**
 *
 * @param {*} language_id
 * @param {*} source_code
 *
 * Compilation process is language specific.
 */
const languageSpecificFileStructure = (language_id) => {
    const fileStructure = {
        sourceFileName: null,
        compiledFileName: null,
        outputFileName: null,
        compilationCommand: null,
    };

    if (language_id === "C") {
        fileStructure.sourceFileName = "main.c";
        fileStructure.outputFileName = "a.out";
        fileStructure.compilationCommand = `/usr/bin/gcc main.c`;
        fileStructure.runCommand = `./a.out`;
    }

    return fileStructure;
};

export default router;
