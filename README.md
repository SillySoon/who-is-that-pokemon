# "Who's That Pokémon" Mini-Game

Welcome to my "Who's That Pokémon" Twitch widget project. This project contains a simple browser source for the streaming application of your choice, to allow you to play "Who's that Pokémon" with your community on twitch via the text chat, using the points system implemented by Streamelements for the rewards.

<a href="https://github.com/SillySoon/who-is-that-pokemon/blob/main/LICENSE" target="_blank"> ![](https://img.shields.io/npm/l/silly-logger?style=for-the-badge&color=c759e5&labelColor=ca64e7)</a>
<a href="https://twitch.tv/sillysoon" target="_blank"> ![Static Badge](https://img.shields.io/badge/Twitch-%239046ff?style=for-the-badge)</a>
<a href="https://sillysoon.de/pokemon/" target="_blank"> ![Static Badge](https://img.shields.io/badge/Website-%233f3f3f?style=for-the-badge)</a>

![Example](Example.png)

## Browsersource (Easy) (BETA FEATURE)

### Installation

Visit [Who is that Pokemon - Configurator](https://sillysoon.de/pokemon/) and follow the steps on the site. (BETA FEATURE)

## Local (Advanced):

### Installation
Follow these steps to install this widget locally on your pc for your stream:

1. Download the [Zip file](https://codeload.github.com/SillySoon/who-is-that-pokemon/zip/refs/heads/main) of this project.
2. Extract the files to a folder of your choice (you will need the path for your streaming software).
3. Configure the settings in the `script.js` file located in the `src` folder.
4. In your streaming software, create a Browser source, check the "Local File" box, and navigate to the project. Select the `index.html` file from the `src` folder.
5. Set the Width and Height to 500px.
6. Enjoy!

### Configuration:
You can find the configuration settings in the `script.js` file.

```js
// Settings
let autoRestart = 1;
let autoStart = true;

let displayMode = "animated"; // "animated" or "original"

let autoGiveUp = true;
let autoGiveUpTime = 300; // Seconds

let randomSpawnTime = true;
let randomSpawnTimeMin = 30; // Seconds
let randomSpawnTimeMax = 150; // Seconds

// Pokedex entires: Min 1, Max 898 supported.
let min = 1;
let max = 898;

let channel = ""; // Add your channel here
let botuser = ""; // Add your Bot Username here
let token = ""; // Add your Bot Token here, from http://twitchapps.com/tmi/

// Points for Streamelements (!addpoints [user] [amount]) - Set to 0 to disable
let pointReward = 200;
let pointAddCommand = "!addpoints";
```