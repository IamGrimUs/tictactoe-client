import * as React from 'react'

const { createContext, useContext, useState } = React

const DEFAULT_GAME_CONTEXT = {
  activeGame: {},
  setActiveGame: () => {}
}

const GameContext = createContext(DEFAULT_GAME_CONTEXT)

export const useActiveGame = () => {
  return useContext(GameContext)
}

export const GameContextProvider = ({ children }) => {
  const [activeGame, setActiveGame] = useState({})
  return <GameContext.Provider value={{ activeGame, setActiveGame }}>{children}</GameContext.Provider>
}
