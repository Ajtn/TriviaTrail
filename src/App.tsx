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

  const questions = [
    {
      id: "asdasd",
      questionText: "What is your name?",
      answerText: "Arthur",
      incorrectAnswers: ["fred", "bob", "bruce"],
      difficulty: "easy",
      category: "history"
    },
    {
      id: "asdasdklasda",
      questionText: "What is your quest?",
      answerText: "To seek the holy grail!",
      incorrectAnswers: ["To slay the black knight", "Say Ni!", "bruce"],
      difficulty: "easy",
      category: "history"
    },
    {
      id: "a123jk",
      questionText: "What is your favourite colour?",
      answerText: "Yellow",
      incorrectAnswers: ["Blue", "Peuce", "Burgundy", "Magenta"],
      difficulty: "easy",
      category: "history"
    },
    {
      id: "3214hjkfd",
      questionText: "What is your quest?",
      answerText: "To seek the holy grail!",
      incorrectAnswers: ["To slay the black knight", "Say Ni!", "bruce"],
      difficulty: "easy",
      category: "history"
    },
    {
      id: "ffasd34tsdg",
      questionText: "What is your name?",
      answerText: "Arthur",
      incorrectAnswers: ["fred", "bob", "bruce"],
      difficulty: "easy",
      category: "General"
    },
    {
      id: "4lfgy0",
      questionText: "What is your quest?",
      answerText: "To seek the holy grail!",
      incorrectAnswers: ["To slay the black knight", "Say Ni!", "bruce"],
      difficulty: "easy",
      category: "Science"
    },
    {
      id: "3490234jk",
      questionText: "What is your quest?",
      answerText: "To seek the holy grail!",
      incorrectAnswers: ["To slay the black knight", "Say Ni!", "bruce"],
      difficulty: "easy",
      category: "history"
    },
    {
      id: "12-30jk",
      questionText: "What is your quest?",
      answerText: "To seek the holy grail!",
      incorrectAnswers: ["To slay the black knight", "Say Ni!", "bruce"],
      difficulty: "easy",
      category: "history"
    },
    {
      id: "asdad343",
      questionText: "What is your name?",
      answerText: "Arthur",
      incorrectAnswers: ["fred", "bob", "bruce"],
      difficulty: "easy",
      category: "General"
    },
    {
      id: "4lfffgy0",
      questionText: "What is your quest?",
      answerText: "To seek the holy grail!",
      incorrectAnswers: ["To slay the black knight", "Say Ni!", "bruce"],
      difficulty: "easy",
      category: "Science"
    },
    {
      id: "490234jk",
      questionText: "What is your quest?",
      answerText: "To seek the holy grail!",
      incorrectAnswers: ["To slay the black knight", "Say Ni!", "bruce"],
      difficulty: "easy",
      category: "history"
    },
    {
      id: "12-3ff0jk",
      questionText: "What is your quest?",
      answerText: "To seek the holy grail!",
      incorrectAnswers: ["To slay the black knight", "Say Ni!", "bruce"],
      difficulty: "easy",
      category: "history"
    },
    {
      id: "12-30ssdk",
      questionText: "What is your quest?",
      answerText: "To seek the holy grail!",
      incorrectAnswers: ["To slay the black knight", "Say Ni!", "bruce"],
      difficulty: "easy",
      category: "history"
    },
    {
      id: "asdasdasd3j",
      questionText: "What is your name?",
      answerText: "Arthur",
      incorrectAnswers: ["fred", "bob", "bruce"],
      difficulty: "easy",
      category: "General"
    },
    {
      id: "dfsgjlk345",
      questionText: "What is your quest?",
      answerText: "To seek the holy grail!",
      incorrectAnswers: ["To slay the black knight", "Say Ni!", "bruce"],
      difficulty: "easy",
      category: "Science"
    },
    {
      id: "f432",
      questionText: "What is your quest?",
      answerText: "To seek the holy grail!",
      incorrectAnswers: ["To slay the black knight", "Say Ni!", "bruce"],
      difficulty: "easy",
      category: "history"
    },
    {
      id: "12-34sdff0jk",
      questionText: "What is your quest?",
      answerText: "To seek the holy grail!",
      incorrectAnswers: ["To slay the black knight", "Say Ni!", "bruce"],
      difficulty: "easy",
      category: "history"
    }
  ];

  return (
    <div className='app'>
      <Grid windowWidth={windowWidth} rowLength={5} startingHex={{xPos:1, yPos: 1}} api={{url: ""}}/>
    </div>
  )
}

export default App
