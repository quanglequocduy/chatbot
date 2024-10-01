import { Worker } from '@temporalio/worker';
import * as activities from './src/activities/activity.js';
import { resolve } from 'path';

async function run() {
  const worker = await Worker.create({
    workflowsPath: resolve('./src/workflows/workflow.js'),
    activities,
    taskQueue: 'example-task-queue',
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
