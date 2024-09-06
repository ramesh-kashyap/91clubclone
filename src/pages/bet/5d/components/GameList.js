import React from 'react';

const GameList = ({ gamelist }) => {
  // Function to calculate the sum of digits
  const calculateSum = (result) => {
    const resultString = String(result); // Ensure result is a string
    return resultString
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  };

  return (
    <div data-v-4e09079f="" className="GameRecord__C-body">
      {gamelist && gamelist.length > 0 ? (
        gamelist.map((game, index) => {
          // Ensure game.result is a string
          const resultString = String(game.result || '00000');
          const sum = calculateSum(resultString);

          return (
            <div key={index} data-v-9215aba8="" className="van-row">
              <div data-v-9215aba8="" className="van-col van-col--8">
                {game.period}
              </div>
              <div data-v-9215aba8="" className="van-col van-col--12">
                <div data-v-9215aba8="" className="numList">
                  {/* Dynamically render each digit from game.result */}
                  {resultString.split('').map((digit, i) => (
                    <div key={i} data-v-9215aba8="" className="numItem">
                      {digit}
                    </div>
                  ))}
                </div>
              </div>
              <div data-v-9215aba8="" className="van-col van-col--4">
                <span data-v-9215aba8="" className="redNumItem">{sum}</span>
              </div>
            </div>
          );
        })
      ) : (
        <p>Loading game list...</p>
      )}
    </div>
  );
};

export default GameList;
