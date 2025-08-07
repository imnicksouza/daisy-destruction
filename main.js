const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#66ccff',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

let player, cursors, platforms, destructibles, scoreText;
let score = 0;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.image('block', 'https://labs.phaser.io/assets/sprites/red_ball.png');
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
}

function create() {
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 590, 'ground').setScale(2).refreshBody();

    for (let i = 0; i < 3; i++) {
        platforms.create(200 + i * 200, 400, 'ground');
    }

    destructibles = this.physics.add.group({
        key: 'block',
        repeat: 5,
        setXY: { x: 100, y: 0, stepX: 120 }
    });

    destructibles.children.iterate(block => {
        block.setBounce(1);
        block.setCollideWorldBounds(true);
    });

    player = this.physics.add.sprite(100, 450, 'player').setScale(1.5);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(destructibles, platforms);

    this.physics.add.overlap(player, destructibles, destroyBlock, null, this);

    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#fff'
    });
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-400);
    }
}

function destroyBlock(player, block) {
    block.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
}
