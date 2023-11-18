let title = "Flying Practice";

let description = `
[Tap] 
Elevate upwards
`;

let characters = [
 `
  ll
l l
lllllllllllll
l l
  ll
`,
  `
    llllllll
  l
lllllll
  l
    llllllll
  `,
];

let options = {
  theme: "dark",
  isPlayingBgm: true,
  isReplayEnabled: true,
};

let pos;
let vel;
let state;
let move = false;
let isFlipped = false; 
let cPos; // Position of the ships
let cSpeed; // Speed of the ships
let cActive; // Flag to control the ships 
let cArray = [];
let score = 0;
let highScore = 0; // Add a variable for high score
let isGameOver = false;

function update() {
  if (!ticks) {
    vel = vec(2)
    pos = vec(9, 50)
    move = false;
    cActive = true; // Set the ship to be initially active
    cPos = vec(105, 50); // Initialize the starting position for the ship
    cSpeed = -1; // Set the speed of the ship to move towards the left
  }
  color("light_blue");
  rect(0, 30, 1000, 40);
  color("light_black");
  if (input.isJustPressed) {
    play("jump")
    vel.y = -1 ;
  }
  
  vel.y += 0.1;
  pos.y += vel.y;

  pos.y = clamp(pos.y, 32, 68);

  if (cArray.length < 4) { // Spawn up to 4 ship characters
    if (rnd(200) < 30) { // Chance to spawn a new ship character
      const newB = {
        pos: vec(105, rnd(33, 67)), // Random Y position within boundaries
        speed: rnd(0.8, 1.5) * -1, // Random speed towards the left
        active: true
      };
      cArray.push(newB);
    }
  }

  cArray.forEach((b, i) => {
    if (b .active) {
      b.pos.x += b.speed; // Move the ship character
      char("b", b.pos); // Display the ship character
      
      
      if (b.pos.x < -5) {
        cArray.splice(i, 1); // Remove the ship if it goes off-screen
      }
    }
  });

  if (!isGameOver) {
    cArray.forEach((b, i) => { 
      if (b.active) {
        char("b", b.pos); // Display the ship character

        // Check for collision with char "a"
        if (!isFlipped && char("a", pos.x, pos.y).isColliding.char.b) {
          play("explosion"); // Play a sound effect for the collision
          isGameOver = true; // Set the game over state
          
          if (score > highScore) {
            highScore = score;
          }
        }

        if (b.pos.x < -5) {
          cArray.splice(i, 1); // Remove the spaceship character if it goes off-screen
        }
      }
    });

    if (ticks % 60 === 0) { // 60 fps, so this increments the score every second
      score += 1;
    }

    // Displays score and high score
    color("black");
    text(`Score: ${score}`, 6, 12);
    text(`High Score: ${highScore}`, 6, 24);
  } else {
    // Displays "Game Over" message
    color("white");
    rect(0, 0, 1000, 1000); 
    color("red");
    text("Game Over", 25, 30);
    text(`Score:${score}`, 27, 50);
    text(`High Score:${highScore}`, 15, 70);
    color("black");
    text("Tap to Restart", 8 , 60);
    

    if (input.isJustPressed) {
      isGameOver = false; 
      score = 0; 
      pos = vec(9, 50); 

      cArray = [];

      play("select"); 
    }
  }
}

addEventListener("load", () => {
  init({
    update: update,
    title: title,
    description: description,
    characters: characters,
    options: options,
  });
});