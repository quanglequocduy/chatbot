# Chatbot Project

This project is a simple chatbot application that uses OpenAI's GPT-3.5-turbo model to generate responses based on user input.

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

## Usage

1. Start the chatbot:
    ```sh
    npm run start
    ```

2. Interact with the chatbot by typing your messages. Type `exit` to end the conversation.

## Dependencies

- [OpenAI API](https://www.npmjs.com/package/openai)
- [colors](https://www.npmjs.com/package/colors)
- [dotenv](https://www.npmjs.com/package/dotenv)
