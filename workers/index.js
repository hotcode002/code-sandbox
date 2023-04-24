import { Queue, Worker } from "bullmq";
import { createClient } from "redis";

try {
    // // Create a new connection in every instance
    const queue = new Queue("submissions", {
        connection: {
            host: "redis",
            port: 6379,
        },
    });

    const colors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (let i = 0; i < colors.length; i++) {
        await queue.add("paint", { color: colors[i] });
    }

    const worker = new Worker(
        "submissions",
        async (job) => {
            console.log("job id = ", job.id);
            console.log("job name = ", job.name);
            console.log("job data = ", job.data);
            console.log("job token = ", job.token);
            const start = Date.now();
            for (let i = 0; i < 1000000000; i++) {}
            const mid = Date.now();

            await job.updateProgress(42);
            for (let i = 0; i < 1000000000; i++) {}
            const end = Date.now();

            await job.updateProgress(45);
            console.log(mid - start, end - mid);

            // job.updateProgress(100);
        },
        {
            connection: {
                host: "redis",
                port: 6379,
            },
            autorun: true,
        }
    );

    worker.on("completed", (job, returnValue) => {
        console.log("job with job id completed", job.id);
    });

    worker.on("progress", (job, progress) => {
        console.log("job progress,", progress);
    });
    // const worker = new Worker(queue, async (job) => {
    //     console.log(job.data);
    // });
    // const counts = await queue.getJobCounts("wait", "completed", "failed");
    // console.log(counts);
    const wait = await queue.getJobs(["wait"], 0, 100, true);
    console.log(wait.length);
    // await paint.remove();
    // await queue.add("paint", { color: "red" });
    // const worker = new Worker("myqueue", async (job) => {
    //     return job.name;
    // });
    // // worker.run();
    // await queue.drain();
    // const client = createClient({
    //     url: `redis://redis:6379`,
    // });
    // await client.connect();
    // await client.set("key", "siva");
    // const value = await client.get("key");
    // console.log(value);
} catch (err) {
    console.log(err);
}
