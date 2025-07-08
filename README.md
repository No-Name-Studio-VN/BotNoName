# Bot No Name

This is the official open-source repository for the **Bot No Name** Discord bot, developed by No Name Studio.

> **Note:** Development for the bot is currently on hold. The primary developer has shifted focus due to academic commitments and a decline in motivation for Discord bot development. We appreciate your understanding.

[](https://top.gg/bot/736915194772586598)

This repository provides the most up-to-date source code, and we welcome contributions from the community. If you'd rather just use the bot, you can [**invite it to your server here**](https://cp.nnsvn.me/invite).

---

## ✨ Features

Bot No Name is packed with features to make your Discord server more engaging and secure:

- 🎧 **Music:** Stream your favorite tunes from a variety of sources, including YouTube, SoundCloud, and Spotify.
- 🤖 **Moderation:** Keep your server safe with AI-powered auto-moderation tools.
- 💵 **Economy:** Engage your members with a fun and safe virtual economy system.
- 🎚️ **Leveling:** Reward active members with experience points and levels for chatting.
- 🎲 **And More\!** Including mini-games, giveaways, a ticketing system, translation tools, memes, and much more.

---

## 🛠️ Requirements

To run your own instance of Bot No Name, you'll need the following:

- **Node.js:** Version 22.12.0 or newer
- **Discord.js:** Version 14 or higher
- **Databases:** MongoDB and Redis

> **API Keys:** You'll need to define your API keys in a `env` file. While the bot can run without some of these keys, the corresponding commands will not be functional and may cause errors.

---

## 🚀 Getting Started

To get started with a local development environment, follow these steps:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/No-Name-Studio-VN/BotNoName
   ```

2. **Navigate to the project directory:**

   ```sh
   cd BotNoName
   ```

3. **Install the necessary dependencies:**

   ```sh
   npm install
   ```

4. **Configure your environment:**
   - Create `.env` files based on the provided sample files.
   - Fill in all the required keys and settings.

### Running in Development Mode

- In your `.env` file, set `NODE_ENV` to `development`.
- Ensure you have a Redis instance running.
- Start the bot with the following command:

  ```sh
  npm run dev
  ```

### Deploying for Production

> **Note:** For production, the front-end's static files are intended to be deployed on a Content Delivery Network (CDN). You will need to create a separate folder for these files and specify its path in your `.env` file.

1. **Set the environment:**
   - In your `.env` file, change `NODE_ENV` to `production`.
2. **Start your Redis instance:**

   ```sh
   sudo service redis-server start
   # or
   redis-server
   ```

3. **Build the dashboard files:**

   ```sh
   npm run build
   ```

4. **Start the bot:**
   - We recommend using a process manager like [PM2](https://pm2.keymetrics.io/) to keep the bot running smoothly.

**Disclaimer on Self-Hosting:** The self-hosting option is primarily intended for those who wish to contribute to the project's development. Creating a personalized instance will require significant modifications, which we do not recommend or support. While we don't prohibit running your own instance, please refrain from claiming the bot as your own work.

---

## 🤝 Contributing & Support

We encourage you to contribute to the development of Bot No Name\! For feedback, discussions, or if you just want to hang out with the community, be sure to join our [**support server**](https://cp.nnsvn.me/discord). We love meeting new people, so don't hesitate to come and say hi\!

---

## 📄 License

The source code for Bot No Name is licensed under the [**GNU GENERAL PUBLIC LICENSE Version 3**](LICENSE), which means it can be used for any purpose.
