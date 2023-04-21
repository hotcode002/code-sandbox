import express from "express";
import submission from "./submission/routes.js";

import { spawnSync } from "child_process";

import config from "./configs/config.js";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Port
const PORT = config.PORT;
global.box_id = 1;

/**
 * Everytime isolate restarts, there could be some left out files in the container's
 * isolate directory. Clean them up.
 */
const folderCleanUpOptions = ["-rf", "/var/local/lib/isolate/*"];
const folderCleanUp = spawnSync("rm", folderCleanUpOptions, { shell: true });

console.log(folderCleanUp);
console.log(folderCleanUp.output[1].toString());
console.log(folderCleanUp.stderr.toString());
console.log(folderCleanUp.stdout.toString());

app.get("/", (req, res) => {
    res.status(200).send({
        msg: "ok",
    });
});

app.use("/submissions", submission);

// Run the server
app.listen(PORT, async () => {
    // await db(); //connect to mongoose
    console.log(`Server running on port ${PORT}`);
});
