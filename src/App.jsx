import { useEffect, useState, useRef } from 'react';
import Board from './components/Board';
import Controls from './components/Controls';
import { generateBoard } from './utils/sudokuGenerator';
import './App.css';
import Marquee from './components/marquee';
import KoFiButton from './components/KoFiButton';

function App() {
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [lives, setLives] = useState(3);
  const [selectedNumber, setSelectedNumber] = useState(null);

  // Temporizador
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);

  // Estado para pistas
  const [hintsLeft, setHintsLeft] = useState(3);
  const [highlightedHint, setHighlightedHint] = useState(null);

  // Sonido correcto
  const correctSound = useRef(new Audio('sounds/correct.wav'));

  const handleNewGame = (difficulty) => {
    const { puzzle, solution } = generateBoard(difficulty);
    setBoard(puzzle);
    setSolution(solution);
    setGameStatus('playing');
    setLives(3);
    setElapsedTime(0);
    setHintsLeft(3);
    setHighlightedHint(null);
    startTimer();
  };

  const startTimer = () => {
    clearInterval(timerRef.current);
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      const currentTime = Date.now();
      setElapsedTime(Math.floor((currentTime - startTime) / 1000));
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  useEffect(() => {
    handleNewGame('easy');
  }, []);

  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      stopTimer();
      const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
      const seconds = String(elapsedTime % 60).padStart(2, '0');
      alert(`Thak you for being a LuluGames beta tester!, your time was: ${minutes}:${seconds}`);
    }
  }, [gameStatus]);

  // Función para manejar cambio en celdas
  const handleCellChange = (row, col, value) => {
    if (board[row][col].isInitial || board[row][col].isCorrect) return;

    const correctValue = solution[row][col];
    const isCorrect = value === correctValue;

    const newBoard = board.map((r, i) =>
      r.map((cell, j) =>
        i === row && j === col
          ? {
              ...cell,
              value,
              isIncorrect: !isCorrect && value !== 0,
              isCorrect: isCorrect && !cell.isInitial,
            }
          : cell
      )
    );
  
    setBoard(newBoard);

    if (!isCorrect && value !== 0) {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        alert('Booo! Looser 😢 .');
        setGameStatus('lost');
        handleNewGame('easy'); // Reinicia el juego tras perder
      }
    }

    if (isCorrect) {
      correctSound.current.play();

      const hasWon = newBoard.every(row =>
        row.every(cell => cell.value !== 0 && !cell.isIncorrect)
      );
      if (hasWon) {
        setGameStatus('won');
      }
    }
  };

  // Función para usar pista
  const handleHint = () => {
    if (hintsLeft <= 0 || gameStatus !== 'playing') return;

    const emptyCells = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = board[row][col];
        if (cell.value === 0 && !cell.isInitial && !cell.isCorrect) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) return;

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    const newBoard = board.map((r, i) =>
      r.map((cell, j) => {
        if (i === row && j === col) {
          return {
            ...cell,
            value: solution[row][col],
            isCorrect: true,
          };
        }
        return cell;
      })
    );

    setBoard(newBoard);
    setHintsLeft(prev => prev - 1);
    setHighlightedHint({ row, col });

    setTimeout(() => {
      setHighlightedHint(null);
    }, 15000);
  };

  const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
  const seconds = String(elapsedTime % 60).padStart(2, '0');

  return (
    <>
      <Marquee></Marquee>
      <div className="app">
        <h1>LuluDoku</h1>
        <h2 className="timer">
          <span style={{ marginRight: '5px' }}>Time:</span>
          <span className="time-numbers" style={{ fontFamily: 'Audiowide' }}>{minutes}:{seconds}</span>
        </h2>

        <h2>Lives: {lives}</h2>
        {gameStatus === 'won' && <div className="win-message">¡Yass Queen you WON! 🎉</div>}

        <h2 >Remaining Hints: {hintsLeft}</h2>
        <div className='controls'>
          <button onClick={handleHint} disabled={hintsLeft <= 0 || gameStatus !== 'playing'}>
            Get hint
            </button>
        </div> 


        <Board
          board={board}
          highlightedHint={highlightedHint}
          handleCellChange={handleCellChange}
        />

        <Controls onNewGame={handleNewGame} />
        <KoFiButton></KoFiButton>
      </div>
    </>
  );
}

export default App;
