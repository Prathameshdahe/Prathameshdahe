const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 500,
    parent: "game",
    pixelArt: true, // Perfect for pixel art games
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let keys;

// Dialog UI Elements
const dialogBox = document.getElementById("dialog-box");
const dialogText = document.getElementById("dialog-text");
const dialogAvatar = document.getElementById("dialog-avatar");

let currentDialogIndex = 0;
let dialogActive = false;
let dialogCooldown = 0;
let currentInteraction = null;

// Define Interaction Points
const interactables = [
    {
        id: "professor",
        x: 400,
        y: 150,
        radius: 60,
        avatar: "assets/professor.png",
        dialogue: [
            "Professor AI: Welcome to the world of code!",
            "Professor AI: This is Prathamesh.",
            "Professor AI: A developer, builder, and night owl.",
            "Professor AI: His skills include:\n- Python\n- AI / Computer Vision\n- Web Development\n- IoT",
            "Professor AI: He builds things like:\n- Smart Security Camera\n- OCR systems\n- Web dashboards",
            "Professor AI: Check his repositories to explore more!"
        ]
    },
    {
        id: "laptop",
        x: 150,
        y: 200, // Left side desk area
        radius: 60,
        avatar: "assets/player.png",
        dialogue: [
            "💻 You found Prathamesh's laptop!",
            "Skills unlocked:\n- Python\n- AI\n- Computer Vision\n- Full Stack Development"
        ]
    },
    {
        id: "coffee",
        x: 400,
        y: 350, // Center table area
        radius: 50,
        avatar: "assets/player.png",
        dialogue: [
            "☕ +10 Energy",
            "🦉 Night Owl Mode activated!"
        ]
    },
    {
        id: "camera",
        x: 650,
        y: 200, // Right side lab area
        radius: 60,
        avatar: "assets/player.png",
        dialogue: [
            "👁️ AI Security Camera Project detected!",
            "Currently Training:\n- AI Models\n- Computer Vision"
        ]
    }
];

function preload() {
    this.load.image("room", "assets/room.png");
    this.load.image("player", "assets/player.png");
    this.load.image("professor", "assets/professor.png");
}

function create() {
    // Add Room Background and scale to fit
    const bg = this.add.image(400, 250, "room");
    bg.setDisplaySize(800, 500);

    // Add Professor Sprite
    const prof = this.physics.add.sprite(400, 150, "professor");
    prof.setDisplaySize(64, 64);
    prof.setImmovable(true);

    // Define interactive zones graphically for debugging (optional) invisible in prod
    // this.add.circle(150, 200, 50, 0xff0000, 0.5); // Laptop
    // this.add.circle(400, 350, 50, 0x00ff00, 0.5); // Coffee
    // this.add.circle(650, 200, 50, 0x0000ff, 0.5); // Camera

    // Add Player Sprite
    player = this.physics.add.sprite(400, 450, "player");
    player.setDisplaySize(64, 64);
    player.setCollideWorldBounds(true);

    // Physics collision with professor
    this.physics.add.collider(player, prof);

    // Controls
    cursors = this.input.keyboard.createCursorKeys();
    keys = this.input.keyboard.addKeys('W,A,S,D,SPACE,ENTER');

    // Instruction Text inside game
    this.add.text(10, 10, "Explore the Room!", {
        fontSize: "14px",
        fill: "#fff",
        fontFamily: "'Press Start 2P', cursive",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: { x: 5, y: 5 }
    });
}

function update(time, delta) {
    // Don't move if dialog is active
    if (dialogActive) {
        player.setVelocity(0);
        
        // Handle Dialog progression
        if (dialogCooldown <= 0) {
            if (Phaser.Input.Keyboard.JustDown(cursors.space) || 
                Phaser.Input.Keyboard.JustDown(keys.SPACE) || 
                Phaser.Input.Keyboard.JustDown(keys.ENTER)) {
                
                currentDialogIndex++;
                
                if (currentDialogIndex >= currentInteraction.dialogue.length) {
                    closeDialog();
                } else {
                    showDialogLine();
                }
                dialogCooldown = 500; // prevent double trigger
            }
        }
    } else {
        // Player Movement
        let speed = 200;
        player.setVelocity(0);

        if (cursors.left.isDown || keys.A.isDown) {
            player.setVelocityX(-speed);
        } else if (cursors.right.isDown || keys.D.isDown) {
            player.setVelocityX(speed);
        }

        if (cursors.up.isDown || keys.W.isDown) {
            player.setVelocityY(-speed);
        } else if (cursors.down.isDown || keys.S.isDown) {
            player.setVelocityY(speed);
        }

        // Interaction Check
        if (dialogCooldown <= 0) {
            if (Phaser.Input.Keyboard.JustDown(cursors.space) || 
                Phaser.Input.Keyboard.JustDown(keys.SPACE) || 
                Phaser.Input.Keyboard.JustDown(keys.ENTER)) {
                
                checkInteraction();
            }
        }
    }

    if (dialogCooldown > 0) {
        dialogCooldown -= delta;
    }
}

function checkInteraction() {
    for (let i = 0; i < interactables.length; i++) {
        let item = interactables[i];
        let dist = Phaser.Math.Distance.Between(player.x, player.y, item.x, item.y);
        
        if (dist <= item.radius) {
            // Trigger Interaction
            currentInteraction = item;
            currentDialogIndex = 0;
            dialogActive = true;
            
            // Show UI Box
            dialogBox.classList.remove("hidden");
            dialogBox.style.display = "flex";
            
            showDialogLine();
            dialogCooldown = 500;
            return;
        }
    }
}

function showDialogLine() {
    dialogAvatar.src = currentInteraction.avatar;
    dialogText.innerText = currentInteraction.dialogue[currentDialogIndex];
}

function closeDialog() {
    dialogActive = false;
    currentInteraction = null;
    dialogBox.classList.add("hidden");
    setTimeout(() => { dialogBox.style.display = "none"; }, 300); // Wait for fade
}
