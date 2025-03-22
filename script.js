const game = {
  width: 800,
  height: 600,
  cellSize: 50,
  player: {
    x: 0,
    y: 0,
    health: 100,
    maxHealth: 100,
    attack: 10,
    defense: 5,
    inventory: {
      key: false,
      sword: false,
      potion: 0,
    },
  },
  currentLevel: 1,
  maxLevel: 3,
  enemies: [],
  items: [],
  walls: [],
  doors: [],
  traps: [],
  puzzles: [],
  visited: {},
  activePuzzle: null,
  ctx: null,
  keysDown: {},
  lastTime: 0,
  animations: [],
  particles: [],
  tutorialStage: 0,
  tutorialSteps: [
    {
      title: "Welcome to Dungeon Escape!",
      text: "Use arrow keys or WASD to move. Explore the dungeon, find the key, and escape through the exit door. Watch out for monsters and traps!",
    },
    {
      title: "Combat",
      text: "Move into enemies to attack them. Your attack power increases with weapons. Enemies will chase you when they see you!",
    },
    {
      title: "Items",
      text: "Collect keys to unlock doors, swords to increase your attack power, and potions to restore health. Press 'P' to use a potion.",
    },
    {
      title: "Puzzles",
      text: "Blue areas contain puzzles. Solve them to earn rewards or unlock passages. Some puzzles are required to progress!",
    },
  ],
};

// Initialize game
function initGame() {
  // Set up canvas
  const canvas = document.getElementById("game-canvas");
  game.ctx = canvas.getContext("2d");

  // Initialize event listeners
  window.addEventListener("keydown", (e) => {
    game.keysDown[e.key] = true;
    if (e.key === "p" || e.key === "P") {
      usePotion();
    }
  });
  window.addEventListener("keyup", (e) => {
    delete game.keysDown[e.key];
  });

  document.getElementById("start-button").addEventListener("click", startGame);
  document.getElementById("retry-button").addEventListener("click", startGame);
  document
    .getElementById("play-again-button")
    .addEventListener("click", startGame);
  document
    .getElementById("puzzle-submit")
    .addEventListener("click", submitPuzzle);
  document
    .getElementById("puzzle-cancel")
    .addEventListener("click", cancelPuzzle);
  document
    .getElementById("tutorial-next")
    .addEventListener("click", nextTutorial);

  // Start screen animations
  animateStartScreen();
}

function animateStartScreen() {
  const title = document.getElementById("title");
  title.style.animation = "glow 2s infinite alternate";
}

function startGame() {
  // Reset game state
  game.player.health = game.player.maxHealth;
  game.player.inventory.key = false;
  game.player.inventory.sword = false;
  game.player.inventory.potion = 0;
  game.currentLevel = 1;
  game.enemies = [];
  game.items = [];
  game.walls = [];
  game.doors = [];
  game.traps = [];
  game.puzzles = [];
  game.visited = {};
  game.animations = [];
  game.particles = [];

  // Hide screens
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-over-screen").style.display = "none";
  document.getElementById("win-screen").style.display = "none";

  // Create level
  loadLevel(game.currentLevel);

  // Show tutorial on first play
  if (game.tutorialStage === 0) {
    showTutorial();
  }

  // Start game loop
  requestAnimationFrame(gameLoop);
}

function loadLevel(level) {
  // Clear existing elements
  game.enemies = [];
  game.items = [];
  game.walls = [];
  game.doors = [];
  game.traps = [];
  game.puzzles = [];
  game.visited = {};

  // Remove DOM elements
  const gameContainer = document.getElementById("game-container");
  const elementsToRemove = [
    ...document.getElementsByClassName("wall"),
    ...document.getElementsByClassName("door"),
    ...document.getElementsByClassName("trap"),
    ...document.getElementsByClassName("item"),
    ...document.getElementsByClassName("monster"),
    ...document.getElementsByClassName("puzzle"),
  ];

  elementsToRemove.forEach((element) => {
    if (element.parentNode === gameContainer) {
      gameContainer.removeChild(element);
    }
  });

  // Set up minimap
  setupMinimap();

  // Display level info
  showLevelInfo(level);

  // Create level layout based on level number
  switch (level) {
    case 1:
      createLevel1();
      break;
    case 2:
      createLevel2();
      break;
    case 3:
      createLevel3();
      break;
    default:
      createLevel1();
  }

  // Update UI
  updateHealthUI();
  updateInventoryUI();
  clearCombatLog();
  addLogMessage("You entered level " + level + ".", "log-player");
}

function createLevel1() {
  // Place player
  game.player.x = 100;
  game.player.y = 100;
  createPlayerElement();

  // Create walls
  createWall(0, 0, 800, 50);
  createWall(0, 0, 50, 600);
  createWall(0, 550, 800, 50);
  createWall(750, 0, 50, 600);

  createWall(150, 0, 50, 200);
  createWall(350, 100, 50, 200);
  createWall(200, 400, 200, 50);
  createWall(500, 150, 250, 50);
  createWall(500, 150, 50, 250);
  createWall(600, 350, 50, 200);

  // Create doors
  createDoor(350, 350, 50, 50, "horizontal", false);
  createDoor(600, 500, 50, 50, "vertical", true, true); // Exit door

  // Create items
  createItem(250, 150, "key");
  createItem(650, 250, "potion");
  createItem(450, 500, "sword");

  // Create enemies
  createEnemy(300, 300, "slime");
  createEnemy(650, 400, "slime");

  // Create traps
  createTrap(250, 250, 100, 100);

  // Create puzzles
  createPuzzle(150, 450, 100, 100, {
    type: "sequence",
    description: "Press the buttons in the correct order.",
    solution: [2, 3, 1, 4],
    reward: "potion",
  });
}

function createLevel2() {
  // Place player
  game.player.x = 75;
  game.player.y = 300;
  createPlayerElement();

  // Create walls
  createWall(0, 0, 800, 50);
  createWall(0, 0, 50, 600);
  createWall(0, 550, 800, 50);
  createWall(750, 0, 50, 600);

  // Maze structure
  createWall(150, 100, 50, 350);
  createWall(150, 450, 550, 50);
  createWall(250, 50, 50, 350);
  createWall(350, 100, 50, 250);
  createWall(450, 50, 50, 250);
  createWall(550, 100, 50, 250);
  createWall(650, 50, 50, 350);

  createWall(200, 150, 50, 50);
  createWall(300, 250, 50, 50);
  createWall(400, 350, 50, 50);
  createWall(500, 150, 50, 50);
  createWall(600, 250, 50, 50);

  // Create doors
  createDoor(200, 450, 50, 50, "horizontal", true);
  createDoor(700, 450, 50, 50, "vertical", true, true); // Exit door

  // Create items
  createItem(700, 100, "key");
  createItem(200, 200, "potion");
  createItem(600, 400, "potion");

  // Create enemies
  createEnemy(300, 150, "slime");
  createEnemy(500, 300, "slime");
  createEnemy(650, 350, "skeleton");

  // Create traps
  createTrap(400, 200, 150, 50);
  createTrap(250, 350, 100, 100);

  // Create puzzles
  createPuzzle(500, 350, 100, 100, {
    type: "symbols",
    description: "Select the symbols that add up to 10.",
    options: [2, 3, 5, 6, 7, 8],
    solution: [2, 8],
    reward: "potion",
  });
}

function createLevel3() {
  // Place player
  game.player.x = 400;
  game.player.y = 500;
  createPlayerElement();

  // Create walls
  createWall(0, 0, 800, 50);
  createWall(0, 0, 50, 600);
  createWall(0, 550, 800, 50);
  createWall(750, 0, 50, 600);

  // Circular room structure
  createWall(200, 150, 400, 50);
  createWall(200, 150, 50, 200);
  createWall(550, 150, 50, 200);
  createWall(200, 350, 150, 50);
  createWall(450, 350, 150, 50);

  // Inner sanctum
  createWall(350, 200, 100, 100);

  // Create doors
  createDoor(350, 350, 100, 50, "horizontal", true);
  createDoor(400, 200, 50, 50, "vertical", true, true); // Final exit door

  // Create items
  createItem(100, 100, "key");
  createItem(700, 500, "potion");
  createItem(100, 500, "potion");

  // Create enemies
  createEnemy(200, 250, "skeleton");
  createEnemy(600, 250, "skeleton");
  createEnemy(400, 300, "boss");

  // Create traps
  createTrap(300, 450, 200, 50);

  // Create puzzles
  createPuzzle(600, 450, 100, 100, {
    type: "riddle",
    description: "What has keys but can't open locks?",
    options: ["Piano", "Map", "Book", "Phone"],
    solution: "Piano",
    reward: "key",
  });
}

function createPlayerElement() {
  let player = document.getElementById("player");
  if (!player) {
    player = document.createElement("div");
    player.id = "player";
    document.getElementById("game-container").appendChild(player);
  }
  player.style.left = game.player.x + "px";
  player.style.top = game.player.y + "px";
}

function createWall(x, y, width, height) {
  const wall = {
    x: x,
    y: y,
    width: width,
    height: height,
  };

  game.walls.push(wall);

  const wallElement = document.createElement("div");
  wallElement.className = "wall";
  wallElement.style.left = x + "px";
  wallElement.style.top = y + "px";
  wallElement.style.width = width + "px";
  wallElement.style.height = height + "px";

  document.getElementById("game-container").appendChild(wallElement);
}

function createDoor(x, y, width, height, orientation, locked, isExit = false) {
  const door = {
    x: x,
    y: y,
    width: width,
    height: height,
    orientation: orientation,
    locked: locked,
    isExit: isExit,
  };

  game.doors.push(door);

  const doorElement = document.createElement("div");
  doorElement.className =
    "door" + (locked ? " locked" : "") + (isExit ? " exit" : "");
  doorElement.style.left = x + "px";
  doorElement.style.top = y + "px";
  doorElement.style.width = width + "px";
  doorElement.style.height = height + "px";

  document.getElementById("game-container").appendChild(doorElement);
}

function createItem(x, y, type) {
  const item = {
    x: x,
    y: y,
    type: type,
    collected: false,
  };

  game.items.push(item);

  const itemElement = document.createElement("div");
  itemElement.className = "item " + type;
  itemElement.style.left = x + "px";
  itemElement.style.top = y + "px";

  document.getElementById("game-container").appendChild(itemElement);
}

function createEnemy(x, y, type) {
  let health, attack, defense;

  switch (type) {
    case "slime":
      health = 30;
      attack = 5;
      defense = 1;
      break;
    case "skeleton":
      health = 50;
      attack = 8;
      defense = 3;
      break;
    case "boss":
      health = 100;
      attack = 12;
      defense = 5;
      break;
    default:
      health = 20;
      attack = 5;
      defense = 0;
  }

  const enemy = {
    x: x,
    y: y,
    type: type,
    health: health,
    maxHealth: health,
    attack: attack,
    defense: defense,
    lastMove: 0,
    moveDelay: type === "boss" ? 400 : 800,
  };

  game.enemies.push(enemy);

  const enemyElement = document.createElement("div");
  enemyElement.className = "monster " + type;
  enemyElement.style.left = x + "px";
  enemyElement.style.top = y + "px";

  document.getElementById("game-container").appendChild(enemyElement);
}

function createTrap(x, y, width, height) {
  const trap = {
    x: x,
    y: y,
    width: width,
    height: height,
    activated: false,
    visible: false,
    cooldown: 0,
  };

  game.traps.push(trap);

  const trapElement = document.createElement("div");
  trapElement.className = "trap";
  trapElement.style.left = x + "px";
  trapElement.style.top = y + "px";
  trapElement.style.width = width + "px";
  trapElement.style.height = height + "px";

  document.getElementById("game-container").appendChild(trapElement);
}

function createPuzzle(x, y, width, height, puzzleData) {
  const puzzle = {
    x: x,
    y: y,
    width: width,
    height: height,
    solved: false,
    data: puzzleData,
  };

  game.puzzles.push(puzzle);

  const puzzleElement = document.createElement("div");
  puzzleElement.className = "puzzle";
  puzzleElement.style.left = x + "px";
  puzzleElement.style.top = y + "px";
  puzzleElement.style.width = width + "px";
  puzzleElement.style.height = height + "px";

  document.getElementById("game-container").appendChild(puzzleElement);
}

function setupMinimap() {
  const minimap = document.getElementById("minimap");
  minimap.innerHTML = "";

  // We'll create a 15x15 grid for the minimap
  const mapSize = 15;
  const cellSize = 8;
  const mapWidth = cellSize * mapSize;
  const mapHeight = cellSize * mapSize;

  for (let y = 0; y < mapSize; y++) {
    for (let x = 0; x < mapSize; x++) {
      const cell = document.createElement("div");
      cell.className = "minimap-cell";
      cell.style.width = cellSize + "px";
      cell.style.height = cellSize + "px";
      cell.style.left = x * cellSize + "px";
      cell.style.top = y * cellSize + "px";
      cell.dataset.x = x;
      cell.dataset.y = y;
      minimap.appendChild(cell);
    }
  }
}

function updateMinimap() {
  // Convert player position to minimap coordinates
  const mapSize = 15;
  const gameWidth = 800;
  const gameHeight = 600;

  const playerMapX = Math.floor((game.player.x / gameWidth) * mapSize);
  const playerMapY = Math.floor((game.player.y / gameHeight) * mapSize);

  // Mark current cell as visited and current
  const cellId = playerMapX + "-" + playerMapY;
  game.visited[cellId] = true;

  // Update minimap cells
  const minimapCells = document.getElementsByClassName("minimap-cell");
  for (let cell of minimapCells) {
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    const id = x + "-" + y;

    if (x === playerMapX && y === playerMapY) {
      cell.className = "minimap-cell current";
    } else if (game.visited[id]) {
      cell.className = "minimap-cell visited";
    } else {
      cell.className = "minimap-cell";
    }
  }
}

function showLevelInfo(level) {
  const levelInfo = document.getElementById("level-info");
  const levelNumber = document.getElementById("level-number");
  const levelDescription = document.getElementById("level-description");

  levelNumber.textContent = "Level " + level;

  switch (level) {
    case 1:
      levelDescription.textContent =
        "The entrance to the dungeon. Find the key and make your way deeper.";
      break;
    case 2:
      levelDescription.textContent =
        "A maze of twisted passages. Watch out for traps and stronger enemies.";
      break;
    case 3:
      levelDescription.textContent =
        "The final chamber. Defeat the boss to escape the dungeon!";
      break;
  }

  levelInfo.style.display = "block";
  levelInfo.style.opacity = "1";

  setTimeout(() => {
    levelInfo.style.opacity = "0";
    setTimeout(() => {
      levelInfo.style.display = "none";
    }, 1000);
  }, 3000);
}

function showTutorial() {
  const tutorialOverlay = document.getElementById("tutorial-overlay");
  const tutorialTitle = document.getElementById("tutorial-title");
  const tutorialText = document.getElementById("tutorial-text");

  tutorialTitle.textContent = game.tutorialSteps[game.tutorialStage].title;
  tutorialText.textContent = game.tutorialSteps[game.tutorialStage].text;

  tutorialOverlay.style.display = "flex";
}

function nextTutorial() {
  game.tutorialStage++;

  if (game.tutorialStage >= game.tutorialSteps.length) {
    document.getElementById("tutorial-overlay").style.display = "none";
  } else {
    showTutorial();
  }
}

function gameLoop(timestamp) {
  // Calculate delta time
  const deltaTime = timestamp - (game.lastTime || timestamp);
  game.lastTime = timestamp;

  // Clear the canvas
  game.ctx.clearRect(0, 0, game.width, game.height);

  // Handle player input
  handleInput(deltaTime);

  // Update enemies
  updateEnemies(deltaTime);

  // Update traps
  updateTraps(deltaTime);

  // Render ambient lighting
  renderLighting();

  // Update animations
  updateAnimations(deltaTime);

  // Update particles
  updateParticles(deltaTime);

  // Update minimap
  updateMinimap();

  // Check for game over
  if (game.player.health <= 0) {
    gameOver();
    return;
  }

  // Continue the game loop
  requestAnimationFrame(gameLoop);
}

function handleInput(deltaTime) {
  // Get player's current position
  let x = game.player.x;
  let y = game.player.y;

  // Calculate new position based on input
  const speed = 5;
  if (game.keysDown["ArrowUp"] || game.keysDown["w"] || game.keysDown["W"]) {
    y -= speed;
  }
  if (game.keysDown["ArrowDown"] || game.keysDown["s"] || game.keysDown["S"]) {
    y += speed;
  }
  if (game.keysDown["ArrowLeft"] || game.keysDown["a"] || game.keysDown["A"]) {
    x -= speed;
  }
  if (game.keysDown["ArrowRight"] || game.keysDown["d"] || game.keysDown["D"]) {
    x += speed;
  }

  // Check for collisions
  if (!checkCollisions(x, y)) {
    // Update player position
    game.player.x = x;
    game.player.y = y;

    // Update player element position
    const playerElement = document.getElementById("player");
    playerElement.style.left = x + "px";
    playerElement.style.top = y + "px";
  }

  // Check for item collection
  checkItemCollection();

  // Check for door interaction
  checkDoorInteraction();

  // Check for puzzle interaction
  checkPuzzleInteraction();

  // Check for trap activation
  checkTrapActivation();

  // Check for enemy collision
  checkEnemyCollision();
}

function checkCollisions(x, y) {
  // Create player bounding box
  const playerBox = {
    left: x - 15,
    top: y - 15,
    right: x + 15,
    bottom: y + 15,
  };

  // Check wall collisions
  for (const wall of game.walls) {
    const wallBox = {
      left: wall.x,
      top: wall.y,
      right: wall.x + wall.width,
      bottom: wall.y + wall.height,
    };

    if (boxesIntersect(playerBox, wallBox)) {
      return true;
    }
  }

  // Check door collisions for locked doors
  for (const door of game.doors) {
    if (door.locked) {
      const doorBox = {
        left: door.x,
        top: door.y,
        right: door.x + door.width,
        bottom: door.y + door.height,
      };

      if (boxesIntersect(playerBox, doorBox)) {
        return true;
      }
    }
  }

  // Check boundaries
  if (
    playerBox.left < 0 ||
    playerBox.right > game.width ||
    playerBox.top < 0 ||
    playerBox.bottom > game.height
  ) {
    return true;
  }

  return false;
}

function boxesIntersect(a, b) {
  return !(
    a.right < b.left ||
    a.left > b.right ||
    a.bottom < b.top ||
    a.top > b.bottom
  );
}

function checkItemCollection() {
  // Create player bounding circle
  const playerCircle = {
    x: game.player.x,
    y: game.player.y,
    radius: 20,
  };

  // Check each item
  for (let i = 0; i < game.items.length; i++) {
    const item = game.items[i];

    if (!item.collected) {
      // Create item bounding circle
      const itemCircle = {
        x: item.x,
        y: item.y,
        radius: 15,
      };

      // Check collision
      if (circlesIntersect(playerCircle, itemCircle)) {
        collectItem(item, i);
      }
    }
  }
}

function circlesIntersect(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < a.radius + b.radius;
}

function collectItem(item, index) {
  // Mark item as collected
  item.collected = true;

  // Remove item element
  const itemElements = document.getElementsByClassName("item " + item.type);
  if (itemElements.length > 0) {
    const itemElement = itemElements[0];
    itemElement.parentNode.removeChild(itemElement);
  }

  // Add item to inventory
  switch (item.type) {
    case "key":
      game.player.inventory.key = true;
      addLogMessage("You found a key!", "log-item");
      break;
    case "sword":
      game.player.inventory.sword = true;
      game.player.attack += 10;
      addLogMessage("You found a sword! Attack +10", "log-item");
      break;
    case "potion":
      game.player.inventory.potion++;
      addLogMessage("You found a health potion!", "log-item");
      break;
  }

  // Create pickup animation
  createFloatingText(item.x, item.y, "Collected!", "#ff0");

  // Create particles
  createParticles(item.x, item.y, 10, "#ff0");

  // Update inventory UI
  updateInventoryUI();
}

function updateInventoryUI() {
  // Update key slot
  const keySlot = document.getElementById("key-slot");
  keySlot.innerHTML = "";
  keySlot.className =
    "inventory-slot" + (game.player.inventory.key ? " has-item" : "");

  if (game.player.inventory.key) {
    const keyImg = document.createElement("div");
    keyImg.className = "item key";
    keyImg.style.position = "relative";
    keyImg.style.transform = "none";
    keyImg.style.animation = "none";
    keyImg.style.width = "30px";
    keyImg.style.height = "30px";
    keySlot.appendChild(keyImg);
  }

  // Update sword slot
  const swordSlot = document.getElementById("sword-slot");
  swordSlot.innerHTML = "";
  swordSlot.className =
    "inventory-slot" + (game.player.inventory.sword ? " has-item" : "");

  if (game.player.inventory.sword) {
    const swordImg = document.createElement("div");
    swordImg.className = "item sword";
    swordImg.style.position = "relative";
    swordImg.style.transform = "none";
    swordImg.style.animation = "none";
    swordImg.style.width = "30px";
    swordImg.style.height = "30px";
    swordSlot.appendChild(swordImg);
  }

  // Update potion slot
  const potionSlot = document.getElementById("potion-slot");
  potionSlot.innerHTML = "";
  potionSlot.className =
    "inventory-slot" + (game.player.inventory.potion > 0 ? " has-item" : "");

  if (game.player.inventory.potion > 0) {
    const potionContainer = document.createElement("div");
    potionContainer.style.position = "relative";
    potionContainer.style.width = "100%";
    potionContainer.style.height = "100%";
    potionContainer.style.display = "flex";
    potionContainer.style.justifyContent = "center";
    potionContainer.style.alignItems = "center";

    const potionImg = document.createElement("div");
    potionImg.className = "item potion";
    potionImg.style.position = "relative";
    potionImg.style.transform = "none";
    potionImg.style.animation = "none";
    potionImg.style.width = "30px";
    potionImg.style.height = "30px";

    const potionCount = document.createElement("div");
    potionCount.style.position = "absolute";
    potionCount.style.bottom = "2px";
    potionCount.style.right = "2px";
    potionCount.style.background = "rgba(0, 0, 0, 0.7)";
    potionCount.style.color = "#fff";
    potionCount.style.borderRadius = "50%";
    potionCount.style.width = "18px";
    potionCount.style.height = "18px";
    potionCount.style.display = "flex";
    potionCount.style.justifyContent = "center";
    potionCount.style.alignItems = "center";
    potionCount.style.fontSize = "12px";
    potionCount.textContent = game.player.inventory.potion;

    potionContainer.appendChild(potionImg);
    potionContainer.appendChild(potionCount);
    potionSlot.appendChild(potionContainer);
  }
}

function usePotion() {
  if (
    game.player.inventory.potion > 0 &&
    game.player.health < game.player.maxHealth
  ) {
    game.player.inventory.potion--;

    const healAmount = 30;
    game.player.health = Math.min(
      game.player.health + healAmount,
      game.player.maxHealth
    );

    addLogMessage(
      "You used a health potion and restored " + healAmount + " health.",
      "log-player"
    );
    createFloatingText(
      game.player.x,
      game.player.y,
      "+" + healAmount + " HP",
      "#0f0",
      "heal-text"
    );

    createParticles(game.player.x, game.player.y, 15, "#0f0");

    updateHealthUI();
    updateInventoryUI();
  } else if (game.player.inventory.potion <= 0) {
    addLogMessage("You don't have any potions!", "log-player");
  } else {
    addLogMessage("You're already at full health!", "log-player");
  }
}

function updateHealthUI() {
  const healthFill = document.getElementById("health-fill");
  const healthPercent = (game.player.health / game.player.maxHealth) * 100;
  healthFill.style.width = healthPercent + "%";
}

function checkDoorInteraction() {
  // Create player bounding circle
  const playerCircle = {
    x: game.player.x,
    y: game.player.y,
    radius: 25,
  };

  // Check each door
  for (let i = 0; i < game.doors.length; i++) {
    const door = game.doors[i];

    // Skip unlocked doors
    if (door.locked) {
      // Create door bounding box
      const doorBox = {
        left: door.x - 5,
        top: door.y - 5,
        right: door.x + door.width + 5,
        bottom: door.y + door.height + 5,
      };

      // Convert box to circle for simple distance check
      const doorCircle = {
        x: door.x + door.width / 2,
        y: door.y + door.height / 2,
        radius: Math.max(door.width, door.height) / 2,
      };

      // Check if player is near the door
      if (circlesIntersect(playerCircle, doorCircle)) {
        if (door.isExit) {
          if (game.currentLevel < game.maxLevel) {
            // Advance to next level
            game.currentLevel++;
            loadLevel(game.currentLevel);
            return;
          } else {
            // Win the game
            winGame();
            return;
          }
        } else if (game.player.inventory.key) {
          // Unlock the door
          door.locked = false;

          // Update door element
          const doorElements = document.getElementsByClassName("door locked");
          if (doorElements.length > 0) {
            doorElements[0].classList.remove("locked");
          }

          // Use up the key
          game.player.inventory.key = false;

          // Update inventory UI
          updateInventoryUI();

          // Add log message
          addLogMessage("You unlocked a door with your key!", "log-item");

          // Create unlock animation
          createFloatingText(
            door.x + door.width / 2,
            door.y + door.height / 2,
            "Unlocked!",
            "#ff0"
          );

          // Create particles
          createParticles(
            door.x + door.width / 2,
            door.y + door.height / 2,
            15,
            "#ff0"
          );
        } else {
          // Add log message
          addLogMessage(
            "This door is locked. You need a key to open it.",
            "log-item"
          );
        }
      }
    }
  }
}

function checkPuzzleInteraction() {
  // Create player bounding circle
  const playerCircle = {
    x: game.player.x,
    y: game.player.y,
    radius: 20,
  };

  // Check each puzzle
  for (let i = 0; i < game.puzzles.length; i++) {
    const puzzle = game.puzzles[i];

    if (!puzzle.solved) {
      // Create puzzle bounding box
      const puzzleBox = {
        left: puzzle.x,
        top: puzzle.y,
        right: puzzle.x + puzzle.width,
        bottom: puzzle.y + puzzle.height,
      };

      // Convert box to circle for simple distance check
      const puzzleCircle = {
        x: puzzle.x + puzzle.width / 2,
        y: puzzle.y + puzzle.height / 2,
        radius: Math.max(puzzle.width, puzzle.height) / 2,
      };

      // Check if player is inside the puzzle area
      if (circlesIntersect(playerCircle, puzzleCircle)) {
        // Activate puzzle
        activatePuzzle(puzzle);
        return;
      }
    }
  }
}

function activatePuzzle(puzzle) {
  // Set active puzzle
  game.activePuzzle = puzzle;

  // Show puzzle UI
  const puzzleOverlay = document.getElementById("puzzle-overlay");
  const puzzleTitle = document.getElementById("puzzle-title");
  const puzzleDescription = document.getElementById("puzzle-description");
  const puzzleContent = document.getElementById("puzzle-content");

  // Set puzzle title and description
  puzzleTitle.textContent = "Puzzle Challenge";
  puzzleDescription.textContent = puzzle.data.description;

  // Clear puzzle content
  puzzleContent.innerHTML = "";

  // Create puzzle content based on type
  switch (puzzle.data.type) {
    case "sequence":
      createSequencePuzzle(puzzleContent, puzzle.data);
      break;
    case "symbols":
      createSymbolsPuzzle(puzzleContent, puzzle.data);
      break;
    case "riddle":
      createRiddlePuzzle(puzzleContent, puzzle.data);
      break;
  }

  // Show puzzle overlay
  puzzleOverlay.style.display = "flex";
}

function createSequencePuzzle(container, puzzleData) {
  // Create buttons
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "sequence-buttons";

  // Create 4 buttons
  for (let i = 1; i <= 4; i++) {
    const button = document.createElement("div");
    button.className = "sequence-button";
    button.textContent = i;
    button.dataset.value = i;

    // Add click event
    button.addEventListener("click", function () {
      this.classList.add("clicked");

      // Get all clicked buttons
      const clickedButtons = document.querySelectorAll(
        ".sequence-button.clicked"
      );
      const sequence = Array.from(clickedButtons).map((btn) =>
        parseInt(btn.dataset.value)
      );

      // Store sequence in puzzle overlay
      document.getElementById("puzzle-overlay").dataset.sequence =
        sequence.join(",");
    });

    buttonContainer.appendChild(button);
  }

  container.appendChild(buttonContainer);

  // Create reset button
  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset Sequence";
  resetButton.className = "puzzle-reset";
  resetButton.addEventListener("click", function () {
    // Clear all clicked buttons
    const clickedButtons = document.querySelectorAll(".sequence-button.clicked");
    clickedButtons.forEach((btn) => btn.classList.remove("clicked"));

    // Clear stored sequence
    document.getElementById("puzzle-overlay").dataset.sequence = "";
  });

  container.appendChild(resetButton);
}

function createSymbolsPuzzle(container, puzzleData) {
  // Create symbols container
  const symbolsContainer = document.createElement("div");
  symbolsContainer.className = "symbols-container";

  // Create symbols
  for (let value of puzzleData.options) {
    const symbol = document.createElement("div");
    symbol.className = "symbol";
    symbol.textContent = value;
    symbol.dataset.value = value;

    // Add click event
    symbol.addEventListener("click", function () {
      this.classList.toggle("selected");

      // Get all selected symbols
      const selectedSymbols = document.querySelectorAll(".symbol.selected");
      const selection = Array.from(selectedSymbols).map((sym) =>
        parseInt(sym.dataset.value)
      );

      // Store selection in puzzle overlay
      document.getElementById("puzzle-overlay").dataset.selection =
        selection.join(",");
    });

    symbolsContainer.appendChild(symbol);
  }

  container.appendChild(symbolsContainer);
}

function createRiddlePuzzle(container, puzzleData) {
  // Create options container
  const optionsContainer = document.createElement("div");
  optionsContainer.className = "riddle-options";

  // Create options
  for (let option of puzzleData.options) {
    const optionElement = document.createElement("div");
    optionElement.className = "riddle-option";
    optionElement.textContent = option;

    // Add click event
    optionElement.addEventListener("click", function () {
      // Remove selected class from all options
      document
        .querySelectorAll(".riddle-option")
        .forEach((opt) => opt.classList.remove("selected"));

      // Add selected class to this option
      this.classList.add("selected");

      // Store selection in puzzle overlay
      document.getElementById("puzzle-overlay").dataset.answer = option;
    });

    optionsContainer.appendChild(optionElement);
  }

  container.appendChild(optionsContainer);
}

function submitPuzzle() {
  // Get active puzzle
  const puzzle = game.activePuzzle;

  // Get puzzle overlay
  const puzzleOverlay = document.getElementById("puzzle-overlay");

  // Check solution based on puzzle type
  let solved = false;

  switch (puzzle.data.type) {
    case "sequence":
      const sequence = puzzleOverlay.dataset.sequence.split(",").map(Number);
      solved = arraysEqual(sequence, puzzle.data.solution);
      break;
    case "symbols":
      const selection = puzzleOverlay.dataset.selection.split(",").map(Number);
      selection.sort((a, b) => a - b);
      const solution = [...puzzle.data.solution].sort((a, b) => a - b);
      solved = arraysEqual(selection, solution);
      break;
    case "riddle":
      const answer = puzzleOverlay.dataset.answer;
      solved = answer === puzzle.data.solution;
      break;
  }

  // Mark puzzle as solved if correct
  if (solved) {
    puzzle.solved = true;

    // Hide puzzle overlay
    puzzleOverlay.style.display = "none";

    // Remove puzzle element
    const puzzleElements = document.getElementsByClassName("puzzle");
    if (puzzleElements.length > 0) {
      puzzleElements[0].classList.add("solved");
    }

    // Grant reward
    grantPuzzleReward(puzzle);

    // Add log message
    addLogMessage("You solved the puzzle!", "log-player");
  } else {
    // Add log message
    addLogMessage("That's not the correct solution. Try again!", "log-player");

    // Flash puzzle overlay
    puzzleOverlay.classList.add("wrong");
    setTimeout(() => {
      puzzleOverlay.classList.remove("wrong");
    }, 500);
  }
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function grantPuzzleReward(puzzle) {
  const reward = puzzle.data.reward;

  switch (reward) {
    case "key":
      game.player.inventory.key = true;
      addLogMessage("Puzzle reward: You received a key!", "log-item");
      break;
    case "potion":
      game.player.inventory.potion++;
      addLogMessage(
        "Puzzle reward: You received a health potion!",
        "log-item"
      );
      break;
    case "sword":
      game.player.inventory.sword = true;
      game.player.attack += 10;
      addLogMessage("Puzzle reward: You received a sword! Attack +10", "log-item");
      break;
  }

  // Create reward animation
  createFloatingText(
    puzzle.x + puzzle.width / 2,
    puzzle.y + puzzle.height / 2,
    "Puzzle Solved!",
    "#ff0"
  );

  // Create particles
  createParticles(
    puzzle.x + puzzle.width / 2,
    puzzle.y + puzzle.height / 2,
    20,
    "#ff0"
  );

  // Update inventory UI
  updateInventoryUI();
}

function cancelPuzzle() {
  // Hide puzzle overlay
  document.getElementById("puzzle-overlay").style.display = "none";

  // Clear active puzzle
  game.activePuzzle = null;
}

function checkTrapActivation() {
  // Create player bounding circle
  const playerCircle = {
    x: game.player.x,
    y: game.player.y,
    radius: 20,
  };

  // Check each trap
  for (let i = 0; i < game.traps.length; i++) {
    const trap = game.traps[i];

    // Skip if trap is on cooldown
    if (trap.cooldown > 0) {
      continue;
    }

    // Create trap bounding box
    const trapBox = {
      left: trap.x,
      top: trap.y,
      right: trap.x + trap.width,
      bottom: trap.y + trap.height,
    };

    // Check if player is inside the trap
    if (boxIntersectsCircle(trapBox, playerCircle)) {
      if (!trap.activated) {
        // Activate trap
        activateTrap(trap);
      }

      // Make trap visible
      if (!trap.visible) {
        showTrap(trap);
      }
    }
  }
}

function boxIntersectsCircle(box, circle) {
  // Find the closest point on the box to the circle center
  const closestX = Math.max(box.left, Math.min(circle.x, box.right));
  const closestY = Math.max(box.top, Math.min(circle.y, box.bottom));

  // Calculate distance from closest point to circle center
  const distanceX = circle.x - closestX;
  const distanceY = circle.y - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  // Check if the closest point is inside the circle
  return distanceSquared <= circle.radius * circle.radius;
}

function activateTrap(trap) {
  // Mark trap as activated
  trap.activated = true;

  // Deal damage to player
  const damage = 10;
  game.player.health -= damage;

  // Update health UI
  updateHealthUI();

  // Add log message
  addLogMessage("You triggered a trap! -" + damage + " health.", "log-enemy");

  // Create damage animation
  createFloatingText(
    game.player.x,
    game.player.y,
    "-" + damage + " HP",
    "#f00",
    "damage-text"
  );

  // Create particles
  createParticles(game.player.x, game.player.y, 10, "#f00");

  // Set trap cooldown
  trap.cooldown = 2000;
}

function showTrap(trap) {
  // Mark trap as visible
  trap.visible = true;

  // Update trap element
  const trapElements = document.getElementsByClassName("trap");
  for (let i = 0; i < trapElements.length; i++) {
    const element = trapElements[i];
    if (
      parseInt(element.style.left) === trap.x &&
      parseInt(element.style.top) === trap.y
    ) {
      element.classList.add("visible");
      break;
    }
  }
}

function updateTraps(deltaTime) {
  // Update trap cooldowns
  for (let i = 0; i < game.traps.length; i++) {
    const trap = game.traps[i];

    if (trap.cooldown > 0) {
      trap.cooldown -= deltaTime;

      if (trap.cooldown <= 0) {
        trap.activated = false;
      }
    }
  }
}

function checkEnemyCollision() {
  // Create player bounding circle
  const playerCircle = {
    x: game.player.x,
    y: game.player.y,
    radius: 20,
  };

  // Check each enemy
  for (let i = 0; i < game.enemies.length; i++) {
    const enemy = game.enemies[i];

    // Skip dead enemies
    if (enemy.health <= 0) {
      continue;
    }

    // Create enemy bounding circle
    const enemyCircle = {
      x: enemy.x,
      y: enemy.y,
      radius: 20,
    };

    // Check collision
    if (circlesIntersect(playerCircle, enemyCircle)) {
      attackEnemy(enemy, i);
    }
  }
}

function attackEnemy(enemy, index) {
  const damage = Math.max(0, game.player.attack - enemy.defense);
  enemy.health -= damage;

  if (enemy.health <= 0) {
    game.enemies.splice(index, 1);
    const enemyElement = document.querySelector(
      `.monster[data-index="${index}"]`
    );
    if (enemyElement) {
      enemyElement.remove();
    }
    addLogMessage(`You defeated the ${enemy.type}!`, "log-player");
  } else {
    addLogMessage(
      `You hit the ${enemy.type} for ${damage} damage!`,
      "log-player"
    );
  }

  // Enemy counterattack
  const enemyDamage = Math.max(0, enemy.attack - game.player.defense);
  game.player.health -= enemyDamage;
  addLogMessage(
    `The ${enemy.type} hit you for ${enemyDamage} damage!`,
    "log-monster"
  );

  updateHealthUI();
}

function updateEnemies(deltaTime) {
  // Update enemy positions and behavior
  for (let i = 0; i < game.enemies.length; i++) {
    const enemy = game.enemies[i];

    if (enemy.health > 0) {
      // Move towards the player
      const dx = game.player.x - enemy.x;
      const dy = game.player.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        enemy.x += (dx / distance) * 2;
        enemy.y += (dy / distance) * 2;
      }

      // Update enemy element position
      const enemyElement = document.querySelector(
        `.monster[data-index="${i}"]`
      );
      if (enemyElement) {
        enemyElement.style.left = enemy.x + "px";
        enemyElement.style.top = enemy.y + "px";
      }
    }
  }
}

function winGame() {
  document.getElementById("win-screen").style.display = "flex";
  addLogMessage("You escaped the dungeon! Congratulations!", "log-player");
}

function gameOver() {
  document.getElementById("game-over-screen").style.display = "flex";
  addLogMessage("You have been defeated...", "log-monster");
}

function createFloatingText(x, y, text, color, className = "floating-text") {
  const floatingText = document.createElement("div");
  floatingText.className = className;
  floatingText.textContent = text;
  floatingText.style.color = color;
  floatingText.style.left = x + "px";
  floatingText.style.top = y + "px";
  document.getElementById("game-container").appendChild(floatingText);

  setTimeout(() => {
    floatingText.remove();
  }, 1000);
} function createParticles(x, y, count, color) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.className = "floating-particle";
    particle.style.backgroundColor = color;
    particle.style.left = x + "px";
    particle.style.top = y + "px";
    particle.style.setProperty("--tx", `${Math.random() * 100 - 50}px`);
    particle.style.setProperty("--ty", `${Math.random() * 100 - 50}px`);
    document.getElementById("game-container").appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 2000);
  }
}

function renderLighting() {
  // This function can be expanded to add lighting effects
  // For now, it just clears the canvas
  game.ctx.clearRect(0, 0, game.width, game.height);
}

function updateAnimations(deltaTime) {
  // Update any animations here
}

function updateParticles(deltaTime) {
  // Update particle positions here
}

function clearCombatLog() {
  document.getElementById("combat-log").innerHTML = "";
}

function addLogMessage(message, className) {
  const logEntry = document.createElement("div");
  logEntry.className = `log-entry ${className}`;
  logEntry.textContent = message;
  document.getElementById("combat-log").appendChild(logEntry);

  setTimeout(() => {
    logEntry.classList.add("visible");
  }, 10);
}

// Initialize the game
initGame();