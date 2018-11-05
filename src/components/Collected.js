import React , {Component} from 'react';

class Collected extends Component {

    render() {

        let coins = this.props.coins;
        let coin_images = [];
        for (let i = 0; i < 20; i++) {
            if (i < coins) {coin_images.push(<img src="./images/coin.png" alt="coin" height="20px" width="20px"></img>)}
            else {coin_images.push(<img src="./images/coin.png" alt="coin" height="20px" width="20px" style={{ opacity: 0.3 }}></img>)}
        }
        let health = this.props.healthPacks;
        let health_images = [];
        for (let i = 0; i < 10; i++) {
            if (i < health) { health_images.push(<img src="./images/health.png" alt="health" height="30px" width="30px"></img>)}
            else { health_images.push(<img src="./images/health.png" alt="health" height="30px" width="30px" style={{ opacity: 0.5 }}></img>)}
        }
        let enemies = this.props.enemiesKilled;
        let enemy_images = [];
        for (let i = 0; i < 15; i++) {
            if (i < enemies) {enemy_images.push(<img src="./images/enemy.png" alt="enemy" height="30px" width="30px"></img>)}
            else {enemy_images.push(<img src="./images/enemy.png" alt="enemy" height="30px" width="30px" style={{ opacity: 0.3 }}></img>)}
        }
        let upgrades = this.props.upgradesFound;
        let upgrade_images = [];
        for (let i = 0; i < 3; i++) {
            if (i < upgrades) { upgrade_images.push(<img src="./images/upgrade.png" alt="upgrade" height="30px" width="30px"></img>) }
            else { upgrade_images.push(<img src="./images/upgrade.png" alt="upgrade" height="30px" width="30px" style={{ opacity: 0.3 }}></img>) }
        }

        return (
            <div id="Collected">
                <div className="coinsCollected">{coin_images.map( (image, i) => {return <span key={i}>{image}</span>})}</div>
                <div className="coinsCollected">{health_images.map( (image, i) => {return <span key={i}>{image}</span>})}</div>
                <div className="coinsCollected">{enemy_images.map( (image, i) => {return <span key={i}>{image}</span>})}</div>
                <div className="coinsCollected">{upgrade_images.map( (image, i) => {return <span key={i}>{image}</span>})}</div>
            </div>
        )
    }
}
export default Collected;