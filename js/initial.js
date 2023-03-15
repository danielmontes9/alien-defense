var game = new Phaser.Game(800,450, Phaser.CANVAS, 'game');

game.state.add('Main', Main);
game.state.add('gameState', gameState);
game.state.add('gameOVER', gameOVER);

game.state.start('Main');