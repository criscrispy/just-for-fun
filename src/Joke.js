import React, { Component } from 'react';
import './Joke.css';

class Joke extends Component {

    getColor() {
        if (this.props.netScore >= 15) {
            return "#4CAF50";
        } else if (this.props.netScore >= 12) {
            return "#8BC34A";
        } else if (this.props.netScore >= 9) {
            return "#CDDC39";
        } else if (this.props.netScore >= 6) {
            return "#FFEB3B";
        } else if (this.props.netScore >= 3) {
            return "#FFC107";
        } else if (this.props.netScore >= 0) {
            return "#FF9800";
        } else {
            return "#f44336";
        }
    }
    getEmoji() {
        if (this.props.netScore >= 15) {
            return "em em-rolling_on_the_floor_laughing";
        } else if (this.props.netScore >= 12) {
            return "em em-laughing";
        } else if (this.props.netScore >= 9) {
            return "em em-smiley";
        } else if (this.props.netScore >= 6) {
            return "em em-slightly_smiling_face";
        } else if (this.props.netScore >= 3) {
            return "em em-neutral_face";
        } else if (this.props.netScore >= 0) {
            return "em em-confused";
        } else {
            return "em em-angry";
        }
    }

    // handle decrease of netscore
    handleNetScoreDecrease = (evt) => {
        evt.preventDefault();
        this.props.netScoreVote(this.props.id, -1)
    };

    // handle decrease of netscore
    handleNetScoreIncrease = (evt) => {
        evt.preventDefault();
        // console.log(this.props.id, this.state.netScore)
        this.props.netScoreVote(this.props.id, +1)
    };


    // Render a single joke - Joke text, buttons for up and down voting, netScore, smiley rating
    render() {

        return (
            <div className='Joke'>
                <div className='Joke-buttons'>
                    <i className='fas fa-arrow-up' onClick={this.handleNetScoreIncrease} />
                    <span className='Joke-netScore' style={{ borderColor: this.getColor() }}>
                        {this.props.netScore}
                    </span>
                    <i className='fas fa-arrow-down' onClick={this.handleNetScoreDecrease} />
                </div>
                <div className='Joke-text'>{this.props.joke}</div>
                {/* <div className='Joke-smiley'>
                      <i className={this.getEmoji()} />
                    </div> */}
                <div className='Joke-smiley'>
                    <i className={this.getEmoji()} aria-label="ROLLING ON THE FLOOR LAUGHING"></i>
                </div>
            </div>
        )

    }
}

export default Joke;

