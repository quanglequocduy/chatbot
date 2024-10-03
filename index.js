import openai from './config/open-ai.js';
import pool from './config/db.js';

import colors from 'colors';
import readlineSync from 'readline-sync';
import { Connection, WorkflowClient } from '@temporalio/client';
import {
  persistChatHistory,
} from './src/workflows/workflow.js';
import { WORKFLOW_TASK_QUEUE } from './src/constants.js';

async function getChatHistoryFromDb() {
  const result = await pool.query('SELECT role, content FROM chat_history ORDER BY id ASC');
  if (result.rows.length === 0) {
    return [];
  }
  return result.rows;
}

async function main() {
  console.log(colors.bold.blue('Welcome to the Chatbot Program!'));
  console.log(colors.bold.blue('You can start chatting with the bot.'));

  const chatHistory = await getChatHistoryFromDb();

  // Connect to the Temporal server
  const connection = await Connection.connect();

  // Create client that talks to the Temporal
  const client = new WorkflowClient({
    connection,
    namespace: 'default',
  });

  while(true) {
    const userInput = readlineSync.question(colors.bold.yellow('You: '));

    try {
      const messages = chatHistory

      messages.push({
        role: 'user',
        content: userInput,
      });

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
      });

      const completionText = completion.choices[0].message.content;

      if (userInput.toLowerCase() === 'exit') {
        console.log(colors.bold.green('Chatbot: Goodbye!'));
        pool.end();
        break;
      }

      console.log(colors.bold.green(`Chatbot: ${completionText}`));

      const params = [
        {
          role: 'user',
          content: userInput,
        },
        {
          role: 'assistant',
          content: completionText,
        },
      ];
      // Start a workflow
      const handle = await client.start(persistChatHistory, {
        args: [params],
        taskQueue: WORKFLOW_TASK_QUEUE,
        workflowId: `persist-chat-${Date.now()}`,
      });

      console.log(`Started workflow with workflowId=${handle.workflowId}`);
    } catch (error) {
      if (error.response) {
        console.error(colors.bold.red(error.response.error.code));
        console.error(colors.bold.red(error.response.error.message));
        return;
      }
      console.log(colors.bold.red(error));
      return;
    }
  }
}

main();