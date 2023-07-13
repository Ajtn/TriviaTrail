import Grid from './components/Grid'
import { useEffect, useState} from 'react';
import './style/App.css'

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(initResizeListener, [windowWidth]);

  function initResizeListener() {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }

  function handleResize() {
    setWindowWidth(window.innerWidth);
  }


  //https://the-trivia-api.com/v2/questions
  //{'limit': "25", 'difficulties': "easy", 'types': "text_choice"}

  const apiDetails = {url: "https://opentdb.com/api.php?amount=25&difficulty=easy", method: "GET", headers: {}};
  return (
    <div className='app'>
      <Grid windowWidth={windowWidth} rowLength={5} startingHex={{xPos:2, yPos: 2}} endHexes={[{xPos: 0, yPos: 0}, {xPos: 4, yPos: 0}, {xPos: 0, yPos: 4}, {xPos: 4, yPos: 4}]} api={apiDetails}/>
    </div>
  )
}

export default App
