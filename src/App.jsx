import { useEffect, useState, useRef } from 'react';
import Board from './components/Board';
import Controls from './components/Controls';
import { generateBoard } from './utils/sudokuGenerator';
import './App.css';

function App() {
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [lives, setLives] = useState(3);
  const [selectedNumber, setSelectedNumber] = useState(null);

  // 🕒 Estado y referencia para el temporizador
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);

  const handleNewGame = (difficulty) => {
    const { puzzle, solution } = generateBoard(difficulty);
    setBoard(puzzle);
    setSolution(solution);
    setGameStatus('playing');
    setLives(3);
    setElapsedTime(0); // Reinicia el tiempo
    startTimer(); // Reinicia el cronómetro
    console.log("hola")
  };

  const startTimer = () => {
    clearInterval(timerRef.current); // Asegura que no haya múltiples timers
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      const currentTime = Date.now();
      setElapsedTime(Math.floor((currentTime - startTime) / 1000));
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  // Inicia el juego al cargar
  useEffect(() => {
    handleNewGame('easy');
  }, []);

  // 🛑 Detiene el tiempo si ganas o pierdes
  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      stopTimer();
      const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
      const seconds = String(elapsedTime % 60).padStart(2, '0');
      alert(`¡Juego terminado! Tiempo total: ${minutes}:${seconds}`);
    }
  }, [gameStatus]);

  const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
  const seconds = String(elapsedTime % 60).padStart(2, '0');

  return (
    <div className="app">
      <h1>LuluDoku</h1>

      {/* ⏱ Aquí agregamos el temporizador visual */}
      <h2>Tiempo: {minutes}:{seconds}</h2>

      <h2>Lives: {lives}</h2>
      {gameStatus === 'won' && <div className="win-message">¡Ganaste! 🎉</div>}
      <Board
        board={board}
        setBoard={setBoard}
        solution={solution}
        lives={lives}
        setLives={setLives}
        setGameStatus={setGameStatus}
        selectedNumber={selectedNumber} 
        setSelectedNumber={setSelectedNumber} 
        onLose={() => handleNewGame('easy')}
      />
      <Controls onNewGame={handleNewGame} />
    </div>
  );
}

export default App;
