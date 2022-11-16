let gamePattern = [];
let userPattern = [];
let timeouts = [];

const colors = ["green", "red", "yellow", "blue"];

let level = 0;
let speed = 1;

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

const nextLevel = () => {
  // Update level
  $("h1").text(`Level ${++level}`);

  // Add a random color to the sequence
  let a = Math.random() * 4;
  a = Math.floor(a);

  gamePattern.push(colors[a]);

  // Flash each color in the sequence and
  // play a sound corresponding to the color
  let i = 1;
  for (const color in gamePattern) {
    timeouts.push(
      setTimeout(() => {
        flashColor(gamePattern[color], 400);
        playSound(gamePattern[color]);
      }, (850 * i) / speed)
    );

    i++;
  }
};

const checkAnswer = (i) => {
  if (userPattern[i] === gamePattern[i]) {
    return 1;
  } else {
    return 0;
  }
};

const startGame = () => {
  // Remove keypress listener
  $(document).off("click");

  // Keep track of how many colors have been pressed
  let j = 0;

  // Add click listener to all buttons
  $("button").click(function () {
    // Each button has an id corresponding to its color
    const buttonColor = $(this).attr("id");

    userPattern.push(buttonColor);

    // If the right color is clicked
    if (checkAnswer(j)) {
      j++;

      // Pressing animation
      flashColor(buttonColor, 100);

      playSound(buttonColor);

      // If this is the last color of the sequence
      if (level === userPattern.length) {
        // Stop the flashing animation before going
        // into next level (if still happening)
        for (var i = 0; i < timeouts.length; i++) {
          clearTimeout(timeouts[i]);
        }

        userPattern = [];
        j = 0;

        // Go to next level
        setTimeout(() => {
          // Increse speed until level 10
          if (level < 10) {
            speed += 0.1;
          }
          nextLevel();
        }, 300);
      }

      // If the wrong color is clicked
    } else {
      // Remove click listener
      $("button").off("click");

      // Go to Game Over state
      gameOver();
    }
  });

  const gameOver = () => {
    // Change background color to red
    $("body").addClass("game-over");

    // Revert background color
    setTimeout(() => {
      $("body").removeClass("game-over");
    }, 200);

    playSound("wrong");
    $("h1").html("Game Over!<p>Press any key to restart</p>");

    // Stop the flashing animation (if still happening)
    for (var i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
    }

    // Reset everything
    userPattern = [];
    gamePattern = [];
    level = 0;
    speed = 1;

    // Start game again when any key is pressed
    $(document).keypress(() => {
      startGame();
    });
  };

  setTimeout(() => {
    nextLevel();
  }, 300);
};

// Start game when the user clicks anywhere on the screen
$(document).click(() => {
  startGame();
});
