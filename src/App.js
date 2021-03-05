import { GameContextProvider } from './_shared/context/useActiveGame'
import { TicTacToe } from './tictactoe/tictactoe.component'
import { Footer } from './_shared/footer.component'
import './App.css'

function App() {
  return (
    <div className="App">
      <GameContextProvider>
        <TicTacToe />
      </GameContextProvider>
      <Footer text="&copy;2021 SuckaFish Inc" />
    </div>
  )
}

export default App
