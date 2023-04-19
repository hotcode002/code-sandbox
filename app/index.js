import express from "express";
import jobs from "./jobs/routes.js";

import config from "./configs/config.js";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Port
const PORT = config.PORT;

app.use("/jobs", jobs);

// Run the server
app.listen(PORT, async () => {
    // await db(); //connect to mongoose
    console.log(`Server running on port ${PORT}`);
});