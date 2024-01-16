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

  // Clear and restart timer
  clearTimeout(timer);
  
  if (autoGiveUp) {
    timer = setTimeout(giveUp, autoGiveUpTime * 1000);
  }
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

function buildPokeDex(pokemonData, user) {
  pokemonData.flavor_text_entries.forEach((element) => {
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
      ComfyJS.Say(`${pointAddCommand} ${user} ${pointReward}`);
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
  holder.src = `https://sillysoon.de/pokemon/${displayMode}/${pokemon.id}.${fileType}`;
}

function giveUp() {
  guess(pokemon.name);
  console.log("The Pokemon was " + capitalize(pokemon.name) + "!");
  ComfyJS.Say(`The Pokemon was ${capitalize(pokemon.name)}!`);
}

function skip() {
  winReset();
  startGame();
}

function guess(message, user) {
  if (pokemonNames.some(pokemonName => message.includes(pokemonName)) && !isSolved) {
    isSolved = true;

    let audio = new Audio(`https://sillysoon.de/pokemon/sounds/${pokemon.id}.mp3`);
    
    audio.oncanplaythrough = function () {
      audio.play();
    };

    holder.id = "win";

    fetchPokeDex(user);

    clearTimeout(timer);

    setTimeout(function () {
      // Reset pokemonNames
      pokemonNames = [];
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


  // Restart Game automatically
  let restartTime;
  if (randomSpawnTime) {
    restartTime = randomNumber(randomSpawnTimeMin, randomSpawnTimeMax);
    console.log("Next Pokemon in " + restartTime + " seconds!");
  } else {
    restartTime = 5;
  }

  if (autoRestart) {
    setTimeout(function () {
      startGame();
    }, restartTime * 1000);
  }
}

function stopGame() {
  location.reload();
}

function stopAuto() {
  autoRestart = false;
  winReset();
}

function startAuto() {
  autoRestart = true;
  startGame();
}

function stopVid() {
  ball.style.visibility = "hidden";
}

// Prefire Game when loaded
if (autoStart) {
  startGame();
}