"use strict";

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
  pointReward: 200,
  pointAddCommand: "!addpoints",
};

initializeSettings();

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

  // Points for Streamelements (!addpoints [user] [amount]) - Set to 0 to disable
  settings.pointReward =
    parseInt(queryParams["pointReward"], 10) || settings.pointReward;
  settings.pointAddCommand =
    queryParams["pointAddCommand"] || settings.pointAddCommand;

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

function changeFileType() {
  let animated = ["animated"];
  fileType = animated.includes(settings.displayMode) ? ".gif" : ".png";
}

function randomNumber(min, max) {
  const num = Math.random() * (max - min) + min;
  return Math.floor(num);
}
