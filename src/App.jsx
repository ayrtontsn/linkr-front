import { BrowserRouter, Route, Routes } from 'react-router-dom'
import FeedPage from './pages/feed'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'></Route>

        <Route path='/feed' element={<FeedPage/>}></Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
