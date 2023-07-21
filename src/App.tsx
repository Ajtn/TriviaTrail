import CanvasGrid from './components/CanvasGrid';

function App() {
  //https://the-trivia-api.com/v2/questions
  const apiDetails = {baseUrl: "https://the-trivia-api.com/v2/questions", method: "GET", urlParams: ["limit=25", "difficulties=easy"]};
  return (
    <div className='app'>
      <CanvasGrid rowLength={5} startingHexes={[{xPos:2, yPos: 2}]} endHexes={[{xPos: 0, yPos: 0}, {xPos: 4, yPos: 0}, {xPos: 0, yPos: 4}, {xPos: 4, yPos: 4}]} api={apiDetails}/>
    </div>
  )
}

export default App
