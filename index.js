import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {


  render() {
    let moveColor;
    if(this.props.value =='X'){
         moveColor = '#FF1652';
    } if(this.props.value=='O') {
      moveColor = '#494949';
    }

    let winningSquareColor ;
    if (this.props.winningSquares) {
       for (let i = 0; i < this.props.winningSquares.length;i++) {
         if (this.props.winningSquares[i] === this.props.dataIndex && this.props.value=='O') {
            winningSquareColor = '#A0A0A0';
          }
          if (this.props.winningSquares[i] === this.props.dataIndex && this.props.value=='X') {
            winningSquareColor = '#FFA6BD';
        } 
    }
  }

//console.log(this.props.winningSquares);
    return (
      <button style={{backgroundColor:winningSquareColor,color:moveColor}} className="square" onClick={()=>this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    //console.log('helo', this.props.squares[i]);
   // console.log('index', i);
    return (
      <Square
        dataIndex={i}
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winningSquares={this.props.winningSquares}
      />
    );
  }

render(){
//console.log(this.props.winningSquares);

let rows = [];
    for (let i = 0; i < 3; i++) {
      let cols = [];
      for (let j = 0; j < 3; j++) {
        cols.push(this.renderSquare(i * 3 + j));
      }
        rows.push(
          <div key={i} data-index={i} className="board-row">{cols}</div>
          );
    } 
    return (
      <div>{rows}</div>
      );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber:0,
      xIsNext: true,
      locationHistory: [{
        rowNum: null,
        colNum: null
      }],
      asc:true, //used in toggle
    };
  }

  handleClick(i) {
    //debugger;
    const history = this.state.history.slice(0,this.state.stepNumber +1);
    const locationHistory = this.state.locationHistory.slice(0,this.state.stepNumber +1);
    const rowNum = Math.floor(i/3);
    const colNum = i % 3;
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares).length !== 0 || squares[i]) {
     return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
    history: history.concat([{  
      squares: squares,
    }]), 
    locationHistory: locationHistory.concat([{  
      rowNum: rowNum,
      colNum: colNum,
    }]), 
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      
    });
  }

  sortMoves(){
      this.setState({
        asc: !this.state.asc
      })
  }

  render() {
    const history = this.state.history.slice(0,this.state.stepNumber+1);
    const locationHistory = this.state.locationHistory.slice(0,this.state.stepNumber +1);
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares)[0];
    const winnerIndex = calculateWinner(current.squares)[1];
    var fontStyle;
    const moves = history.map((step,move) => {
    const desc = move ?
      'Go to move #' + move + ' ; Location:' + locationHistory[move].rowNum + ',' 
      + locationHistory[move].colNum :
      'Go to game start';

      if(move === this.state.stepNumber) {
         fontStyle = {fontWeight:'bold'}
      };
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} style={fontStyle}> 
          {desc}
          </button>
        </li>
        )
    }
    );

//moves is an array that contains the moves, flip move array using asc flag which toggles from T -> F ased on sort moves function
    if (!this.state.asc) {
       moves.reverse();
    }

    let status;
    let winningSquares;
    if (winner) {
    status = 'Winner: ' + winner;
    winningSquares = winnerIndex;
    } else {
       if(history.length == 10){
        status = "It's a draw!";
      }
     else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
  }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            data-board='hello'
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningSquares = {winningSquares}
          />
        </div>
        <div className="game-info">
        <div className="status">{status}</div>
          <button className="sort-button" onClick={(i)=> this.sortMoves()}>Sort Move Order</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a],[a,b,c]];
    }
  }
  return [];
}


