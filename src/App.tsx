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
  //https://opentdb.com/api.php
  //params: "limit", "categories", "difficulties", "region", "tags", "types",

  const apiDetails = {baseUrl: "", method: "GET", headers: {}, urlParams: ["limit=25", "difficulties=easy"]};
  return (
    <div className='app'>
      <Grid windowWidth={windowWidth} rowLength={5} hexOffset={5} startingHex={{xPos:2, yPos: 2}} endHexes={[{xPos: 0, yPos: 0}, {xPos: 4, yPos: 0}, {xPos: 0, yPos: 4}, {xPos: 4, yPos: 4}]} api={apiDetails}/>
    </div>
  )
}

export default App
