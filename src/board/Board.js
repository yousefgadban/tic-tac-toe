import React from "react";
import './board.css'

export default class Board extends React.Component {

    winner = '';
    previousActions = [];
    previousActionsList = [];
    steps = 0;

    constructor(props) {
        super(props);
        this.state = {currentGame: [], turn: 'x', winner: '', steps: 0, cells: [], previousActions: [[-5, -5, -5, -5, -5, -5, -5, -5, -5],[],[],[],[],[],[],[],[]]};
        this.boardRef = React.createRef();
        this.cells = [];
    }

    

    componentDidMount() {
        let cells = [];
        for (let i = 0 ; i < 9 ; i++) {
            cells.push(<div className="cell" key={i} data-cell-position={i} onClick={(e) => {this.onCellClicked(e)}}></div>);
            this.state.currentGame.push(-5);
        }

        this.previousActions.push(''+[-5, -5, -5, -5, -5, -5, -5, -5, -5]);
        this.setState({cells: cells})
    }

    componentDidUpdate() {
        if (this.winner !== '') {
            this.winner = '';
            this.props.theGameIsOverParent(this.state.winner);

            this.initiateGame();
        }
    } 

    initiateGame = () => {

        let currentGame = [];
        this.previousActions = [];
        this.previousActionsList = [];
        this.steps = 0;
        this.previousActions.push(''+[-5, -5, -5, -5, -5, -5, -5, -5, -5]);

        this.cells = [];   
        this.setState({currentGame: currentGame, turn: 'x', winner: '', steps: 0, cells: [], previousActions: [[-5, -5, -5, -5, -5, -5, -5, -5, -5],[],[],[],[],[],[],[],[]]});
        for (let i = 0 ; i < 9 ; i++) {
            this.cells.push(<div className="cell" key={i} data-cell-position={i} onClick={(e) => {this.onCellClicked(e)}}></div>);
             currentGame.push(-5);
        }
       
        this.setState({currentGame: currentGame, turn: 'x', winner: '', steps: 0, cells: this.cells});

    }


    onUndoClicked= (e) => {
        let arr = e.target.getAttribute('data-undo-state').split(',');
        let position = +e.target.getAttribute('data-undo-position');
        let turn = position%2 === 0 ? 'x' : 'o';

        let undoArr = arr.map((strNum) => {
            return +strNum;
        });

        let cellss = [];

        for (let i = 0 ; i < 9 ; i++) {
            let cellClass = 'cell';
            if (undoArr[i] === 0) {
                cellClass += ' o';
            }
            if (undoArr[i] === 1) {
                cellClass += ' x';
            }

            cellss.push(
                <div className={cellClass} key={i} data-cell-position={i} onClick={(e) => {this.onCellClicked(e)}}></div>
            );
        }

        if (position === 0) {
            this.previousActions = [];
            this.previousActionsList = [];
        } else {
            let length = this.previousActions.length;
            for (let j = 0; j < (length - position - 1); j++) {
                this.previousActions.pop();
            }
    
            this.previousActionsList = this.previousActions.map((element, i) => {
                let move = i === 0 ? 'Go to start' : `Move ${i}` 
                return <div  className="undo-item" key={i} data-undo-position={i} data-undo-state={element} onClick={(e) => {this.onUndoClicked(e)}}>{move}</div>
            });
        }

        this.setState({currentGame: undoArr, turn: turn, cells: [], steps: position});
        setTimeout(() => {
            this.setState({currentGame: undoArr, turn: turn, cells: cellss, steps: position});
        }, 50);

       
    }

    onCellClicked = (e) => {
        let position = +e.target.getAttribute('data-cell-position');

        if (this.state.currentGame[position] === -5) {
            e.target.classList.add(this.state.turn);
            let currentGameArr = this.state.currentGame;
            currentGameArr[position] = this.state.turn === 'x' ? 1 : 0;

            this.steps++;  
            let previousActionsArr = this.previousActions;
            this.previousActions.push(''+currentGameArr); 
          
            this.previousActionsList = this.previousActions.map((element, i) => {
                let move = i === 0 ? 'Go to start' : `Move ${i}` 
                return <div className="undo-item" key={i} data-undo-position={i} data-undo-state={element} onClick={(e) => {this.onUndoClicked(e)}}>{move}</div>
            });

            this.setState({turn: this.state.turn === 'x' ? 'o' : 'x', steps: this.state.steps + 1, currentGame: currentGameArr, previousActions: previousActionsArr });
            this.checkIfGameOver(); 
        }

    }

    checkIfGameOver = () => {
        let currArr = this.state.currentGame;
        if (currArr[0] + currArr[1] + currArr[2] === 3 || 
            currArr[3] + currArr[4] + currArr[5] === 3 ||
            currArr[6] + currArr[7] + currArr[8] === 3 ||
            currArr[0] + currArr[3] + currArr[6] === 3 ||
            currArr[1] + currArr[4] + currArr[7] === 3 ||
            currArr[2] + currArr[5] + currArr[8] === 3 ||
            currArr[0] + currArr[4] + currArr[8] === 3 ||
            currArr[2] + currArr[6] + currArr[8] === 3) {
                this.winner = 'x';
                this.setState({winner: 'x', cells: []});
        } else if (
            currArr[0] + currArr[1] + currArr[2] === 3 || 
            currArr[3] + currArr[4] + currArr[5] === 0 ||
            currArr[6] + currArr[7] + currArr[8] === 0 ||
            currArr[0] + currArr[3] + currArr[6] === 0 ||
            currArr[1] + currArr[4] + currArr[7] === 0 ||
            currArr[2] + currArr[5] + currArr[8] === 0 ||
            currArr[0] + currArr[4] + currArr[8] === 0 ||
            currArr[2] + currArr[6] + currArr[8] === 0) {
                this.winner = 'o';
                this.setState({winner: 'o', cells: []});
        }

        if (this.state.steps === 8) {
            this.winner = 'd';
            this.setState({winner: 'd', cells: []});
        }

        return;
    }

    onUndoClicked() {
        console.log('onUndoClicked');
    }

    render() {
        return (
            <div className="boardPage">
                <div className="boardSection">
                    <h3 className="title" id="titleID">Tic Tac Toe</h3>
                    <div className="board" style={{height: '300px'}} >    
                        {this.state.cells}
                    </div>
                </div>
                <div className="undoListContainer">
                    <input style={{display: 'none'}} type='button' value='UNDO' onClick={() => {this.onUndoClicked()}} />
                    <br />
                    <div className="undoList">
                        {this.previousActionsList}
                    </div>
                    
                </div>
            </div>
        );
    }
}