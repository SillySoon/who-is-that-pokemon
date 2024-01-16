"use strict";

// Settings
let settings = {
  autoStart: true,
  autoRestart: true,
  displayMode: "original", // "animated" or "original"
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
  pointRewardAmount: 100,
  showPokeDex: true,
};

initializeSettings();
console.log(settings);

// Get Query Params
function getQueryParams() {
  var params = {};
  var queryString = window.location.search.substring(1);
  var vars = queryString.split("&");

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }

  //console.log(params);
  return params;
}

function initializeSettings() {
  let queryParams = getQueryParams();

  // Auto Start and Restart
  settings.autoStart =
    queryParams["autoStart"] === "true"
      ? true
      : queryParams["autoStart"] === "false"
      ? false
      : settings.autoStart;
  settings.autoRestart =
    queryParams["autoRestart"] === "true"
      ? true
      : queryParams["autoRestart"] === "false"
      ? false
      : settings.autoRestart;

  // Auto Give Up
  settings.autoGiveUp =
    queryParams["autoGiveUp"] === "true"
      ? true
      : queryParams["autoGiveUp"] === "false"
      ? false
      : settings.autoGiveUp;
  settings.autoGiveUpTime =
    parseInt(queryParams["autoGiveUpTime"], 10) || settings.autoGiveUpTime;

  // Display Mode
  settings.displayMode = queryParams["displayMode"] || settings.displayMode;

  // Min and Max Pokemon
  settings.min = parseInt(queryParams["min"], 10) || settings.min;
  settings.max = parseInt(queryParams["max"], 10) || settings.max;

  // Points for Streamelements (!addpoints [user] [amount])
  settings.pointReward =
    queryParams["pointReward"] === "true"
      ? true
      : queryParams["pointReward"] === "false"
      ? false
      : settings.pointReward;
  settings.pointRewardCommand =
    queryParams["pointRewardCommand"] || settings.pointRewardCommand;
  settings.pointRewardAmount =
    parseInt(queryParams["pointRewardAmount"], 10) ||
    settings.pointRewardAmount;

  // Twitch Settings
  settings.channel = queryParams["channel"] || settings.channel;
  settings.botuser = queryParams["botuser"] || settings.botuser;
  settings.token = queryParams["token"] || settings.token;

  // Random Spawn Time
  settings.randomSpawnTime =
    queryParams["randomSpawnTime"] === "true"
      ? true
      : queryParams["randomSpawnTime"] === "false"
      ? false
      : settings.randomSpawnTime;
  settings.randomSpawnTimeMin =
    parseInt(queryParams["randomSpawnTimeMin"], 10) ||
    settings.randomSpawnTimeMin;
  settings.randomSpawnTimeMax =
    parseInt(queryParams["randomSpawnTimeMax"], 10) ||
    settings.randomSpawnTimeMax;

  // Show Pokedex
  settings.showPokeDex =
    queryParams["showPokeDex"] === "true"
      ? true
      : queryParams["showPokeDex"] === "false"
      ? false
      : settings.showPokeDex;
}

// Prequisite for Code
let pokemon;
let pokemonData;
let pokemonNames = [];
let isSolved = false;
let winner;
let timer;
let fileType;

// Define all classes
let holder = document.getElementById("holder");
let ball = document.getElementById("ball");
let title = document.getElementById("title");
let wellDone = document.getElementById("wellDone");
let ballVid = document.getElementById("ballVid");

loginUser();
changeFileType();
if (settings.autoStart) {
  startGame();
}

// ComfyJS and Twitch Chat Interaction Functions and Events
function loginUser() {
  if (settings.botuser) {
    // Login with Bot
    ComfyJS.Init(settings.botuser, settings.token, settings.channel);
    console.log("Login as Bot");
  } else if (settings.token) {
    // Login with User
    ComfyJS.Init(settings.channel, settings.token);
    console.log("Login as User");
  } else {
    // Login as Anonymous
    ComfyJS.Init(settings.channel);
    console.log("Login as Anonymous");
  }
}

ComfyJS.onCommand = (user, command, message, flags, extra) => {
  switch (command) {
    case "wtp":
      if (flags.broadcaster || flags.mod) {
        if (!isSolved) {
          startGame();
        } else {
          skip();
        }
      }
      break;
    case "wtp-reset":
      if (flags.broadcaster || flags.mod) {
        winReset();
      }
      break;
    case "wtp-skip":
      if (flags.broadcaster || flags.mod) {
        skip();
      }
      break;
    case "wtp-giveup":
      if (flags.broadcaster || flags.mod) {
        giveUp();
      }
      break;
    case "wtp-stop":
      if (flags.broadcaster || flags.mod) {
        stopGame();
      }
      break;
    case "wtp-stopauto":
      if (flags.broadcaster || flags.mod) {
        stopAuto();
      }
      break;
    case "wtp-startauto":
      if (flags.broadcaster || flags.mod) {
        startAuto();
      }
      break;
    default:
      // Just ignore any other commands
      break;
  }
};

ComfyJS.onChat = (user, message, flags, self, extra) => {
  // console.log(`${user}: ${message}`);

  if (!isSolved) {
    // converting message to lowercase and removing special characters
    message = message.replace(/[?@]/g, "").toLowerCase();
    guess(message, user);
  }
};

// Game Start
function startGame() {
  // Reset variables
  isSolved = false;
  clearTimeout(timer);

  // Get Random Pokemon
  let pokemonIndex = randomNumber(settings.min, settings.max);

  ball.style.visibility = "visible";
  ballVid.play();

  fetch("https://pokeapi.co/api/v2/pokemon/" + pokemonIndex)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      pokeShow(data, pokemonIndex);
    });

  if (settings.autoGiveUp) {
    timer = setTimeout(giveUp, settings.autoGiveUpTime * 1000);
  }
}

// Game Functions
function changeFileType() {
  let animated = ["animated"];
  fileType = animated.includes(settings.displayMode) ? "gif" : "png";
}

function guess(message, user) {
  if (
    pokemonNames.some((pokemonName) => message.includes(pokemonName)) &&
    !isSolved
  ) {
    isSolved = true;

    let audio = new Audio(
      `https://sillysoon.de/pokemon/sounds/${pokemon.id}.mp3`
    );

    audio.oncanplaythrough = function () {
      audio.play();
    };

    holder.id = "win";

    if (settings.showPokeDex) {
      fetchPokeDex(user);
    }

    if (settings.pointReward && settings.token) {
      ComfyJS.Say(
        `${settings.pointRewardCommand} ${user} ${settings.pointRewardAmount}`
      );
    }

    clearTimeout(timer);

    setTimeout(function () {
      // Reset pokemonNames
      pokemonNames = [];
      winReset();
    }, 10000);
  }
}

function buildPokeDex(pokemonData, user) {
  let flavor;
  pokemonData.flavor_text_entries.forEach((element) => {
    if (element.language.name === "en") {
      flavor = element.flavor_text;
    }
  });

  let pokedexMessage = `#${pokemon.id} ${capitalize(
    pokemon.name
  )} - ${flavor} Height: ${pokemon.height / 10} M Weight: ${
    pokemon.weight / 10
  } Kg Found By: ${user} More infos can be found here: https://www.pokemon.com/us/pokedex/${
    pokemon.name
  }`;
  // console.log(pokedexMessage);

  winner = user;

  if (settings.token) {
    ComfyJS.Say(pokedexMessage);
  }
}

function fetchPokeDex(user) {
  console.log("Fetching Pokedex Data");
  if (user) {
    buildPokeDex(pokemonData, user);
  } else {
    fetch("https://pokeapi.co/api/v2/pokemon-species/" + pokemon.id)
      .then((response) => response.json())
      .then((data) => buildData(data));
  }
}

function buildData(tempPokemonData) {
  pokemonData = tempPokemonData;

  for (let index = 0; index < pokemonData.names.length; ++index) {
    pokemonNames.push(pokemonData.names[index].name.toLowerCase());
  }

  pokemonNames.push(pokemon.name);
  console.log(pokemonNames); // Debug Output for all possible names
}

// Reset variants
function winReset() {
  isSolved = false;

  // Reset Image
  holder.id = "holder";
  holder.src = "holder.png";

  // Restart Game automatically
  let restartTime;
  if (settings.randomSpawnTime) {
    restartTime = randomNumber(
      settings.randomSpawnTimeMin,
      settings.randomSpawnTimeMax
    );
    // console.log("Next Pokemon in " + restartTime + " seconds!");
  } else {
    restartTime = 5;
  }

  if (settings.autoRestart) {
    setTimeout(function () {
      startGame();
    }, restartTime * 1000);
  }
}

function giveUp() {
  guess(pokemon.name);
  ComfyJS.Say(`The Pokemon was ${capitalize(pokemon.name)}!`);
}

function skip() {
  winReset();
  startGame();
}

// Pokemon Visualization
function pokeShow(data, index) {
  pokemon = data;
  fetchPokeDex();

  setTimeout(function () {
    showShadow(index);
  }, 1200);
}

function showShadow(index) {
  holder.src = `https://sillysoon.de/pokemon/${settings.displayMode}/${pokemon.id}.${fileType}`;
}

function stopVid() {
  ball.style.visibility = "hidden";
}

// Helper Functions
function stopGame() {
  location.reload();
}

function stopAuto() {
  settings.autoRestart = false;
  winReset();
}

function startAuto() {
  settings.autoRestart = true;
  startGame();
}

function randomNumber(min, max) {
  const num = Math.random() * (max - min) + min;
  return Math.floor(num);
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
