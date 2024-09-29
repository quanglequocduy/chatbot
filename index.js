import openai from './config/open-ai.js';
import dbClient from './config/db.js';

import colors from 'colors';
import readlineSync from 'readline-sync';

async function saveMessagesToDb(role, content) {
  const query = `INSERT INTO chat_history (role, content) VALUES ($1, $2)`;
  await dbClient.query(query, [role, content]);
}

async function getChatHistoryFromDb() {
  const result = await dbClient.query('SELECT role, content FROM chat_history ORDER BY id ASC');
  if (result.rows.length === 0) {
    return [];
  }
  return result.rows;
}

async function main() {
  console.log(colors.bold.blue('Welcome to the Chatbot Program!'));
  console.log(colors.bold.blue('You can start chatting with the bot.'));

  const chatHistory = await getChatHistoryFromDb();

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
        break;
      }

      console.log(colors.bold.green(`Chatbot: ${completionText}`));

      await saveMessagesToDb('user', userInput);
      await saveMessagesToDb('assistant', completionText);
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