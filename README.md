# Chatbot Project

This project is a simple chatbot application that uses OpenAI's GPT-3.5-turbo model to generate responses based on user input and Temporal for workflow orchestration.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/quanglequocduy/chatbot-project.git
    cd chatbot-project
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Set up your OpenAI API key:
    - Create a `.env` file in the root directory of the project.
    - Add your OpenAI API key to the `.env` file:
      ```env
      OPENAI_API_KEY=your_openai_api_key
      ```

4. Set up your Temporal server:
    - Follow the [Temporal documentation](https://docs.temporal.io/docs/server/quick-install) to install and start the Temporal server.
    - Ensure the Temporal server is running before starting the chatbot.

## Usage

1. Start the chatbot:
    ```sh
    npm run start
    ```

1. Start the worker:
    ```sh
    npm run start:worker
    ```

3. Interact with the chatbot by typing your messages. Type `exit` to end the conversation.

## Dependencies

- [OpenAI API](https://www.npmjs.com/package/openai)
- [colors](https://www.npmjs.com/package/colors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [Temporal](https://www.npmjs.com/package/@temporalio/client)
