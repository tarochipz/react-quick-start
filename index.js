import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/**class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={()=>this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}**/

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
 
  renderSquare(i) {
    return (
      <Square
        key = {i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

//old hard coded square render
/*render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }*/

render(){

let rows = [];
    for (let i = 0; i < 3; i++) {
      let cols = [];
      for (let j = 0; j < 3; j++) {
        cols.push(this.renderSquare(i*3 + j));
      }
        rows.push(
          <div key={i} className="board-row">{cols}</div>
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
      asc:true //used in toggle
    };
  }



  handleClick(i) {
    const history = this.state.history.slice(0,this.state.stepNumber +1);
    const locationHistory = this.state.locationHistory.slice(0,this.state.stepNumber +1);
    const rowNum = Math.floor(i/3);
    const colNum = i % 3;
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
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
      //console.log(asc);
  }

  render() {
    const history = this.state.history.slice(0,this.state.stepNumber+1);
    const locationHistory = this.state.locationHistory.slice(0,this.state.stepNumber +1);
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    var fontStyle;
    const moves = history.map((step,move) => {
    const desc = move ?
      'Go to move #' + move + ' ; Location:' + locationHistory[move].rowNum + ',' 
      + locationHistory[move].colNum :
      'Go to game start';

      if(move === this.state.stepNumber) {
         fontStyle = {fontWeight:'bold'}
      } else {
         fontStyle = {fontWeight:'normal'}
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

 
    if (!this.state.asc) {
       moves.reverse();
    }


    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">

        <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick={(i)=> this.sortMoves()}>Toggle Move Order</button>
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
      return squares[a];
    }
  }
  return null;
}
