import { useState } from 'react';
import CanvasGrid from './components/CanvasGrid';
import Navbar from './components/NavBar';

/* 
  Todo:
    -styling issues
      *improve font scaling/positioning for modal
      *background colour on rotate
    -goal state explanation
    -alternative scrolling game mode
    -question API modifiers
*/

function App() {

  //User defined parameters to modify API call to specific question types
  const [apiParameters, setApiParameters] = useState(["limit=25", "difficulties=easy"]),
  [darkMode, setDarkMode] = useState(false),
  [gameRules, setGameRules] = useState({startHexes: [{xPos:2, yPos: 2}], endHexes: [{xPos: 0, yPos: 0}, {xPos: 4, yPos: 0}, {xPos: 0, yPos: 4}, {xPos: 4, yPos: 4}]});
  
  function updateDarkMode() {
    setDarkMode(oldVal => !oldVal);
  }
  
  //https://the-trivia-api.com/v2/questions
  const apiDetails = {baseUrl: "", method: "GET", urlParams: apiParameters};

  return (
    <div className='app'>
      <Navbar />
      <CanvasGrid rowLength={5} startEndPos={gameRules} api={apiDetails} darkMode={darkMode}/>
    </div>
  )
}

export default App
