import { proxyActivities } from '@temporalio/workflow';
import { ApplicationFailure } from '@temporalio/common';

export async function exampleWorkflow(name) {
  // Import activity types (to be defined later)
  const { 
    exampleActivity 
  } = proxyActivities({
    startToCloseTimeout: '1 minute',
    retry: {
      initialInterval: '1 second',
      maximumInterval: '1 minute',
      backoffCoefficient: 2,
      maximumAttempts: 5,
    }
  });

  try {
    return await exampleActivity(name);
  } catch (error) {
    throw new ApplicationFailure(`Failed to execute exampleActivity: ${error.message}`, error);
  }
}

export async function persistChatHistory(params) {
  const {
    saveMessagesToDb
  } = proxyActivities({
    startToCloseTimeout: '1 minute',
    retry: {
      initialInterval: '1 second',
      maximumInterval: '1 minute',
      backoffCoefficient: 2,
      maximumAttempts: 5,
    }
  });

  try {
    for (const { role, content } of params) {
      await saveMessagesToDb(role, content);
    }
  } catch (error) {
    throw new ApplicationFailure(`Failed to execute persistChatHistory: ${error.message}`, error);
    
  }
}