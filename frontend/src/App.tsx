// import { useState } from 'react'4
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sender from "./components/Sender"
import {Receiver} from "./components/Receiver"
import './App.css'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/sender" element={<Sender/>}  />
          <Route path="/receiver" element={<Receiver/>}  />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
