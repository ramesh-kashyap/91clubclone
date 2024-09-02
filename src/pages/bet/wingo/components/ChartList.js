import React, { useEffect, useRef } from 'react';

const GameList = ({ gamelist }) => {
  const canvasRefs = useRef([]);

  const drawLines = async () => {
    for (let index = 0; index < gamelist.length - 1; index++) {
      const game = gamelist[index];
      const canvas = canvasRefs.current[index];
      const ctx = canvas.getContext('2d');
      const nextCanvas = canvasRefs.current[index + 1];

      if (!canvas || !nextCanvas) continue;

      // Get the dimensions and position of the current canvas
      const canvasRect = canvas.getBoundingClientRect();

      // Find the start and end elements for the line
      const startElement = canvas.parentElement.querySelector(`.action${game.amount}`);
      const endElement = nextCanvas.parentElement.querySelector(`.action${gamelist[index + 1].amount}`);

      if (startElement && endElement) {
        const startRect = startElement.getBoundingClientRect();
        const endRect = endElement.getBoundingClientRect();

        // Calculate positions relative to the canvas
        const startX = startRect.left + startRect.width / 2 - canvasRect.left;
        const startY = startRect.top + startRect.height / 2 - canvasRect.top;
        const endX = endRect.left + endRect.width / 2 - canvasRect.left;
        const endY = endRect.top + endRect.height / 2 - canvasRect.top;

        // Clear the canvas before drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = "red"; // Customize the color if needed
        ctx.lineWidth = 1; // Customize the width if needed
        ctx.stroke();
      }

      // Await for a small delay to ensure the next drawing sequence is handled properly
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  };

  useEffect(() => {
    const asyncDrawLines = async () => {
      await drawLines();
    };

    asyncDrawLines();
  }, [gamelist]);

  return (
    <div data-v-d485a39d="" className="Trend__C-body2">
      {gamelist && gamelist.length > 0 ? (
        gamelist.map((game, index) => (
          <div key={index} data-v-d485a39d="" issuenumber={game.period} number={game.amount} rowid={index}>
            <div data-v-d485a39d="" className="van-row">
              <div data-v-d485a39d="" className="van-col van-col--8">
                <div data-v-d485a39d="" className="Trend__C-body2-IssueNumber">{game.period}</div>
              </div>
              <div data-v-d485a39d="" className="van-col van-col--16">
                <div data-v-d485a39d="" className="Trend__C-body2-Num">
                  <canvas
                    data-v-d485a39d=""
                    id={`myCanvas${index}`}
                    ref={(el) => (canvasRefs.current[index] = el)}
                    className="line-canvas"
                    style={{ display: index === gamelist.length - 1 ? 'none' : '' }} // Hide the last canvas
                  ></canvas>
                  {[...Array(10).keys()].map(num => (
                    <div key={num} data-v-d485a39d="" className={`Trend__C-body2-Num-item ${num === game.amount ? `action${game.amount}` : ''}`}>
                      {num}
                    </div>
                  ))}
                  <div data-v-d485a39d="" className={`Trend__C-body2-Num-BS ${game.amount >= 5 ? 'isB' : ''}`}>
                    {game.amount >= 5 ? 'B' : 'S'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Loading game list...</p>
      )}
    </div>
  );
};

export default GameList;
