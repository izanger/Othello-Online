import React, { Component } from 'react';
import rebase from './rebase.js'
import Disc from './Disc.js'

class GameBoard extends Component {
    constructor(){
        super();
        this.state = {
            board: { },
            boardSynced: false,
        }
    }
    componentWillMount = () => {
        //rebase.syncState(`games/${this.props.gameID}/board`, {
        //this.testFunc()
        rebase.syncState(`games/testingID/board`, {
            context: this,
            state: 'board',
            then(data){
                let newState = { ...this.state }
                newState.boardSynced = true
                this.setState(newState)
            }
        })
    }

    // testFunc = () => { //add dummy data for testing
    //     rebase.post(`games/testingID/board`, {
    //         data: {
    //             0: {0: "white",1: "white",2: "white",3: "white",4: "white",5: "white",6: "white",7: "white",},
    //             1: {0: "white",1: "white",2: "white",3: "white",4: "white",5: "white",6: "white",7: "white",},
    //             2: {0: "white",1: "white",2: "white",3: "white",4: "white",5: "white",6: "white",7: "white",},
    //             3: {0: "white",1: "white",2: "white",3: "white",4: "white",5: "white",6: "white",7: "white",},
    //             4: {0: "white",1: "white",2: "white",3: "white",4: "white",5: "white",6: "white",7: "white",},
    //             5: {0: "white",1: "white",2: "white",3: "white",4: "white",5: "white",6: "white",7: "white",},
    //             6: {0: "white",1: "white",2: "white",3: "white",4: "white",5: "white",6: "white",7: "white",},
    //             7: {0: "white",1: "white",2: "white",3: "white",4: "white",5: "white",6: "white",7: "white",},
    //         }
    //     })
    // }

    renderRow = (rowNum) => {
        let row = []
        for(var i = 0; i < 8; i++){
            row.push(<Disc row={rowNum} col={i} color={this.state.board[rowNum][i]}/>) //TODO: make color change dynamically
        }
        return row
    }

    render = () => {
        let rows = [];
        if(this.state.boardSynced){
            for(var i = 0; i < 8; i++){
                rows.push(<div>{this.renderRow(i)}<br></br></div>)
            }

            return (
                <div>
                    <p> ahoy it's synced: {this.state.board.testvalue}</p>
                    {rows}
                </div>
            )
        } else {
            return (
                <p> ahoy it's not synced</p>
            )
        }

    }
}
export default GameBoard