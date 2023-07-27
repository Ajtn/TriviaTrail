import { useEffect, useState } from 'react';
import CanvasGrid from './components/gameComponents/CanvasGrid';
import Navbar from './components/UI/NavBar';
import Settings from './components/UI/Settings';
import { position } from './components/gameComponents/CanvasGrid';
import minIcon from './assets/minimise.png';
import './style/canvasStyle.css';

/* 
  Todo:
    -styling issues
      *improve font scaling/positioning for modal
      *background colour on double rotate
    -goal state explanation
    -alternative scrolling game mode
*/
export type ruleSet = {
  name: string;
  rowLength: number;
  colLength: number;
  startHexes: Array<position>;
  endHexes: Array<position>;
  specialRules: Array<string>;
  description: string;
}

function App() {

  const ruleOptions: Array<ruleSet> = [
    {
      name: "Big Escape",
      rowLength: 7,
      colLength: 7,
      startHexes: [{xPos: 3, yPos: 3}, {xPos: 3, yPos: 2}],
      endHexes: [{xPos: 0, yPos: 0}, {xPos: 6, yPos: 0}, {xPos: 0, yPos: 6}, {xPos: 6, yPos: 6}],
      specialRules: [],
      description: "Start in the middle of a 7x7 grid and work your way to the corners to escape"
    },
    {
      name: "Small Escape",
      rowLength: 5,
      colLength: 5,
      startHexes: [{xPos: 2, yPos: 2}],
      endHexes: [{xPos: 0, yPos: 0}, {xPos: 4, yPos: 0}, {xPos: 0, yPos: 4}, {xPos: 4, yPos: 4}],
      specialRules: [],
      description: "Start in the middle of a 5x5 grid and work your way to the corners to escape"
    },
    {
      name: "Endless Hex Crawl",
      rowLength: 5,
      colLength: 0,
      startHexes: [{xPos: 0, yPos: 0}, {xPos: 1, yPos: 0}, {xPos: 2, yPos: 0}, {xPos: 3, yPos: 0}, {xPos: 4, yPos: 0}],
      endHexes: [],
      specialRules: ["endless"],
      description: "Keep answering questions until you get stuck"
    },
  ];

  //User defined parameters to modify API call to specific question types
  const [gameMode, setGameMode] = useState(0),
  [selectedCategories, setSelectedCategories] = useState([{name: "", selected: false}]),
  [apiParameters, setApiParameters] = useState({}),
  [infoModal, setInfoModal] = useState({visible: false, mode: "dark"}),
  [darkMode, setDarkMode] = useState(false),
  [resetCount, setResetCount] = useState(0);

  useEffect(rulesChanged, [gameMode]);
  useEffect(initCategories, []);
  useEffect(categoriesChanged, [selectedCategories]);

  function rulesChanged() {
    if (ruleOptions[gameMode].colLength > 0) {
      const totalQuestions = ruleOptions[gameMode].rowLength * ruleOptions[gameMode].colLength;
      setApiParameters(oldParams => ({...oldParams, limit: String(totalQuestions)}));
    }
  }

  function initCategories() {
    fetch('https://the-trivia-api.com/v2/categories')
    .then(res => res.json())
    .then(data => setSelectedCategories(Object.keys(data).map(cat => ({name: cat, selected: false}))));
  }
  
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

  function reset() {
    setResetCount(oldCount => oldCount + 1);
  }

  function minimiseInfo() {
    setInfoModal(oldInfo => ({...oldInfo, visible: false}));
  }


  function gameModeSelected(gameModeIndex: number) {
    setGameMode(gameModeIndex);
  }

  function categoryToggled(index: number) {
    setSelectedCategories(oldCats => oldCats.map((cat, i) => i === index ? {...cat, selected: !cat.selected} : cat));
  }

  function categoriesChanged() {
    let categoryString = "";
    if (selectedCategories.some(cat => !cat.selected)) {
      selectedCategories.forEach(cat => {
            if (cat.selected) {
                categoryString = categoryString + cat.name.replace('&', '_and_') + ",";
            }
        });
        categoryString = categoryString.slice(0, -1).replace(/\s/g,'');
    }
    setApiParameters(oldParams => ({...oldParams, categories: categoryString}))
  }

  //https://the-trivia-api.com/v2/questions
  const apiDetails = {baseUrl: "", method: "GET", urlParams: apiParameters};

  const instructions = `Click/Tap hexes to answer questions and open up new hexes to solve. ${ruleOptions[gameMode].description}`;

  return (
    <div className={`app ${darkMode? "darkmode" : "lightmode"}`}>
      <Navbar handleIconClick={handleIconClick} />
      {infoModal.visible && <div className={`info-modal ${infoModal.mode}`}>
        <div className="toggle-info-modal"><img onClick={minimiseInfo} src={minIcon} alt="minimise icon" /></div>
        {infoModal.mode === "info"? instructions : <Settings categoryOptions={selectedCategories} handleCatChange={categoryToggled} handleRuleChanges={gameModeSelected} ruleOptions={ruleOptions} currentRule={gameMode} handleReset={reset}/>}
      </div>}
      {apiDetails.urlParams.hasOwnProperty("limit") && <CanvasGrid gameRules={ruleOptions[gameMode]} api={apiDetails} darkMode={darkMode} canClick={!infoModal.visible} reset={resetCount} />}
    </div>
  )
}

export default App
