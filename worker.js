import { Worker } from '@temporalio/worker';
import * as activities from './src/activities/activity.js';
import { resolve } from 'path';
import { WORKFLOW_TASK_QUEUE } from './src/constants.js';

async function run() {
  const worker = await Worker.create({
    workflowsPath: resolve('./src/workflows/workflow.js'),
    activities,
    taskQueue: WORKFLOW_TASK_QUEUE,
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
