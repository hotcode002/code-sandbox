import express from "express";
import { spawnSync } from "child_process";
import fs from "fs";
import config from "../configs/config.js";
import { validateToken } from "../lib/auth.js";

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
         * Initialize sandbox
         */
        const initOptions = ["--init", `--box-id=${box_id}`];
        const init = spawnSync("isolate", initOptions);

        timer.init = Date.now();

        /**
         * Populate stdin, stdout and meta files
         */
        const boxLocation = `/var/local/lib/isolate/${box_id}/box`;
        fs.writeFileSync(`${boxLocation}/stdin.txt`, "");
        fs.writeFileSync(`${boxLocation}/stdout.txt`, "");
        fs.writeFileSync(`${boxLocation}/meta.txt`, "");

        /**
         * Populate the source code. This is based on the programming language
         */

        const languageOptions = config.languages[language];
        const languageDefaultOptions = languageOptions[languageOptions.default];

        /**
         * Write the source code file
         */
        fs.writeFileSync(
            `${boxLocation}/${languageDefaultOptions.sourceFileName}`,
            source_code
        );

        timer.codeWrite = Date.now();

        const options = [
            `--box-id=${box_id}`,
            config.isolate.run.dir,
            config.isolate.run.processes,
            config.isolate.run.env,
            config.isolate.run.stdin,
            config.isolate.run.stdout,
            config.isolate.run.stderr_redirect,
            config.isolate.run.meta,
            `--time=${time}`,
            config.isolate.run.run,
            "--",
        ];

        if (languageDefaultOptions.compile) {
            /**
             * Compile
             */
            const compileOptions = [
                ...options,
                `${languageDefaultOptions.compileCommand}`,
            ];
            const compile = spawnSync("isolate", compileOptions, {
                shell: true,
            });
            timer.compile = Date.now();

            /**
             * Get the Compile Results
             */
            response.compile = {};
            response.compile.status = compile.status;
            response.compile.stdin = fs
                .readFileSync(`${boxLocation}/stdin.txt`)
                .toString();
            response.compile.stdout = fs
                .readFileSync(`${boxLocation}/stdout.txt`)
                .toString();
            response.compile.meta = fs
                .readFileSync(`${boxLocation}/meta.txt`)
                .toString();
        }

        /**
         * Run
         */
        const runOptions = [...options, `${languageDefaultOptions.runCommand}`];
        const run = spawnSync("isolate", runOptions, { shell: true });

        timer.run = Date.now();

        /**
         * Get Run Results
         */
        response.run = {};
        response.run.status = run.status;
        response.run.stdin = fs
            .readFileSync(`${boxLocation}/stdin.txt`)
            .toString();
        response.run.stdout = fs
            .readFileSync(`${boxLocation}/stdout.txt`)
            .toString();

        response.run.meta = fs
            .readFileSync(`${boxLocation}/meta.txt`)
            .toString();
        /**
         * Clean up sandbox
         */
        const cleanupOptions = ["--cleanup", `--box-id=${box_id}`];
        const cleanUp = spawnSync("isolate", cleanupOptions, { shell: true });

        timer.cleanUp = Date.now();
        timer.time = timer.cleanUp - timer.init;
        response.timer = timer;

        res.status(200).json({
            msg: "ok",
            response,
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
