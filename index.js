const colors = ["green", "red", "yellow", "blue"];

let gamePattern = [];
let userPattern = [];
let timeouts = []; // Keep track of set timeouts

let level = 0;
let speed = 1;

// Returns a promise that resolves after a delay
const wait = (milliseconds) => {

  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

// Adds a random color to the sequence
const increaseSequence = () => {
  let num = Math.random() * 4;
  num = Math.floor(num);

  gamePattern.push(colors[num]);
};

// Flashes a button
const flashColor = (color, delay) => {

  // Change background color to a lighter shade
  $(`.${color}`).addClass(`${color}-flash`);

  // Revert background color after a delay
  setTimeout(() => {
    $(`.${color}`).removeClass(`${color}-flash`);
  }, delay);
};

const playSound = (name) => {
  new Audio(`sounds/${name}.mp3`).play();
};

// Plays the current sequence
const playSequence = () => {
  let i = 1;

  for (const color in gamePattern) {

    // Flash each color in the sequence
    timeouts.push(
      setTimeout(() => {
        flashColor(gamePattern[color], 400);
        playSound(gamePattern[color]);
      }, (850 * i) / speed)
    );

    i++;
  }
};

// Checks if the most recent color
// pressed matches the sequence correctly
const checkAnswer = (i) => {

  if (userPattern[i] === gamePattern[i]) {
    return 1;

  } else {
    return 0;
  }
};

// Validates each button click.
// Regular function instead of arrow
// function because of the "this" keyword
function validateChoice() { 

  // Keep track of how many
  // colors have been pressed
  let j = 0;

  // Add clicked color to userPattern array
  const buttonColor = $(this).attr("id");
  userPattern.push(buttonColor);

  // Check if the right color is clicked
  if (checkAnswer(j)) {

    flashColor(buttonColor, 100);
    playSound(buttonColor);

    // If this is the last color of the sequence
    if (level === userPattern.length) {

      // Stop the flashing animation before going
      // into next level (if still happening)
      for (var i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
      }

      // Reset
      userPattern = [];
      j = 0;

      // Increse speed until level 10
      if (level < 10) {
        speed += 0.1;
      }

      // Go to next level
      setTimeout(() => {
        nextLevel();
      }, 300);
    }

  // If the wrong color is clicked
  } else {

    // Disable all buttons
    $("button").off("click");

    // Go to Game Over state
    gameOver();
  }

  j++;
}

// Advances to the next level
async function nextLevel() {

  // Update level text
  $(".large-screen").text(`Level ${++level}`);
  $(".smaller-screen").text(`Level ${level}`);

  increaseSequence();

  // Disable clicks while sequence is being played
  $("button").off("click");
  $("button").prop("disabled", true);
  $("button").addClass("disabled");
  
  playSequence();

  // Wait for most of the sequence to be played
  await wait((850 * level) / speed);

  // Re-enable clicks
  $("button").click(validateChoice);
  $("button").prop("disabled", false);
  $("button").removeClass("disabled");
}

// Goes to Game Over state
const gameOver = () => {

  // Change background color to red
  $("body").addClass("game-over");

  // Revert background color
  setTimeout(() => {
    $("body").removeClass("game-over");
  }, 200);

  playSound("wrong");

  // Change to Game Over text
  $(".large-screen").html("Game Over!<p>Press any key to restart</p>");
  $(".smaller-screen").html("Game Over!<p>Tap anywhere to restart</p>");

  // Stop the flashing animation (if still happening)
  for (var i = 0; i < timeouts.length; i++) {
    clearTimeout(timeouts[i]);
  }

  // Reset
  userPattern = [];
  gamePattern = [];
  level = 0;
  speed = 1;

  // Start game again when the user clicks anywhere
  setTimeout(() => {
    $(document).click(() => {
      startGame();
    });
  }, 100);
};

// Starts the game
const startGame = () => {

  // Disable document click listener  
  $(document).off("click");

  $("button").click(validateChoice);

  // Advance to next level
  setTimeout(() => {
    nextLevel();
  }, 300);
};

// Start the game when the user clicks anywhere
$(document).click(() => {
  startGame();
});
