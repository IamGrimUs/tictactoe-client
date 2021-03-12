import * as React from 'react'
import axios from 'axios'

import { useActiveGame } from '../_shared/context/useActiveGame'
import { Button } from '../_shared/button.component'
import { Title } from '../_shared/title.component'
import { GameBoard } from '../gameboard/gameboard.component'
import { BASE_URL } from '../constant'

import './tictactoe.styles.css'

const { useState, useEffect } = React

export const TicTacToe = () => {
  const [showGameBoard, setShowGameBoard] = useState(false)
  const [boardActive, setBoardActive] = useState(false)
  const [whoAmI, setWhoAmI] = useState('')
  const [winner, setWinner] = useState('')
  const [hasInterval, setHasInterval] = useState(false)

  const { activeGame, setActiveGame } = useActiveGame()
  const { gameBoard } = activeGame

  useEffect(() => {
    if (activeGame.winner) {
      clearInterval(hasInterval)
      setHasInterval(undefined)
      setBoardActive(true)
      setWinner(activeGame.winner)
      console.log(winner)
      return
    }
    let count = 0

    const queryApi = () => {
      if (hasInterval) {
        return
      }
      const interval = setInterval(async () => {
        const res = await axios.get(`${BASE_URL}/${activeGame._id}`)
        setActiveGame({ ...res.data.data })
      }, 1000)
      setHasInterval(interval)
    }

    if (gameBoard) {
      for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard.length; j++) {
          if (gameBoard[i][j]) {
            count++
          }
        }
      }
      const shouldPoll = (count % 2 === 1 && whoAmI === 'p2') || (count % 2 === 0 && whoAmI === 'p1')
      if (shouldPoll) {
        setBoardActive(false)
        queryApi()
      } else {
        clearInterval(hasInterval)
        setHasInterval(undefined)
        setBoardActive(true)
      }
    }
  }, [activeGame, gameBoard, hasInterval, whoAmI, setActiveGame, winner])

  const sendSelectionToAPI = async (id, player, row, column) => {
    try {
      const res = await axios({
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        url: `${BASE_URL}/${id}`,
        data: {
          playerId: player,
          row,
          column
        }
      })
      setActiveGame({ ...res.data.data })
    } catch (error) {
      console.log(error)
    }
  }

  const makeSelection = async (row, column) => {
    const { _id, playerOne, playerTwo } = activeGame
    if (gameBoard[row][column]) {
      return
    }
    if (whoAmI === 'p1') {
      sendSelectionToAPI(_id, playerOne, row, column)
    }
    if (whoAmI === 'p2') {
      sendSelectionToAPI(_id, playerTwo, row, column)
    }
  }

  const assignPlayer = (playerTwo = '') => {
    if (playerTwo) {
      setWhoAmI('p2')
      setBoardActive(true)
    } else {
      setWhoAmI('p1')
      setBoardActive(false)
    }
  }

  const renderWinner = () => {
    const verifyWinner = (winner === activeGame.playerOne && whoAmI === 'p1') || (winner === activeGame.playerTwo && whoAmI === 'p2')

    if (winner && verifyWinner) {
      return <div className="winner">Congratulations! You're a Winner.</div>
    } else {
      return <div className="winner">Well that stinks! You're the loser.</div>
    }
  }

  const handleStartGame = async () => {
    try {
      const res = await axios.post(`${BASE_URL}`)
      if (res.data.data) {
        setActiveGame({ ...res.data.data })
        const { playerTwo } = res.data.data
        assignPlayer(playerTwo)
        setShowGameBoard(true)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="main">
      <Title text="Tic to the Tac &amp; Toe" />
      {winner ? renderWinner() : null}
      {showGameBoard ? (
        <GameBoard active={boardActive} game={activeGame} winner={winner} handleClick={makeSelection} />
      ) : (
        <Button text="Start Multiplayer Game" btnStyle="primary" handleClick={handleStartGame} />
      )}
    </div>
  )
}
