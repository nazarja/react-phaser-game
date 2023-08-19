import React, {Component} from 'react';

class Info extends Component {

    render() {

        var healthP = this.props.health < 26;
        if (healthP) {healthP = <p className="p" style={{ "color": "red" }}>Health:  {this.props.health}</p>;} 
        else {healthP = <p className="p" style={{ "color": "white" }}>Health:  {this.props.health}</p>;}
        var XPP = this.props.XP > 99;
        if (XPP) { XPP = <p className="p" style={{ "color": "yellow" }}>XP:  {this.props.XP}</p>;} 
        else { XPP = <p className="p" style={{ "color": "white" }}>XP:  {this.props.XP}</p>;}
        var bossKilled = this.props.bossKilled === true;
        if (bossKilled) {bossKilled = <p className="info" style={{color: "yellow"}}>You  Win! Game Over!</p>}
        else { bossKilled = <p className="info">Reach 100XP to Battle the Boss &nbsp; |  &nbsp; Coins = 5XP &nbsp; - &nbsp; Enemies = 10XP &nbsp; |&nbsp;  Weapon Upgrade = Damage +25%</p> }
        return(
            <div id="Info">
                {XPP}
                {healthP}
                <p className="p">Coins:  {this.props.coins}</p>
                <p className="p">Damage:  {this.props.damage}%</p>
                <p className="p">Enemies Killed:  {this.props.enemiesKilled}</p>
                <br/>
                {bossKilled}
            </div>
        );
    }
}

export default Info;