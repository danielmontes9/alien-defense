//DECLARATION OF VARIABLES.
var alien;
var keys;
var enemies;
var bulletTime = 0;
var bullets;
var bullet;
var missile = 0;
var counterHeart = 0;
var counterCoin = 0;
var counter = 60;
var textTime = 90;
var textLevel = 1;
var textScore = 3;
var textLives = 3;
var upLevel = 1;
var upScore = 0;
var upLive = 3;
var heart;
var coin;
var difficulty = 0;
var fx;
var buttonP;
var w = 800,
	h = 600;
var music;

var gameState = {
	preload: function () {
		game.load.image("bg", "resources/images/bg.jpg");
		game.load.image("alien", "resources/images/alien.png");
		game.load.image("missile", "resources/images/missile.png");
		game.load.image("canon", "resources/images/canon.png");
		game.load.image("heart", "resources/images/heart.png");
		game.load.image("coin", "resources/images/coin.png");
		game.load.image("pauseImg", "resources/images/pause.png");

		game.load.audio("effects", "resources/audio/effects/fx_mixdown.ogg");
		game.load.audio("music", "resources/audio/music/melodyloops-adrenaline.mp3");

		game.forceSingleUpdate = true;
	},

	create: function () {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		//IMAGES!
		//->Background<-
		game.add.tileSprite(0, 0, 800, 450, "bg");
		//->Alien<-
		alien = game.add.sprite(game.width / 2, 390, "alien");
		alien.anchor.setTo(0.5);
		alien.scale.setTo(0.121, 0.121);
		//LIMITS
		game.physics.arcade.enable(alien);
		alien.body.collideWorldBounds = true;
		//->Enemies<-
		enemies = game.add.group();
		enemies.scale.setTo(0.11, 0.11);
		for (var y = 0; y < 1; y++) {
			for (var x = 0; x < 12; x++) {
				var enemy = enemies.create(x * 585, 45, "canon");
				enemy.anchor.setTo(0.5);
			}
		}
		enemies.x = 46;
		enemies.y = 68;
		//->BULLETS<-
		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(5, "missile");
		bullets.scale.setTo(0.3, 0.3);
		bullets.setAll("anchor.x", -0.05);
		bullets.setAll("anchor.y", 0.07);
		bullets.setAll("outOfBoundsKill", true);
		bullets.setAll("checkWorldBounds", true);
		//->Heart<-
		hearts = game.add.group();
		hearts.enableBody = true;
		hearts.physicsBodyType = Phaser.Physics.ARCADE;
		hearts.createMultiple(15, "heart");
		hearts.scale.setTo(0.11, 0.11);
		//->Coin<-
		coins = game.add.group();
		coins.enableBody = true;
		coins.physicsBodyType = Phaser.Physics.ARCADE;
		coins.createMultiple(150, "coin");
		coins.scale.setTo(0.11, 0.11);
		coins.setAll("anchor.x", -0.02);
		coins.setAll("anchor.y", -0.02);
		//KEYS
		keys = game.input.keyboard.createCursorKeys();
		//SCOREBOARD\\
		//Score
		var style = { font: "bold 32px Arial", fill: "#FFF" };

		textScore = game.add.text(100, 25, "Score: 0", {
			font: "bold 32px Arial",
			fill: "#D1D1D1",
			align: "center",
		});
		textScore.anchor.setTo(0.5, 0.5);
		textScore.setShadow(3, 3, "rgba(0,0,0,0.5)", 2);

		//Lifes
		textLives = game.add.text(270, 25, "Lives: x3", {
			font: "bold 32px Arial",
			fill: "#D1D1D1",
			align: "center",
		});
		textLives.anchor.setTo(0.5, 0.5);
		textLives.setShadow(3, 3, "rgba(0,0,0,0.5)", 2);

		//Levels
		textLevel = game.add.text(700, 25, "Level: 1", {
			font: "bold 32px Arial",
			fill: "#D1D1D1",
			align: "center",
		});
		textLevel.anchor.setTo(0.5, 0.5);
		textLevel.setShadow(3, 3, "rgba(0,0,0,0.5)", 2);

		//Timer
		textTime = game.add.text(520, 25, "Time: 60", {
			font: "bold 32px Arial",
			fill: "#D1D1D1",
			align: "center",
		});
		textTime.anchor.setTo(0.5, 0.5);
		textTime.setShadow(3, 3, "rgba(0,0,0,0.5)", 2);
		game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);

		fx = game.add.audio("effects");
		fx.allowMultiple = true;
		//Music
		var music = game.add.audio("music");
		music.volume = 0.3;
		music.loop = true;
		music.play();
		//Effects
		fx.addMarker("alien death", 1, 1.0);
		fx.addMarker("boss hit", 3, 0.5);
		fx.addMarker("escape", 4, 3.2);
		fx.addMarker("meow", 8, 0.5);
		fx.addMarker("numkey", 9, 0.1);
		fx.addMarker("ping", 10, 1.0);
		fx.addMarker("death", 12, 4.2);
		fx.addMarker("shot", 17, 1.0);
		fx.addMarker("squit", 19, 0.3);
		//PAUSE
		buttonP = game.add.button(game.width / 2, 25, "pauseImg");
		buttonP.anchor.setTo(0.5);
		buttonP.scale.setTo(0.1, 0.1);

		buttonP.inputEnabled = true;
		buttonP.events.onInputUp.add(function () {
			game.paused = true;

			choiseLabel = game.add.text(w / 2, h - 300, "Click to continue", {
				font: "30px Arial",
				fill: "#fff",
			});
			choiseLabel.anchor.setTo(0.5, 0.5);
		});

		game.input.onDown.add(unpause, self);
		function unpause(event) {
			// Only act if paused
			if (game.paused) {
				var x1 = w / 2 - 270 / 2,
					x2 = w / 2 + 270 / 2,
					y1 = h / 2 - 180 / 2,
					y2 = h / 2 + 180 / 2;

				// Check if the click was inside the menu
				if (event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2) {
					var x = event.x - x1,
						y = event.y - y1;

					var choise = Math.floor(x / 90) + 3 * Math.floor(y / 90);
				} else {
					choiseLabel.destroy();
					// Unpause the game
					game.paused = false;
				}
			}
		}
	},

	update: function () {
		//Limits
		if (alien.y <= 110) {
			alien.y = 400;
		}
		//Volume Effets
		fx.volume = 0.25;
		//KEYS
		if (keys.right.isDown) {
			alien.position.x += 4;
		}
		if (keys.left.isDown) {
			alien.position.x -= 4;
		}
		if (keys.up.isDown) {
			alien.position.y -= 4;
		}
		if (keys.down.isDown) {
			alien.position.y += 4;
		}
		//Collision Alien & Bullet
		game.physics.arcade.collide(alien, bullets, function (alien, bullet) {
			bullet.kill();
			alien.kill();
			upLive--;
			textLives.setText("Lives: x" + upLive);
			alien.reset(game.width / 2, 390);
			fx.play("death");
		});
		//Collision Alien & Items
		game.physics.arcade.collide(alien, hearts, function (alien, heart) {
			heart.kill();
			upLive++;
			textLives.setText("Lives: x" + upLive);
			fx.play("numkey");
		});
		game.physics.arcade.collide(alien, coins, function (alien, coin) {
			coin.kill();
			upScore++;
			textScore.setText("Score: " + upScore);
			fx.play("ping");
		});
		//Game over
		if (upLive < 0) {
			this.state.start("gameOVER");
		}
	},
};

//ADDITIONAL FUNCTIONS
function updateCounter() {
	//Time
	counter--;
	textTime.setText("Time: " + counter);
	//Level
	if (counter == 0) {
		counter = 61;
		upLevel++;
		textLevel.setText("Level: " + upLevel);

		difficulty += 50;
	}
	//Score
	if (counter == 30) {
		upScore += 100;
		textScore.setText("Score: " + upScore);
	}
	//Items
	//->Heart<-
	counterHeart++;
	if (counterHeart == 40) {
		loadItemHeart();
		counterHeart = 0;
	}
	//->Coin<-
	counterCoin++;
	if (counterCoin == 8) {
		loadItemCoin();
		counterCoin = 0;
	}

	//SHOTS
	//CANON 1 & 2
	if (alien.x > 0 && alien.x <= 134) {
		if (game.time.now > bulletTime) {
			bullet = bullets.getFirstExists(false);
		}
		if (bullet) {
			bullet.reset(90, 250);
			bullet.body.velocity.y = +300 + difficulty;
			bullet.body.setSize(23, 30, 0, 0);
			fx.play("shot");
			missile++;
			if (missile == 1) {
				bullet.reset(300, 250);
				bullet.body.velocity.y = +300 + difficulty;
				bullet.body.setSize(23, 30, 0, 0);
				fx.play("shot");
			}
		}
	}
	//CANON 3 & 4
	if (alien.x > 134 && alien.x <= 268) {
		if (game.time.now > bulletTime) {
			bullet = bullets.getFirstExists(false);
		}
		if (bullet) {
			bullet.reset(520, 250);
			bullet.body.velocity.y = +300 + difficulty;
			bullet.body.setSize(23, 30, 0, 0);
			fx.play("shot");
			missile++;
			if (missile == 1) {
				bullet.reset(730, 250);
				bullet.body.velocity.y = +300 + difficulty;
				bullet.body.setSize(23, 30, 0, 0);
				fx.play("shot");
			}
		}
	}
	//CANON 5 & 6
	if (alien.x > 268 && alien.x <= 402) {
		if (game.time.now > bulletTime) {
			bullet = bullets.getFirstExists(false);
		}
		if (bullet) {
			bullet.reset(950, 250);
			bullet.body.velocity.y = +300 + difficulty;
			bullet.body.setSize(23, 30, 0, 0);
			fx.play("shot");
			missile++;
			if (missile == 1) {
				bullet.reset(1170, 250);
				bullet.body.velocity.y = +300 + difficulty;
				bullet.body.setSize(23, 30, 0, 0);
				fx.play("shot");
			}
		}
	}
	//CANON 7 & 8
	if (alien.x > 402 && alien.x <= 536) {
		if (game.time.now > bulletTime) {
			bullet = bullets.getFirstExists(false);
		}
		if (bullet) {
			bullet.reset(1390, 250);
			bullet.body.velocity.y = +300 + difficulty;
			bullet.body.setSize(23, 30, 0, 0);
			fx.play("shot");
			missile++;
			if (missile == 1) {
				bullet.reset(1610, 250);
				bullet.body.velocity.y = +300 + difficulty;
				bullet.body.setSize(23, 30, 0, 0);
				fx.play("shot");
			}
		}
	}
	//CANON 9 & 10
	if (alien.x > 536 && alien.x <= 670) {
		if (game.time.now > bulletTime) {
			bullet = bullets.getFirstExists(false);
		}
		if (bullet) {
			bullet.reset(1820, 250);
			bullet.body.velocity.y = +300 + difficulty;
			bullet.body.setSize(23, 30, 0, 0);
			fx.play("shot");
			missile++;
			if (missile == 1) {
				bullet.reset(2040, 250);
				bullet.body.velocity.y = +300 + difficulty;
				bullet.body.setSize(23, 30, 0, 0);
				fx.play("shot");
			}
		}
	}
	//CANON 11 & 12
	if (alien.x > 670 && alien.x <= 800) {
		if (game.time.now > bulletTime) {
			bullet = bullets.getFirstExists(false);
		}
		if (bullet) {
			bullet.reset(2250, 250);
			bullet.body.velocity.y = +300 + difficulty;
			bullet.body.setSize(23, 30, 0, 0);
			fx.play("shot");
			missile++;
			if (missile == 1) {
				bullet.reset(2460, 250);
				bullet.body.velocity.y = +300 + difficulty;
				bullet.body.setSize(23, 30, 0, 0);
				fx.play("shot");
			}
		}
	}
	if (missile == 2) {
		missile = 0;
	}
}
function loadItemHeart() {
	x = Math.floor(Math.random() * 6800 + 100);
	y = Math.floor(Math.random() * 2500 + 950);

	heart = hearts.getFirstExists(false);
	if (heart) {
		heart.reset(x, y);
		heart.body.setSize(30, 30, 0, 0);
	}

	game.time.events.add(Phaser.Timer.SECOND * 10, killPicture, this);
	function killPicture() {
		heart.kill();
	}
}
function loadItemCoin() {
	x = Math.floor(Math.random() * 6800 + 100);
	y = Math.floor(Math.random() * 2500 + 950);

	coin = coins.getFirstExists(false);
	if (coin) {
		coin.reset(x, y);
		coin.body.setSize(30, 30, 0, 0);
	}

	game.time.events.add(Phaser.Timer.SECOND * 7, killPicture, this);
	function killPicture() {
		coin.kill();
	}
}
