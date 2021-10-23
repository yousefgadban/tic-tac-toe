import React from "react";
import ReactDOM from "react-dom";
import Board from "./board/Board";
import './index.css'

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {gameOver: true, winner: ''};
        this.gameBoardRef = React.createRef();
    }

    theGameIsOver = (result) => { 
        let winner = result === 'd' ? 'DRAW' : `Winner ${result.toUpperCase()}`;
        this.setState({gameOver: true, winner: winner});
    }

    onRestartClicked = () => {
        this.setState({gameOver: false, winner: ''});
    }

    render() {
        return <div className="main">
            <div
                
                className="gameBoard"
                style={{display: this.state.gameOver ? 'none' : 'block'}}
            >
                <Board ref={this.gameBoardRef}  className="boardEle" theGameIsOverParent={this.theGameIsOver} gameOver={this.state.gameOver} />
            </div>
            <div 
                className="newGame"
                style={{display: !this.state.gameOver ? 'none' : 'flex'}}
            >
                <h3 className="title">Tic Tac Toe</h3>
                <h3 className="winner">{this.state.winner}</h3>
               

                <div className='tic-tac-img'>
                    <div className="aboard" style={{height: '100px'}} >    
                        <div className="acell ax"></div>
                        <div className="acell"></div>
                        <div className="acell"></div>
                        <div className="acell ao"></div>
                    </div>
                </div>

                <div style={{height: '120px'}}>
                    <input className="startBtn" type='button' value='START GAME!' onClick={() => {this.onRestartClicked()}} />
                </div>
                
            </div>
            
        </div>
    }
}

ReactDOM.render(<App />, document.querySelector('#root'));