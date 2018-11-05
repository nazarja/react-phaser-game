import React, { Component } from 'react';
import Phaser from 'phaser';

class Game extends Component {

    constructor(props) {
        super(props);

        let levelData = {
            "hero": "",
            "boss": "",
            "walls": [],
            "ground": [],
            "enemies": [],
            "health": [],
            "upgrades": [],
            "coins": []
        }

        /*****************************
          Create  Map Functions
        *****************************/

        function createMapArray(num, dimensions) {
            let array = [];
            for (let i = 0; i < dimensions; i++) {
                array.push([]);
                let x = 0;
                let y = 0;
                y = i * 100;
                for (let j = 0; j < dimensions; j++) {
                    array[i].push({ "x": x, "y": y });
                    x += 100;
                }
            }
            return array;
        }

        function createMap() {
            let dimensions = 30;
            let maxTunnels = 70;
            let maxLength = 15;
            let map = createMapArray(1, dimensions);
            let currentRow = Math.floor(Math.random() * dimensions);
            let currentColumn = Math.floor(Math.random() * dimensions);
            let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            let lastDirection = [];
            let randomDirection;

            while (maxTunnels && dimensions && maxLength) {
                do {
                    randomDirection = directions[Math.floor(Math.random() * directions.length)];
                }
                while ((randomDirection[0] === -lastDirection[0] && randomDirection[1] === -lastDirection[1]) || (randomDirection[0] === lastDirection[0] && randomDirection[1] === lastDirection[1]));
                let randomLength = Math.ceil(Math.random() * maxLength);
                let tunnelLength = 0;
                while (tunnelLength < randomLength) {
                    if (((currentRow === 0) && (randomDirection[0] === -1)) ||
                        ((currentColumn === 0) && (randomDirection[1] === -1)) ||
                        ((currentRow === dimensions - 1) && (randomDirection[0] === 1)) ||
                        ((currentColumn === dimensions - 1) && (randomDirection[1] === 1))) {
                        break;
                    }
                    else {
                        map[currentRow][currentColumn] = 0;
                        currentRow += randomDirection[0];
                        currentColumn += randomDirection[1];
                        tunnelLength++;
                    }
                }
                if (tunnelLength) {
                    lastDirection = randomDirection;
                    maxTunnels--;
                }
            }
            return map;
        };

        // Wall Positions
        function createMapWallsArray(mapArray) {
            levelData.walls = mapArray.reduce((prev, curr) => {
                return prev.concat(curr);
            }).filter(curr => curr !== 0);

            let groundTiles = mapArray.reduce((prev, curr) => {
                return prev.concat(curr);
            })
            for (let i = 0; i < groundTiles.length; i++) {
                if (groundTiles[i] !== 0) {
                    if (groundTiles[i + 1] === 0) {
                        levelData.ground.push(groundTiles[i])
                    }
                }
            }
        }

        /*****************************
          Create Spawns
        *****************************/

        function createHeroSpawnPosition() {
            const len = levelData.ground.length;
            const num = Math.floor(Math.random() * len);
            const x = levelData.ground[num].x;
            const y = levelData.ground[num].y;
            levelData.hero = { "x": x + 150, "y": y + 50 };
            levelData.ground.splice(num, 1);
        }

        function createBossSpawnPosition() {
            const len = levelData.ground.length;
            const num = Math.floor(Math.random() * len);
            const x = levelData.ground[num].x;
            const y = levelData.ground[num].y;
            levelData.boss = { "x": x + 150, "y": y + 50 };
            levelData.ground.splice(num, 1);
        }

        function createSpawnPositions(amount, spawn) {
            switch (spawn) {
                case "enemies":
                    spawn = levelData.enemies;
                    break;
                case "health":
                    spawn = levelData.health;
                    break;
                case "upgrades":
                    spawn = levelData.upgrades;
                    break;
                case "coins":
                    spawn = levelData.coins;
                    break;
                default:
                    break;
            }
            let count = 0;
            while (count < amount) {
                let len = levelData.ground.length;
                let num = Math.floor(Math.random() * len);
                let x = levelData.ground[num].x;
                let y = levelData.ground[num].y;
                if (spawn === levelData.upgrades) {
                    spawn.push({ "x": x + 150, "y": y + 50, "image": `upgrade${count}` });
                }
                else {
                    spawn.push({ "x": x + 150, "y": y + 50 });
                }
                levelData.ground.splice(num, 1);
                count++;
            }
        }

        function createLevelMap() {
            const mapArray = createMap();
            createMapWallsArray(mapArray);
            createHeroSpawnPosition();
            createBossSpawnPosition();
            createSpawnPositions(15, "enemies");
            createSpawnPositions(10, "health");
            createSpawnPositions(20, "coins");
            createSpawnPositions(3, "upgrades");
        }
        createLevelMap()

        /*****************************
          Start of Phaser
        *****************************/

        this.game = new Phaser.Game(720, 480, Phaser.Auto, 'game');
        let game = this.game;

        function loadGame() {
            game.state.add('play', PlayState);
            game.state.start('play');
        }

        let PlayState = {};

        PlayState.preload = function () {
            this.game.load.image('background', 'images/background.jpg');
            this.game.load.image('wall', 'images/wall.png')
            this.game.load.spritesheet('hero', 'images/hero.png', 66, 79);
            this.game.load.spritesheet('boss', 'images/boss.png', 95, 48);
            this.game.load.spritesheet('enemy1', 'images/enemy1.png', 66, 80);
            this.game.load.spritesheet('enemy2', 'images/enemy2.png', 76, 83);
            this.game.load.spritesheet('enemy3', 'images/enemy3.png', 76, 88);
            this.game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);
            this.game.load.image('health', 'images/health.png');
            this.game.load.image('upgrade0', 'images/upgrade0.png');
            this.game.load.image('upgrade1', 'images/upgrade1.png');
            this.game.load.image('upgrade2', 'images/upgrade2.png');
            this.game.load.audio('main_theme', 'audio/dungeon_adventure.mp3');
            this.game.load.audio('door', 'audio/door.wav');
            this.game.load.audio('fire', 'audio/fire.wav');
            this.game.load.audio('health', 'audio/health.wav');
            this.game.load.audio('hit', 'audio/hit.wav');
            this.game.load.audio('upgrade', 'audio/upgrade.wav');
            this.game.load.audio('coin', 'audio/coin.wav');
        }

        PlayState.init = function () {
            this.keys = this.game.input.keyboard.addKeys({
                left: Phaser.KeyCode.LEFT,
                right: Phaser.KeyCode.RIGHT,
                up: Phaser.KeyCode.UP,
                down: Phaser.KeyCode.DOWN
            });
            this.XP = 0;
            this.heroHealth = 100;
            this.coinCount = 0;
            this.enemiesKilled = 0;
            this.damage = 25;
            this.upgradesFound = 0;
            this.healthPacks = 0;
        }

        PlayState.create = function () {
            this.game.world.setBounds(0, 0, 3000, 3000);
            this.background = this.game.add.tileSprite(0, 0, 3000, 3000, 'background');
            this.background.tileScale.x = 0.5;
            this.background.tileScale.y = 0.5;
            this.loadLevel(levelData);
            this.game.camera.follow(this.hero);
            this.sfx = {
                main: this.game.add.audio('main_theme'),
                door: this.game.add.audio('door'),
                fire: this.game.add.audio('fire'),
                health: this.game.add.audio('health'),
                hit: this.game.add.audio('hit'),
                upgrade: this.game.add.audio('upgrade'),
                coin: this.game.add.audio('coin')
            }
            this.sfx.main.play().loop();
        }

        PlayState.loadLevel = function (data) {
            this.walls = this.game.add.group()
            this.enemies = this.game.add.group();
            this.health = this.game.add.group();
            this.upgrades = this.game.add.group();
            this.coins = this.game.add.group();
            data.walls.forEach(this.spawnWalls, this);
            data.health.forEach(this.spawnHealth, this);
            data.upgrades.forEach(this.spawnUpgrades, this);
            data.coins.forEach(this.spawnCoins, this);
            this.spawnBoss({ boss: data.boss });
            this.spawnCharacters({ hero: data.hero, enemies: data.enemies });
        }

        /*****************************
          Create Sprite Prototypes
        *****************************/

        function Hero(game, x, y) {
            Phaser.Sprite.call(this, game, x, y, 'hero');
            this.game.physics.enable(this);
            this.anchor.set(0.5, 0.5);
            this.body.collideWorldBounds = true;
            this.animations.add('stop', [0, 1, 2, 4, 5, 4, 3, 2, 1], 8, true);
            this.animations.add('run', [6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 12, true);
           
        }
        Hero.prototype = Object.create(Phaser.Sprite.prototype);
        Hero.prototype.constructor = Hero;
        Hero.prototype.move = function (x, y) {
            let speed = 400;
            this.body.velocity.x = x * speed;
            this.body.velocity.y = y * speed;
            if (this.body.velocity.x < 0) {this.scale.x = -1;}
            else if (this.body.velocity.x > 0) {this.scale.x = 1;}
        }
        Hero.prototype.update = function () {
            let animationName = this.getAnimationName();
            if (this.animations.name !== animationName) {this.animations.play(animationName);}
        }
        Hero.prototype.getAnimationName = function () {
            let name;
            if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {name = 'run';}
            else {name = 'stop';}
            return name;
        }
        Hero.prototype.die = function () {
            props.XP(0);
            props.health(100);
            props.coins(0);
            props.enemiesKilled(0);
            props.damage(25);
            props.upgrades(0);
            this.game.state.restart();
        }
        
        function Enemy(game, x, y) {
            let enemy = Math.floor(Math.random() * 3) + 1;
            enemy = `enemy${enemy}`;
            Phaser.Sprite.call(this, game, x, y, enemy);
            this.game.physics.enable(this);
            this.anchor.set(0.5, 0.5);
            this.body.collideWorldBounds = true;
            this.body.immovable = true;
            this.body.velocity.x = 50;
            this.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 8, true);
            this.animations.play("run");
            this.health = 100;
        }
        Enemy.prototype = Object.create(Phaser.Sprite.prototype);
        Enemy.prototype.constructor = Enemy;
        Enemy.prototype.update = function () {
            let speed = 50;
            if (this.body.touching.right || this.body.blocked.right) { this.body.velocity.x = -speed; }
            else if (this.body.touching.left || this.body.blocked.left) { this.body.velocity.x = speed; }
            else if (this.body.touching.up || this.body.blocked.up) { this.body.velocity.y = 0; }
            else if (this.body.touching.down || this.body.blocked.down) { this.body.velocity.y = 0; }

            if (this.body.velocity.x < 0) {this.scale.x = -1;}
            else if (this.body.velocity.x > 0) {this.scale.x = 1;}
        }
        Enemy.prototype.die = function () {
            this.body.enable = false;
            this.kill();
        }

        function Boss(game, x ,y) {
            Phaser.Sprite.call(this, game, x, y, 'boss');
            this.game.physics.enable(this);
            this.anchor.set(0.5, 0.5);
            this.body.collideWorldBounds = true;
            this.body.immovable = true;
            this.animations.add('spin', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 8, true);
            this.animations.play("spin");
            this.health = 100;
        }
        Boss.prototype = Object.create(Phaser.Sprite.prototype);
        Boss.prototype.constructor = Boss;

        /*****************************
          Spawn Charcaters / Spawn Sprites
        *****************************/
        PlayState.spawnBoss = function (data) {
            this.boss = new Boss(this.game, data.boss.x, data.boss.y);
            this.game.add.existing(this.boss);
            console.log(data.boss.x, data.boss.y);
        }

        PlayState.spawnCharacters = function (data) {
            this.hero = new Hero(this.game, data.hero.x, data.hero.y);
            this.game.add.existing(this.hero);

            data.enemies.forEach(function (data) {
                let sprite = new Enemy(this.game, data.x, data.y);
                this.enemies.add(sprite);
            }, this);
        }

        PlayState.spawnWalls = function (data) {
            let sprite = this.walls.create(data.x, data.y, 'wall');
            this.game.physics.enable(sprite);
            sprite.body.immovable = true;
        }

        PlayState.spawnHealth = function (data) {
            let sprite = this.health.create(data.x, data.y, 'health');
            this.game.physics.enable(sprite);
            sprite.anchor.set(0.5, 0.5);
            sprite.body.immovable = true;
        }

        PlayState.spawnUpgrades = function (data) {
            let sprite = this.upgrades.create(data.x, data.y, data.image);
            this.game.physics.enable(sprite);
            sprite.anchor.set(0.5, 0.5);
            sprite.body.immovable = true;
        }

        PlayState.spawnCoins = function (data) {
            let sprite = this.coins.create(data.x, data.y, 'coin');
            this.game.physics.enable(sprite);
            sprite.anchor.set(0.5, 0.5);
            sprite.animations.add('rotate', [0, 1, 2, 1], 6, true);
            sprite.animations.play('rotate');
        }

        /*****************************
          Handle Changes
        ****************************/

        PlayState.handleInput = function () {

            if (this.keys.left.isDown && this.keys.up.isDown) { this.hero.move(-1, -1); }
            else if (this.keys.left.isDown && this.keys.down.isDown) { this.hero.move(-1, +1); }
            else if (this.keys.right.isDown && this.keys.up.isDown) { this.hero.move(+1, -1); }
            else if (this.keys.right.isDown && this.keys.down.isDown) { this.hero.move(+1, +1); }
            else if (this.keys.left.isDown) { this.hero.move(-1, 0); }
            else if (this.keys.right.isDown) { this.hero.move(+1, 0); }
            else if (this.keys.up.isDown) { this.hero.move(0, -1); }
            else if (this.keys.down.isDown) { this.hero.move(0, +1); }
            else { this.hero.move(0, 0); }
        }

        PlayState.handleCollisions = function () {
            this.game.physics.arcade.collide(this.hero, this.walls);
            this.game.physics.arcade.collide(this.hero, this.enemies, this.onHeroVsEnemy, null, this);
            this.game.physics.arcade.overlap(this.hero, this.health, this.onHeroVsHealth, null, this);
            this.game.physics.arcade.collide(this.hero, this.upgrades, this.onHeroVsUpgrades, null, this);
            this.game.physics.arcade.collide(this.hero, this.coins, this.onHeroVsCoins, null, this);
            this.game.physics.arcade.collide(this.enemies, this.walls);
            this.game.physics.arcade.collide(this.enemies, this.enemies);
            this.game.physics.arcade.collide(this.boss, this.walls);
            this.game.physics.arcade.collide(this.boss, this.enemies);
            this.game.physics.arcade.collide(this.hero, this.boss, this.onHeroVsBoss,
                function (hero, boss) {
                    return this.XP > 99;
                }, this); 
        }

        PlayState.onHeroVsBoss = function (hero, boss) {
            boss.health -= 5;
            this.heroHealth -= 5;
            if (hero.body.touching.left) { this.game.add.tween(hero).to({ x: hero.x + 40 }, 200, Phaser.Easing.Back.Out).start(); }
            else if (hero.body.touching.right) { this.game.add.tween(hero).to({ x: hero.x - 40 }, 200, Phaser.Easing.Back.Out).start(); }
            else if (hero.body.touching.up) { this.game.add.tween(hero).to({ y: hero.y + 40 }, 200, Phaser.Easing.Back.Out).start(); }
            else if (hero.body.touching.down) { this.game.add.tween(hero).to({ y: hero.y - 40 }, 200, Phaser.Easing.Back.Out).start(); }
            this.sfx.hit.play();
            if (boss.health < 1) {
                boss.kill();
                boss.body.enable = false;
                this.XP += 50;
                props.XP(this.XP + 100);
                props.health(100);
                props.coins(this.coinCount + 10);
                props.enemiesKilled(this.enemiesKilled++);
                props.damage(100);
                props.bossKilled(true);
            }
            if (this.heroHealth < 1) {
                this.hero.die()
                return false;
            }
            props.health(this.heroHealth);
            props.XP(this.XP);
        }

        PlayState.onHeroVsEnemy = function (hero, enemy) {
            if (hero.body.touching.left) { this.game.add.tween(hero).to({ x: hero.x + 40 }, 200, Phaser.Easing.Back.Out).start(); }
            else if (hero.body.touching.right) { this.game.add.tween(hero).to({ x: hero.x - 40 }, 200, Phaser.Easing.Back.Out).start(); }
            else if (hero.body.touching.up) { this.game.add.tween(hero).to({ y: hero.y + 40 }, 200, Phaser.Easing.Back.Out).start(); }
            else if (hero.body.touching.down) { this.game.add.tween(hero).to({ y: hero.y - 40 }, 200, Phaser.Easing.Back.Out).start(); }
            this.sfx.hit.play();
            this.heroHealth -= 10;
            if (this.damage === 25) {enemy.health -= 25}
            else if (this.damage === 50) {enemy.health -= 35}
            else if (this.damage=== 75) { enemy.health -= 50}
            else { enemy.health -= 100};
            if (enemy.health < 1) {
                this.XP += 10;
                this.enemiesKilled++;
                props.enemiesKilled(this.enemiesKilled);
                enemy.die();
            }
            if (this.heroHealth < 1) {
                this.hero.die()
                return false;
            }
            props.health(this.heroHealth);
            props.XP(this.XP);
        }

        PlayState.onHeroVsHealth = function (hero, health) {
            if (this.heroHealth === 100) {return false;}
            else if (this.heroHealth > 75) { this.heroHealth = 100}
            else (this.heroHealth += 25 )
            this.sfx.health.play();
            this.healthPacks++;
            health.kill();
            props.health(this.heroHealth)
            props.healthPacks(this.healthPacks);
        }

        PlayState.onHeroVsUpgrades = function (hero, upgrade) {
            this.upgradesFound++;
            this.damage += 25;
            this.sfx.upgrade.play();
            upgrade.kill();
            props.damage(this.damage);
            props.upgrades(this.upgradesFound);
        }

        PlayState.onHeroVsCoins = function (hero, coin) {
            this.XP += 5;
            this.coinCount++;
            this.sfx.coin.play();
            coin.kill();
            props.XP(this.XP);
            props.coins(this.coinCount);
        }

        PlayState.update = function () {
            this.handleInput();
            this.handleCollisions();
        }

        loadGame();
    }

    render() {
        return (
            <div id="Game">
            </div>
        )
    }
}

export default Game;

