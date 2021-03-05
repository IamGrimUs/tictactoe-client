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
  const [hasInterval, setHasInterval] = useState(false)
  const { activeGame, setActiveGame } = useActiveGame()
  const { gameBoard } = activeGame

  useEffect(() => {
    let count = 0

    const queryApi = () => {
      if (hasInterval) {
        return
      }
      const interval = setInterval(async () => {
        const res = await axios.get(`${BASE_URL}/${activeGame._id}`)
        setActiveGame({ ...res.data.data })
        console.log('interval ', res.data.data)
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
      console.log(count)
      const shouldPoll = (count % 2 === 1 && whoAmI === 'p2') || (count % 2 === 0 && whoAmI === 'p1')
      if (shouldPoll) {
        setBoardActive(false)
        queryApi()
        // setHasInterval(true)
      } else {
        clearInterval(hasInterval)
        setHasInterval(undefined)
        setBoardActive(true)
      }
    }
  }, [activeGame, gameBoard, hasInterval, whoAmI, setActiveGame])

  const makeSelection = async (row, column) => {
    const { _id, playerOne, playerTwo } = activeGame
    if (gameBoard[row][column]) {
      return
    }
    if (whoAmI === 'p1') {
      try {
        const res = await axios({
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          },
          url: `${BASE_URL}/${_id}`,
          data: {
            playerId: playerOne,
            row,
            column
          }
        })
        setActiveGame({ ...res.data.data })
      } catch (error) {
        console.log(error)
      }
    }
    if (whoAmI === 'p2') {
      try {
        const res = await axios({
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          },
          url: `${BASE_URL}/${_id}`,
          data: {
            playerId: playerTwo,
            row,
            column
          }
        })
        setActiveGame({ ...res.data.data })
      } catch (error) {
        console.log(error)
      }
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
      {showGameBoard ? <GameBoard active={boardActive} game={activeGame} handleClick={makeSelection} /> : <Button text="Start Multiplayer Game" btnStyle="primary" handleClick={handleStartGame} />}
    </div>
  )
}
