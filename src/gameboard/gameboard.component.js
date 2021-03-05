import * as React from 'react'
import './gameboard.styles.css'

export const GameBoard = ({ active, game, handleClick }) => {
  const { gameBoard, playerOne, playerTwo } = game

  const pickCharToShow = selection => {
    if (selection === playerOne) {
      return 'X'
    } else if (selection === playerTwo) {
      return 'O'
    } else {
      return null
    }
  }

  const renderBoard = () => {
    const squares = []
    for (let i = 0; i < gameBoard.length; i++) {
      for (let j = 0; j < gameBoard[i].length; j++) {
        let keyValue = Date.now().toString()
        squares.push(
          <div key={keyValue + Math.random()} onClick={() => handleClick(i, j)}>
            {pickCharToShow(gameBoard[i][j])}
          </div>
        )
      }
    }
    return squares
  }

  return (
    <div className="gameBoardContainer">
      {active ? null : <div className="boardCover">Waiting for other player...</div>}
      <div className="gameBoard">{renderBoard()}</div>
    </div>
  )
}
