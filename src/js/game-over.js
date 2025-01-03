var gameOVER = {
	preload: function () {
		game.load.image("bg", "resources/images/bg.jpg");
		game.load.image("play", "resources/images/button.png");
	},

	create: function () {
		game.add.tileSprite(0, 0, 800, 450, "bg");

		var button = this.add.button(
			game.width / 2,
			game.height / 2 + 110,
			"play",
			this.startGame,
			this,
		);
		button.anchor.setTo(0.5);
		button.scale.setTo(0.5, 0.4);

		var txtStart = game.add.text(
			game.width / 2 - 20,
			game.height / 2 - 25,
			"Score: ",
			{ font: "bold 40px LilyUPC", fill: "#40c643", align: "center" },
		);
		txtStart.anchor.setTo(0.5);
		txtStart.setShadow(3, 3, "rgba(0,0,0,0.5)", 2);

		var txtStartScore = game.add.text(
			game.width / 2 + 75,
			game.height / 2 - 25,
			upScore.toString(),
			{ font: "bold 40px LilyUPC", fill: "#40c643", align: "center" },
		);
		txtStartScore.anchor.setTo(0.5);
		txtStartScore.setShadow(3, 3, "rgba(0,0,0,0.5)", 2);

		var txtTitle = game.add.text(
			game.width / 2,
			game.height / 2 - 120,
			"GAME OVER",
			{ font: "bold 100px LilyUPC", fill: "#40c643", align: "center" },
		);
		txtTitle.anchor.setTo(0.5);
		txtTitle.setShadow(3, 3, "rgba(0,0,0,0.5)", 2);

		upScore = 0;
		upLive = 3;
		upLevel = 1;
		counter = 60;
		difficulty = 0;
	},

	startGame: function () {
		this.state.start("gameState");
	},
};
