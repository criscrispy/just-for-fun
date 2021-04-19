import React, { Component } from 'react';
import Joke from './Joke';
import './JokesBoard.css';
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

// import uuid from "uuid/v4";

// const proxyUrl = "https://ancient-crag-49665.herokuapp.com/" // To handle Cors errors
class JokesBoard extends Component {
    static defaultProps = {
        numJokesToFetch: 10,
    }

    constructor(props) {
        super(props);
        this.state = {
            randomJokes: JSON.parse(window.localStorage.getItem('jokes') || '[]'),
            loading: false,
            sorted: false,
        }

        /* Array to store all jokes in a set to later compare
         with newly-fetched jokes and remove duplicates - refresh page to see the accurate number of jokes in 
         the seenJokes set*/
        this.seenJokes = new Set(this.state.randomJokes.map(jokeObject => jokeObject.joke))

        console.log(this.seenJokes);

    }

    componentDidMount() {
        console.log('in Component did render');
        if (this.state.randomJokes.length === 0) {
            this.setState({ loading: true }, this.getNewJokes)

        }

    }

    getNewJokes = async () => {
        try {
            console.log('get newJokes was called');
            const randomJokesURL = `https://icanhazdadjoke.com/`;
            const options = {
                'User-Agent': 'My Library (https://github.com/criscrispy/)', // add repo later
                'method': "GET",
                'headers': { 'Accept': 'application/json' },
                // 'crossorigin': ""
            }

            let newRandomJokes = [];
            while (newRandomJokes.length < this.props.numJokesToFetch) {
                // const newRandomJokesObj = await axios.get(proxyUrl + randomJokesURL, options);
                const newRandomJokesObj = await axios.get(randomJokesURL, options);
                const newRandomJokesResults = newRandomJokesObj.data;

                if (!this.seenJokes.has(newRandomJokesResults.joke)) {
                    newRandomJokes.push({ ...newRandomJokesResults, netScore: 0, key: uuidv4() })
                }
                else {
                    console.log('Found a duplicate', newRandomJokesResults.joke)
                }

            }

            this.setState(st =>
            ({
                loading: false,
                randomJokes: [...st.randomJokes, ...newRandomJokes,]
            }),
                () => window.localStorage.setItem('jokes', JSON.stringify(this.state.randomJokes))
            );

        } catch (error) {
            // NEEDS IMPROVEMENT
            /* In case there is a timeout, etc, 
            when u fetch new jokes we will just 
            alert the error and loading animation will be triggered, 
            the jokes that are already there will be shown.*/
            alert(error)
            this.setState({ loading: false })
        }



    }

    // Button for obtaining new jokes
    handleClickForNewJokes = () => {
        this.setState({ loading: true }, this.getNewJokes)
    }

    // sorting jokes from higest to lowest rating
    sortJokes = (arr) => {
        console.log(arr)
        const sortedJokes = arr.sort((a, b) => b.netScore - a.netScore);
        this.setState({ randomJokes: sortedJokes });
    }

    handleClickforSorting = (evt) => {
        evt.preventDefault();
        this.setState({ sorted: true }, this.sortJokes(this.state.randomJokes))

    }



    netScoreVote = (id, delta) => {
        // const updateRandomJokes = this.state.randomJokes.map(randomJoke => {
        //     if (randomJoke.id === id) {
        //         return { ...randomJoke, netScore: randomJoke.netScore + delta }
        //     }
        //     else { return randomJoke }
        // })
        // this.setState({
        //     randomJokes: updateRandomJokes,
        // });

        this.setState(
            st => ({
                randomJokes: st.randomJokes.map(j =>
                    j.id === id ? { ...j, netScore: j.netScore + delta } : j
                )
            }),
            () =>
                window.localStorage.setItem("jokes", JSON.stringify(this.state.randomJokes))
        );


    }

    render() {
        console.log('in render')
        const jokes = this.state.randomJokes.map((jokeObject) => {
            return <Joke
                id={jokeObject.id}
                key={jokeObject.key}
                joke={jokeObject.joke}
                netScore={jokeObject.netScore}
                netScoreVote={this.netScoreVote}
            // decreaseNetScore={this.decreaseNetScore}
            />
        })

        return (
            <div className='JokesBoard'>
                <div className='JokesBoard-sidebar'>
                    <h1 className='JokesBoard-title'>
                        <span>Fun</span> Jokes
                    </h1>
                    <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' alt='side-bar-laugh-icon' />
                    <button className='JokesBoard-getmore' onClick={this.handleClickForNewJokes}>
                        Fetch Jokes
                    </button>
                    <div>
                        <button className='JokesBoard-sort' onClick={this.handleClickforSorting}>Sort jokes <i className='fas fa-sort-amount-down' /> </button>
                    </div>
                </div>
                <div className='JokesBoard-main-content' >
                    {this.state.loading ?
                        <div className='JokesBoard-spinner'>
                            <i className='far fa-8x fa-laugh fa-spin' />
                        </div>
                        :
                        <div className='JokesBoard-jokes'>
                            {jokes}
                        </div>
                    }
                </div>

            </div>
        )


    }
}

export default JokesBoard;


