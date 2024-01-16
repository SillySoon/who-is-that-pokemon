# "Who's That Pokémon" Mini-Game

Welcome to my "Who's That Pokémon" Twitch widget project. This project contains a simple browser source for the streaming application of your choice, to allow you to play "Who's that Pokémon" with your community on twitch via the text chat, using the points system implemented by Streamelements for the rewards.

<a href="https://twitch.tv/sillysoon" target="_blank">![Static Badge](https://img.shields.io/badge/SillySoon-9145ff?style=for-the-badge&logo=twitch&logoColor=white)</a>
<a href="https://discord.gg/SxwuKcmYbx">![Static Badge](https://img.shields.io/badge/Support-4f63f0?style=for-the-badge&logo=discord&logoColor=white)</a>
<a href="https://github.com/SillySoon/who-is-that-pokemon/blob/main/LICENSE" target="_blank"> ![](https://img.shields.io/npm/l/silly-logger?style=for-the-badge&color=c759e5&labelColor=ca64e7)</a>

![Example](Example.png)

## Browsersource (Easy) (RECOMMENDED)

### Installation

Visit [Who is that Pokemon - Configurator](https://sillysoon.de/pokemon/) and follow the steps on the site.

## Local (Advanced):

### Installation
Follow these steps to install this widget locally on your pc for your stream:

1. Download the [Zip file](https://codeload.github.com/SillySoon/who-is-that-pokemon/zip/refs/heads/main) of this project.
2. Extract the files to a folder of your choice (you will need the path for your streaming software).
3. Configure the settings in the `script.js` file located in the `src` folder.
4. In your streaming software, create a Browser source, check the "Local File" box, and navigate to the project. Select the `index.html` file from the `src` folder.
5. Set the Width and Height to 500 x 500 (px).
6. Enjoy!

### Configuration:
You can find the configuration settings in the `script.js` file.

```js
// Settings
let settings = {
  autoStart: true,
  autoRestart: true,
  displayMode: "animated", // "animated" or "original"
  autoGiveUp: true,
  autoGiveUpTime: 300, // Seconds
  randomSpawnTime: true,
  randomSpawnTimeMin: 30, // Seconds
  randomSpawnTimeMax: 150, // Seconds
  min: 1,
  max: 898,
  channel: "", // Add your channel here
  botuser: "", // Add your Bot Username here
  token: "", // Add your Bot Token here, from http://twitchapps.com/tmi/
  pointReward: true,
  pointRewardCommand: "!addpoints",
  pointRewardAmount: 100, // Points
};
```