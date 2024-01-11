// Define all classes
let holder = document.getElementById("holder");
let ball = document.getElementById("ball");
let title = document.getElementById("title");
let wellDone = document.getElementById("wellDone");
let ballVid = document.getElementById("ballVid");

// Settings
let auto = 1;
let autoStart = true;

// Pokedex entires: Min 1, Max 898 supported.
let min = 1;
let max = 151;

let channel = "helpingspoon"; // Add your channel here
let botuser = ""; // Add your Bot Username here
let token = ""; // Add your Bot Token here, from http://twitchapps.com/tmi/

// Points for Streamelements (!addpoints [user] [amount]) - Set to 0 to disable
let pointReward = 200;

// Prequisite for Code
let pokemon;
let pokemonData;
let pokemonNames = [];
let isSolved = false;
let winner;

// Login ComfyJS
if (botuser) {
  ComfyJS.Init(botuser, token, channel);
} else if (token) {
  ComfyJS.Init(channel, token);
} else {
  // Login as anonymous if no token or botuser is set
  ComfyJS.Init(channel);
}

function randomNumber(min, max) {
  const num = Math.random() * (max - min) + min;
  return Math.floor(num);
}

let timer;

function startGame() {
  isSolved = false;

  // Get Random Pokemon
  pokemonIndex = randomNumber(min, max);
  console.log(pokemonIndex);

  ball.style.visibility = "visible";
  ballVid.play();

  fetch("https://pokeapi.co/api/v2/pokemon/" + pokemonIndex)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      pokeShow(data, pokemonIndex);
    });

  // Set timer for 10 minutes
  clearTimeout(timer);
  timer = setTimeout(giveUp, 5 * 60 * 1000);
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function fetchPokeDex(user) {
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

function buildPokeDex(pokemon, user) {
  pokemon.flavor_text_entries.forEach((element) => {
    if (element.language.name === 'en') {
      flavor = element.flavor_text;
    }
  });

  pokedexMessage = `#${pokemon.id} ${capitalize(pokemon.name)} - ${flavor} Height: ${pokemon.height / 10} M Weight: ${pokemon.weight / 10} Kg Found By: ${user} More infos can be found here: https://www.pokemon.com/us/pokedex/${pokemon.name}`;
  console.log(pokedexMessage);

  winner = user;

  if (token) {
    ComfyJS.Say(pokedexMessage);
    if (pointReward !== 0) {
      ComfyJS.Say(`!addpoints ${user} ${pointReward}`);
    }
  }
}

function pokeShow(data, index) {
  pokemon = data;
  fetchPokeDex();

  setTimeout(function () {
    showShadow(index);
  }, 1200);
}

function showShadow(s) {
  holder.src = `https://sillysoon.de/pokemon/animated/${pokemon.id}.gif`;
}

function giveUp() {
  guess(pokemon.name);
  ComfyJS.Say(`The Pokemon was ${capitalize(pokemon.name)}!`);
}

function skip() {
  winReset();
  startGame();
}

function guess(message, user) {
  if (pokemonNames.some(pokemonName => message.includes(pokemonName))) {
    isSolved = true;

    let audio = new Audio(`https://sillysoon.de/pokemon/sounds/${pokemon.id}.mp3`);
    
    audio.oncanplaythrough = function () {
      audio.play();
    };

    holder.id = "win";

    // Reset pokemonNames
    pokemonNames = [];

    fetchPokeDex(user);
    setTimeout(function () {
      winReset();
    }, 10000);
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
  console.log(`${user}: ${message}`);

  if (!isSolved) {
    // converting message to lowercase and removing special characters
    message = message.replace(/[?@]/g, "").toLowerCase();
    guess(message, user);
  }
};

function winReset() {
  isSolved = false;

  // Reset Image
  holder.id = "holder";
  holder.src = "holder.png";
  if (auto) {
    setTimeout(function () {
      startGame();
    }, 10000);
  }
}

function stopGame() {
  location.reload();
}

function stopAuto() {
  auto = false;
  winReset();
}

function startAuto() {
  auto = true;
  startGame();
}

function stopVid() {
  ball.style.visibility = "hidden";
  console.log("HIDE");
}

// Prefire Game when loaded
if (autoStart) {
  startGame();
}