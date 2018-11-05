import React, { Component } from 'react';
import Header from './Header.js';
import Info from './Info.js';
import Game from './Game.js';
import Collected from './Collected.js';

class App extends Component {

    constructor() {
        super();

        this.state = {
            XP: 0,
            health: 100,
            coins: 0,
            enemiesKilled: 0,
            damage: 25,
            healthPacks: 0,
            upgrades: 0,
            bossKilled: false
        };
    }

    updateXP = (XP) => {
        this.setState({XP: XP});
    };

    updateHealth = (health) => {
        this.setState({health: health});
    };

    updateCoins = (coins) => {
        this.setState({coins: coins});
    };

    updateEnemiesKilled = (enemiesKilled) => {
        this.setState({enemiesKilled: enemiesKilled});
    };

    updateDamage = (damage) => {
        this.setState({damage: damage})
    };

    updateHealthPacks = (healthPacks) => {
        this.setState({healthPacks: healthPacks});
    }

    updateUpgrades = (upgrades) => {
        this.setState({upgrades: upgrades});
    }

    updateBossKilled = (bossKilled) => {
        this.setState({ bossKilled: bossKilled});
    }

    render() {
        return (
            <div>
                <Header />
                <Info 
                    XP={this.state.XP}
                    health={this.state.health}
                    coins={this.state.coins}
                    enemiesKilled={this.state.enemiesKilled}
                    damage={this.state.damage}
                    bossKilled={this.state.bossKilled}
                    />
                    <Game 
                    XP={this.updateXP}
                    health={this.updateHealth} 
                    coins={this.updateCoins}
                    enemiesKilled={this.updateEnemiesKilled}
                    damage={this.updateDamage}
                    healthPacks={this.updateHealthPacks}
                    upgrades={this.updateUpgrades}
                    bossKilled={this.updateBossKilled}
                        />
                    <Collected 
                    coins={this.state.coins}
                    healthPacks={this.state.healthPacks}
                    enemiesKilled={this.state.enemiesKilled}
                    upgradesFound={this.state.upgrades}
                    />
            </div>
        )
    }
}

export default App;