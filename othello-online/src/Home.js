import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import GameBoard from './GameBoard.js'
import rebase, { auth } from "./rebase.js"
import { Route, Switch, Redirect } from "react-router-dom";
import { isObjectEmpty, buildUserFromGoogle } from "./apphelpers.js"
import Login from "./Login.js"
import ReactLoading from "react-loading";
import OthelloPicture from "./Othello-Picture.png"

class Home extends Component {
    //BLACK PLAYER IS FIRST PLAYER
    //WHITE PLAYER IS SECOND PLAYER
    constructor(props) {
      super(props);
      this.state = {
          searchingForGame: false,
          currentGame: "",
          numRegisteredUsers: 0

      }
      this.pushGameFields = this.pushGameFields.bind(this)
    }

    
    componentWillMount() {
        //fetch user data like current Game
        console.log("HELLO")
        // rebase.post(`test/`, {
        //     data: {name: 'Tyler McGinnis', age: 25},
        //     then(err){
        //     }
        //   });

        // window.onbeforeunload = function(e) {
    
        // };
        rebase.fetch(`users/`, {
            context: this,
            asArray: true
          }).then(data => {
            this.setState({numRegisteredUsers: data.length});
          })

      
    }

    
    loadingSymbolToggle = () => {

        if (this.state.searchingForGame){
            console.log("true11111")
            return 20
        }
        else {
            console.log("false111111")
            return 0
        }


    }

     sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
      }

    testfunction = () => {
        this.props.goToUrl(`/gameScreen`)
    }

    addUsertoQueue = () => {
        rebase.push(`queue`, {
            data: {username: this.props.username, uid: this.props.playerID, numWins: this.props.numWins, numLosses: this.props.numLosses, numTies: this.props.numTies},
          })
            
    }

    pushGameFields = (first, second, firstName, secondName, secondWins, secondLosses, secondTies, firstWins, firstLosses, firstTies) => {
        //black player is first, 
        //inputs are keys
        var key = rebase.push(`games`, {
            data: {numWinsWhite: firstWins, numLossesWhite: firstLosses, numTiesWhite: firstTies, numWinsBlack: secondWins, numLossesBlack: secondLosses, numTiesBlack: secondTies, blackPlayerName: firstName, whitePlayerName: secondName, piecesRemaining: 60, winnerID: "", blackPlayerID: first, updateOpponent: false, board: {0: {0: "green",1: "green",2: "green",3: "green",4: "green",5: "green",6: "green",7: "green",},
            1: {0: "green",1: "green",2: "green",3: "green",4: "green",5: "green",6: "green",7: "green",},
            2: {0: "green",1: "green",2: "green",3: "green",4: "green",5: "green",6: "green",7: "green",},
            3: {0: "green",1: "green",2: "green",3: "white",4: "black",5: "green",6: "green",7: "green",},
            4: {0: "green",1: "green",2: "green",3: "black",4: "white",5: "green",6: "green",7: "green",},
            5: {0: "green",1: "green",2: "green",3: "green",4: "green",5: "green",6: "green",7: "green",},
            6: {0: "green",1: "green",2: "green",3: "green",4: "green",5: "green",6: "green",7: "green",},
            7: {0: "green",1: "green",2: "green",3: "green",4: "green",5: "green",6: "green",7: "green",}} ,colorsTurn: "black", whitePlayerID: second}    

        }).then(newLocation => {
            //route to the game
            console.log(newLocation.path.pieces_[1])
            var gameID = newLocation.path.pieces_[1]
            console.log(gameID)
            this.setState({currentGame: gameID});

            //push second to gameID
            rebase.update(`users/${second}`, {
                data: {currentGame: gameID}
              }).then(() => {
                rebase.update(`users/${first}`, {
                    data: {currentGame: gameID}
                  }).then(() => {
                    this.props.goToUrl(`/gameScreen`)
                  })
                
              })

            //this.props.goToUrl(`/gameScreen`)
            // return <GameBoard playerID="abcd" gameID="testingID"/>
        })
          ;

          // testFunc = () => { //add dummy data for testing
    //     rebase.post(`games/testingID/board`, {
    //         data: {
    //             0: {0: "white",1: "white",2: "white",3: "white",4: "white",5: "white",6: "white",7: "black",},
    //             1: {0: "white",1: "black",2: "white",3: "black",4: "black",5: "white",6: "white",7: "black",},
    //             2: {0: "black",1: "white",2: "white",3: "white",4: "white",5: "white",6: "white",7: "black",},
    //             3: {0: "white",1: "white",2: "black",3: "white",4: "white",5: "white",6: "white",7: "black",},
    //             4: {0: "white",1: "black",2: "black",3: "black",4: "white",5: "black",6: "white",7: "black",},
    //             5: {0: "white",1: "black",2: "black",3: "black",4: "white",5: "white",6: "white",7: "white",},
    //             6: {0: "white",1: "white",2: "white",3: "black",4: "white",5: "white",6: "white",7: "white",},
    //             7: {0: "white",1: "black",2: "white",3: "white",4: "white",5: "white",6: "white",7: "white",},
    //         }
    //     })
    // }

    }

    searchForGame = () => {
        //set searchingForGame to true to popup the loading symbol
        this.sleep(Math.floor(Math.random *5)).then(() => {
        
        
            this.setState({searchingForGame: true});
            console.log("SEARCH FOR GAME TRIGGERED")
        //load the user into a queue in the database
        //check if others in queue, if so load the game
        
        rebase.fetch(`queue`, {
            context: this,
            asArray: true,
            then(data){
              console.log(data);
              console.log(data.length)
                if (data.length >= 1){
                    this.removeUserFromQueue(data[0].uid)
                    this.setState({searchingForGame: false});
                    //current user is second player, so start the game
                    console.log(data[0])
                    this.pushGameFields(this.props.playerID,data[0].uid, this.props.username, data[0].username, data[0].numWins, data[0].numLosses, data[0].numTies, this.props.numWins, this.props.numLosses, this.props.numTies)

                    
                }
                else {
                    //user is first player, so wait in the queue
                    this.addUsertoQueue()
                    //put a listener on the person with a callback to change once player is in game
                    // rebase.listenTo(`users/${this.props.playerID}`, {
                    //     context: this,
                    //     asArray: true,
                    //     then(Data){
                    //         this.props.goToUrl(`/gameScreen`)
                    //       //this.setState({total});
                    //     }
                    //   })
                
                }
              
            }
          });
        })
        

    }

    removeUserFromQueue = (playerID) => {
        rebase.fetch(`queue`, {
            context: this,
            asArray: true,
            then(data){
              console.log(data);
              console.log(data.length)

              for (var i = 0; i < data.length; i++){
                  if (data[i].uid === playerID){

                    rebase.remove(`queue/${data[i].key}`, function(err){
                        if(err){
                          console.log("Error in homes for removing user from queue")
                        }
                      });
                  }
              }
            }
          }); 
    }

    cancelSearch = () => {
        this.setState({searchingForGame: false});
        this.removeUserFromQueue(this.props.playerID)
    }

    logout = () => {
        const newState = { ...this.props.getAppState() }
        newState.user = { }
        this.props.setAppState(newState)
        auth.signOut()
    }

    goToLeaderboard = () => {
         console.log("going to leaderboard")
        this.props.goToUrl("/leaderboard")
    }


  render() {
    return (
      <div className="Home" style={{height: '100vh', width: '100%', background: 'white'}}>
            <p style={{"float":"left", "padding-left": "10px"}}>
                Welcome {this.props.username}!
                <br></br>
                <button style={{
                            borderRadius: "500px",
                            padding: '10px 50px',
                            margin: '20px 0px',
                            color: 'white',
                            fontSize: '20px',
                            backgroundColor: 'black'

                            }} onClick={this.goToLeaderboard}>Leaderboard</button>
            </p>
            <p style={{"float":"right", "padding-right": "10px"}}>
                Registered Users: {this.state.numRegisteredUsers}
                <br></br>
                <br></br>
                <br></br>
                <br></br>
            </p>
            <br></br>
            <text> Num Wins: {this.props.numWins} </text><br></br>
            <text> Num Losses: {this.props.numLosses} </text><br></br>
            <text> Num Ties: {this.props.numTies} </text><br></br>
            <br></br><br></br><br></br><br></br>
            <text style={{background: 'white', color: 'black', size: '20'}}>Welcome to Othello-Online!</text>
            <br></br>
            <center><img alt={"Othello-Picture"} className="Othello" src={OthelloPicture} /></center>
            <br></br><br></br><br></br><br></br>
            
            <br></br><button style={{
                borderRadius: "500px",
                padding: '10px 50px',
                color: 'white',
                backgroundColor: 'black',
                fontSize: '20px'

            }}
            hidden={this.state.searchingForGame} onClick={this.searchForGame}>Search for a game</button><br></br>
            <br></br><button 
            style={{
                borderRadius: "500px",
                padding: '30px 60px',
                color: 'white',
                backgroundColor: 'black',
                fontSize: '20px'

            }}
            hidden={!this.state.searchingForGame} onClick={this.cancelSearch}>Cancel search</button>
            <p align="center">
                <ReactLoading type={"spokes"} color="#000000" height={20} width={parseInt(this.loadingSymbolToggle())} />
            </p>
            <p align="left">
                <br></br><button style={{
                borderRadius: "500px",
                padding: '10px 50px',
                color: 'white',
                backgroundColor: 'black',
                fontSize: '20px',
                "margin-top": '-30px',

            }} onClick={this.logout}>Logout</button><br></br>
                
            </p>
      </div>
    );
  }
}

export default Home;
