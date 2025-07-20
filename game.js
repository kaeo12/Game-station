const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = 5;
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false
        };
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        if (this.keys.up && this.y - this.radius > 0) {
            this.y -= this.speed;
        }
        if (this.keys.down && this.y + this.radius < canvas.height) {
            this.y += this.speed;
        }
        if (this.keys.left && this.x - this.radius > 0) {
            this.x -= this.speed;
        }
        if (this.keys.right && this.x + this.radius < canvas.width) {
            this.x += this.speed;
        }
        this.draw();
    }
}

let player;
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.y += this.velocity.y;
        this.draw();
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.draw();
    }
}

class Asteroid {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.draw();
    }
}

let projectiles = [];
let enemies = [];
let asteroids = [];
let score = 0;
let gameOver = false;

// Game loop
function gameLoop() {
    if (gameOver) {
        // Game over screen
        ctx.fillStyle = 'white';
        ctx.font = '50px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 70, canvas.height / 2 + 40);
        return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Update and draw game objects
    player.update();
    projectiles.forEach((projectile, index) => {
        projectile.update();

        // Remove projectiles that are off screen
        if (projectile.y + projectile.radius < 0) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        }
    });

    enemies.forEach((enemy, index) => {
        enemy.update();

        // Remove enemies that are off screen
        if (enemy.y > canvas.height + enemy.radius) {
            setTimeout(() => {
                enemies.splice(index, 1);
            }, 0);
        }
    });

    // Collision detection
    projectiles.forEach((projectile, pIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (detectCollision(projectile, enemy)) {
                score += 10;
                setTimeout(() => {
                    enemies.splice(eIndex, 1);
                    projectiles.splice(pIndex, 1);
                }, 0);
            }
        });

        asteroids.forEach((asteroid, aIndex) => {
            if (detectCollision(projectile, asteroid)) {
                setTimeout(() => {
                    projectiles.splice(pIndex, 1);
                }, 0);
            }
        });
    });

    enemies.forEach((enemy, eIndex) => {
        if (detectCollision(player, enemy)) {
            gameOver = true;
        }
    });

    asteroids.forEach((asteroid, aIndex) => {
        asteroid.update();

        if (detectCollision(player, asteroid)) {
            gameOver = true;
        }

        // Remove asteroids that are off screen
        if (asteroid.y > canvas.height + asteroid.radius) {
            setTimeout(() => {
                asteroids.splice(aIndex, 1);
            }, 0);
        }
    });

    requestAnimationFrame(gameLoop);
}

function detectCollision(a, b) {
    const dist = Math.hypot(a.x - b.x, a.y - b.y);
    return dist - a.radius - b.radius < 1;
}

function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * (30 - 10) + 10;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = -radius;
        const color = 'red';
        const velocity = {
            x: 0,
            y: Math.random() * 2 + 1
        };
        enemies.push(new Enemy(x, y, radius, color, velocity));
    }, 1000);
}

function spawnAsteroids() {
    setInterval(() => {
        const radius = Math.random() * (40 - 20) + 20;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = -radius;
        const color = 'gray';
        const velocity = {
            x: Math.random() * 4 - 2,
            y: Math.random() * 2 + 1
        };
        asteroids.push(new Asteroid(x, y, radius, color, velocity));
    }, 1500);
}

// Initialize player
player = new Player(canvas.width / 2, canvas.height - 30, 20, 'white');


// Shoot projectiles
window.addEventListener('click', (e) => {
    const projectile = new Projectile(
        player.x,
        player.y,
        5,
        'white',
        { x: 0, y: -5 }
    );
    projectiles.push(projectile);
});


// Keyboard event listeners
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
        case 'ArrowUp':
            player.keys.up = true;
            break;
        case 's':
        case 'ArrowDown':
            player.keys.down = true;
            break;
        case 'a':
        case 'ArrowLeft':
            player.keys.left = true;
            break;
        case 'd':
        case 'ArrowRight':
            player.keys.right = true;
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
        case 'ArrowUp':
            player.keys.up = false;
            break;
        case 's':
        case 'ArrowDown':
            player.keys.down = false;
            break;
        case 'a':
        case 'ArrowLeft':
            player.keys.left = false;
            break;
        case 'd':
        case 'ArrowRight':
            player.keys.right = false;
            break;
    }
});

// Start the game loop
gameLoop();
spawnEnemies();
spawnAsteroids();
