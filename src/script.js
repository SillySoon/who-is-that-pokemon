// Define all classes
let holder = document.getElementById("holder");
let ball = document.getElementById("ball");
let title = document.getElementById("title");
let wellDone = document.getElementById("wellDone");
let ballVid = document.getElementById("ballVid");

// Settings
let auto = 1;
let language = "en";
let autoStart = true;

let channel = "helpingspoon";
let botuser = "";
let token = "";

// Points
let pointReward = 200;


// Prequisite for Code
let pokemon;
let pokemonData;
let pokemonNames = [];

// Login ComfyJS
if (botuser) {
  // Login the Bot if botuser is set
  ComfyJS.Init(botuser, token, channel);
} else if (token) {
  // Login the User if token is set
  ComfyJS.Init(channel, token);
} else {
  // Login as anonymous if no token or botuser is set
  // Note: this will not allow you to use the Bot in chat
  ComfyJS.Init(channel);
}

function randomNumber(min, max) {
  const r = Math.random() * (max - min) + min;
  return Math.floor(r);
}

let isSolved = false;
let min = 1;
let max = 151;
let winner;

function startGame() {
  isSolved = false;

  // Get Random Pokemon
  pokemonIndex = randomNumber(min, max);
  // console.log(`Log: pokemonIndex = ${pokemonIndex}`);

  ball.style.visibility = "visible";

  ballVid.play();

  fetch("https://pokeapi.co/api/v2/pokemon/" + pokemonIndex)
    .then((response) => {
      // console.log("API Response:", response);
      return response.json();
    })
    .then((data) => {
      // console.log("API Data:", data);
      pokeShow(data, pokemonIndex);
    });
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function fetchPokeDex(b, pn) {
  if (b) {
    buildPokeDex(pokemonData, b, pn);
  } else {
    fetch("https://pokeapi.co/api/v2/pokemon-species/" + pokemon.id)
      .then((response) => response.json())
      .then((data) => buildData(data));
  }
}

function buildData(tempPokemonData) {
  pokemonData = tempPokemonData;

  for (let index = 0; index < pokemonData.names.length; ++index) {
    //  console.log(pokemonData.names[index].name);
    pokemonNames.push(pokemonData.names[index].name.toLowerCase());
    console.log(`${pokemonData.names[index].name} : ${pokemonData.names[index].language.name}`);
  }
  pokemonNames.push(pokemon.name);
}

function buildPokeDex(x, b, pn) {
  x.flavor_text_entries.forEach((element) => {
    if (element.language.name === language) {
      flavor = element.flavor_text;
      console.log("found");
    }
  });

  pokedexMessage = `#${pokemon.id} ${pn} - ${flavor} Height: ${pokemon.height / 10} M Weight: ${pokemon.weight / 10} Kg Found By: ${b} More infos can be found here: https://www.pokemon.com/us/pokedex/${pn}`;

  winner = b;

  if (token) {
    ComfyJS.Say(pokedexMessage);
    ComfyJS.Say(`!addpoints ${b} ${pointReward}`);
  }
  console.log(pokedexMessage);
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
}

function skip() {
  winReset();
  startGame();
}

function guess(message, user) {
  if (pokemonNames.some(pokemonName => message.includes(pokemonName))) {
    isSolved = true;

    let audio2 = new Audio(`https://sillysoon.de/pokemon/sounds/${pokemon.id}.mp3`);
    
    audio2.oncanplaythrough = function () {
      audio2.play();
      console.log("Sound played!");
    };

    audio2.onerror = function () {
      console.log("no sound");
    };
    console.log(pokemon.id);

    holder.id = "win";

    // Reset pokemonNames
    pokemonNames = [];


    fetchPokeDex(user, message);
    setTimeout(function () {
      winReset();
    }, 10000);
  }
}


ComfyJS.onCommand = (user, command, message, flags, extra) => {
  switch (command) {
    case "wtp":
      if ((flags.broadcaster || flags.mod) && !isSolved) {
        startGame();
      } else {
        skip();
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