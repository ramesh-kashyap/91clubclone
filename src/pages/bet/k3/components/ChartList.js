import React from 'react';

const ChartList = ({ gamelist }) => {
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

  // Function to check for digit patterns
  const getDigitPatternMessage = (result) => {
    const resultString = String(result);
    const digits = resultString.split('');
    
    // Check for unique digits
    const uniqueDigits = new Set(digits);
    const hasThreeSame = uniqueDigits.size === 1;
    const hasTwoSame = [...uniqueDigits].some(digit => digits.filter(d => d === digit).length === 2);
    
    // Check for consecutive numbers
    const isConsecutive = digits.every((digit, index, arr) => 
      index === 0 || parseInt(digit) === parseInt(arr[index - 1]) + 1
    );

    if (isConsecutive && digits.length === 3) {
      return '3 consecutive numbers';
    } else if (hasThreeSame) {
      return '3 numbers are same';
    } else if (hasTwoSame) {
      return '2 same numbers';
    } else if (uniqueDigits.size === 3) {
      return '3 different numbers';
    }
    return '';
  };

  return (
    <div data-v-4159c83a="" className="Trend__C-body">
      {gamelist && gamelist.length > 0 ? (
        gamelist.map((game, index) => {
          // Calculate the sum of digits from the game result
          const resultString = String(game.result || '000');
          const sum = calculateSum(resultString);
          const digits = [resultString[0] || '0', resultString[1] || '0', resultString[2] || '0'];
          
          // Get the message for digit patterns
          const digitPatternMessage = getDigitPatternMessage(game.result);

          return (
            <div key={index} data-v-4159c83a="" className="van-row">
              <div data-v-4159c83a="" className="van-col van-col--8">
                {game.period}
              </div>
              <div data-v-4159c83a="" className="van-col van-col--6">
                <div data-v-4159c83a="" className="Trend__C-body-premium">
                  <div data-v-4159c83a="" className={`n${digits[0]}`}></div>
                  <div data-v-4159c83a="" className={`n${digits[1]}`}></div>
                  <div data-v-4159c83a="" className={`n${digits[2]}`}></div>
                </div>
              </div>
              <div data-v-4159c83a="" className="van-col van-col--10">
                <div data-v-4159c83a="" className="Trend__C-body-gameText">
                  <span data-v-4159c83a="">{digitPatternMessage}</span>
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

export default ChartList;
