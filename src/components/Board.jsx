import React from 'react';
import Cell from './Cell';

const Board = ({
  board,
  highlightedHint,
  handleCellChange,
}) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell.value}
              isInitial={cell.isInitial}
              isIncorrect={cell.isIncorrect}
              isCorrect={cell.isCorrect}
              isHinting={
                highlightedHint?.row === rowIndex &&
                highlightedHint?.col === colIndex
              }
              onChange={(value) => handleCellChange(rowIndex, colIndex, value)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;

