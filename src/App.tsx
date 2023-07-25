import { useState } from 'react';
import CanvasGrid from './components/gameComponents/CanvasGrid';
import Navbar from './components/UI/NavBar';
import Settings from './components/UI/Settings';
import { position } from './components/gameComponents/CanvasGrid';

/* 
  Todo:
    -styling issues
      *improve font scaling/positioning for modal
      *background colour on double rotate
    -goal state explanation
    -alternative scrolling game mode
    -question API modifiers
      *populate query options
      *implement settings component
*/


function App() {

  //User defined parameters to modify API call to specific question types
  const [apiParameters, setApiParameters] = useState(["limit=25", "difficulties=easy"]),
  [infoModal, setInfoModal] = useState({visible: false, mode: "dark"}),
  [darkMode, setDarkMode] = useState(false),
  [gameRules, setGameRules] = useState({startHexes: [{xPos:2, yPos: 2}], endHexes: [{xPos: 0, yPos: 0}, {xPos: 4, yPos: 0}, {xPos: 0, yPos: 4}, {xPos: 4, yPos: 4}]});
  
  
  function handleIconClick(typeClicked: "info" | "settings" | "dark") {
    if (typeClicked === "dark") {
      setDarkMode(oldVal => !oldVal);
    } else {
      setInfoModal(oldModal => {
        if (oldModal.mode === typeClicked) {
          return {...oldModal, visible: !oldModal.visible};
        } else {
          return {visible: true, mode: typeClicked};
        }
      });
    }
  }

  function rulesChanged(rules: {startHexes: Array<position>, endHexes: Array<position>}) {
    setGameRules(rules);
  }

  function apiParamsChanged(apiParameters: Array<string>) {
    setApiParameters(oldParams => [...oldParams, ...apiParameters]);
  }

  //https://the-trivia-api.com/v2/questions
  const apiDetails = {baseUrl: "", method: "GET", urlParams: apiParameters};

  const instructions = "Click/Tap hexes to answer questions and open up new hexes to solve. Your goal is to make to the corners";

  return (
    <div className={`app ${darkMode? "darkmode" : "lightmode"}`}>
      <Navbar handleIconClick={handleIconClick} />
      {infoModal.visible && <div className={`info-modal ${infoModal.mode}`}>
        {infoModal.mode === "info"? `${instructions}` : <Settings categoriesEndpoint='' handleRuleChanges={rulesChanged} ruleOptions={[]} handleApiChanges={apiParamsChanged} />}
      </div>}
      <CanvasGrid rowLength={5} startEndPos={gameRules} api={apiDetails} darkMode={darkMode}/>
    </div>
  )
}

export default App
