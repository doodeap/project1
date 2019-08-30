var Main = {
    preload() {
        this.load.spritesheet('character',
            'character spritesheet.png',
            { frameWidth: 30, frameHeight: 50 }
        );
        this.load.image('google_logo', 'google logo.PNG');
        this.load.image('google_search', 'google search.PNG');
        this.load.image('google_login', 'google login.PNG');
        this.load.image('ball', 'ball.jpg');
        this.load.image('tile', 'tile.jpg');
        this.load.image('coin','coin.png');
        this.load.image('white', 'white.png');
        this.load.image('button', 'button.png');
        this.load.image('door', 'door.png');
    },
    create() {

        scoreText = this.add.text(30, 20, 'coin : 1', { fontSize: '50px', fill: '#000' });

        var platforms = this.physics.add.staticGroup();
        platforms.create(625, 275, 'google_logo').setScale(0.6).refreshBody();
        platforms.create(625, 360, 'google_search').setScale(0.6).refreshBody();
        platforms.create(1150, 30, 'google_login').setScale(0.6).refreshBody();
        platforms.create(400, 500, 'tile').setScale(0.1).refreshBody();
        platforms.create(500, 520, 'tile').setScale(0.1).refreshBody();
        platforms.create(655, 480, 'tile').setScale(0.1).refreshBody();
        platforms.create(770, 450, 'tile').setScale(0.1).refreshBody();

        var dead = this.physics.add.staticGroup();
        dead.create(300, 530, 'white').setScale(0.3).refreshBody();
        dead.create(585, 540, 'white').setScale(0.2).refreshBody();
        dead.create(780, 500, 'white').setScale(0.3).refreshBody();
        dead.create(780, 500, 'white').setScale(0.3).refreshBody();
        dead.create(1000, 500, 'white').setScale(0.5).refreshBody();

        var tile = this.physics.add.staticGroup();
        tile.create(300, 450, 'tile').setScale(0.1).refreshBody();

        var tile2 = this.physics.add.staticGroup();
        tile2.create(570, 520, 'tile').setScale(0.1).refreshBody();

        var button = this.physics.add.staticGroup();
        button.create(770, 420, 'button').setScale(0.2).refreshBody();

        var button2 = this.physics.add.staticGroup();
        button2.create(950, 120, 'button').setScale(0.2).refreshBody();

        character = this.physics.add.sprite(650, 100, 'character').setScale(0.5); // 캐릭터 객체

        
        // var coin = this.physics.add.sprite(1000, 500, 'coin').setScale(1);
        // this.anims.create({
        //     key: 'spin',
        //     frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 6 }),
        //     frameRate: 10,
        //     repeat: 4,
        // });
        // coin.anims.play('spin', true);

        this.physics.add.overlap(character, tile, (character, tile) => {
            tile.disableBody(true, true);
        }, null, this);

        this.physics.add.overlap(character, dead, (character, dead) => {
            location.reload();
        });

        character.setBounce(0.2);
        character.setFriction(0.5);
        character.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('character', { start: 0, end: 8 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: this.anims.generateFrameNumbers('character', { start: 0, end: 0 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('character', { start: 9, end: 17 }),
            frameRate: 20,
            repeat: -1
        });

        this.physics.add.collider(character, platforms);

        this.physics.add.overlap(character, button2, (character, button2) => {
            if (confirm('버튼을 누르시겠습니까?')) {
                alert('이 버튼은 함정입니다.');
                button2.disableBody(true);
            }
        });

        this.physics.add.overlap(character, button, (character, button) => {
            if (confirm('버튼을 누르시겠습니까?')) {
                alert('Game Clear!');
                fadeCamera = this.cameras.add(0, 0, 100);
                window.open('about:blank','_self').self.close();
            }
        });

        this.physics.add.overlap(character,ball,(character,ball)=>{
            let cc = localStorage.getItem("coin")
            cc--;
            localStorage.setItem("coin",cc)
            score = localStorage.getItem("coin")
            scoreText.setText('coin : ' + score);
        })

        this.character = character;
        this.cursors = this.input.keyboard.createCursorKeys();
    },
    update() { // 틱마다 계속 갱신되는 곳
        if (this.cursors.left.isDown) { // 왼쪽 화살표 키를 눌렀을 시
            this.character.setVelocityX(this.character.body.velocity.x + (-200 - this.character.body.velocity.x) / 10); // 왼쪽으로 힘을 줌 (-200)
            character.anims.play("left", true);
        }
        else if (this.cursors.right.isDown) { // 오른쪽 화살표 키를 눌렀을 시
            this.character.setVelocityX(this.character.body.velocity.x + (200 - this.character.body.velocity.x) / 10); // 오른쪽으로 힘을 줌 (200)
            character.anims.play("right", true);
        }
        else { // 아무 키도 누르지 않았을 시
            this.character.setVelocityX(this.character.body.velocity.x - this.character.body.velocity.x / 20); // 강제 제동 (0)
            character.anims.play("turn", true);
        }
        if (this.cursors.up.isDown && this.character.body.touching.down) { // 위쪽 화살표 키를 눌렀으며 지면과 충돌하고 있을 시
            this.character.setVelocityY(-500); // 위쪽으로 힘을 줌
        }
        if(score == 0){
            alert('죽으셨습니다.');
        }
    }

}

localStorage.setItem("coin", 1);

var score = localStorage.getItem("coin");
var scoreText;
var ball;

var config = {
    type: Phaser.AUTO,
    width: 1250,
    height: 550,
    backgroundColor: '#fff',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: [Main],
};

let game = new Phaser.Game(config);
alert("STAGE3");