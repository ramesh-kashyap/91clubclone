import React from 'react';

const GameList = ({ gamelist }) => {
  // Function to calculate the sum of digits
  const calculateSum = (result) => {
    const resultString = String(result); // Ensure result is a string
    return resultString
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  };

  // Determine if the sum is "Big" or "Small"
  const isBig = (sum) => sum > 10 ? 'Big' : 'Small';
  // Determine if the sum is "Odd" or "Even"
  const isOdd = (sum) => sum % 2 === 0 ? 'Even' : 'Odd';

  return (
    <div data-v-4e09079f="" className="GameRecord__C-body">
      {gamelist && gamelist.length > 0 ? (
        gamelist.map((game, index) => {
          // Ensure game.result is a string with at least 3 characters
          const resultString = String(game.result || '000');
          const sum = calculateSum(resultString);
          // Handle cases where resultString might be shorter than 3 characters
          const digits = [resultString[0] || '0', resultString[1] || '0', resultString[2] || '0'];
          
          return (
            <div key={index} data-v-4e09079f="" className="van-row">
              <div data-v-4e09079f="" className="van-col van-col--8">
                {game.period}
              </div>
              <div data-v-4e09079f="" className="van-col van-col--1">
                <span data-v-4e09079f="">{sum}</span>
              </div>
              <div data-v-4e09079f="" className="van-col van-col--4">
                <span data-v-4e09079f="">{isBig(sum)}</span>
              </div>
              <div data-v-4e09079f="" className="van-col van-col--4">
                <span data-v-4e09079f="">{isOdd(sum)}</span>
              </div>
              <div data-v-4e09079f="" className="van-col van-col--6">
                <div data-v-4e09079f="" className="GameRecord__C-body-premium">
                  <div data-v-4e09079f="" className={`n${digits[0]}`}></div>
                  <div data-v-4e09079f="" className={`n${digits[1]}`}></div>
                  <div data-v-4e09079f="" className={`n${digits[2]}`}></div>
                </div>
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
