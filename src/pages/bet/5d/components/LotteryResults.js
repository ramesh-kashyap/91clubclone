import React from 'react';

const LotteryResults = ({ lastResult }) => {
  // Function to calculate the sum of digits
  const calculateSum = (result) => {
    const resultString = String(result); // Ensure result is a string
    return resultString
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  };

  // Get result string and calculate the sum
  const resultString = lastResult?.result || '00000';  // Fallback to '00000' if no result is provided
  const sum = calculateSum(resultString);

  // Letter mapping for the characters (A, B, C, etc.)
  const letters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div data-v-f388b770="" data-v-4f526022="" className="FDP__C">
      <div data-v-f388b770="" className="FDP__C-text">Lottery results</div>
      <div data-v-f388b770="" className="FDP__C-list">
        {resultString.split('').map((digit, index) => (
          <div key={index} data-v-f388b770="">
            <div data-v-f388b770="" className="num">{digit}</div>
            <div data-v-f388b770="" className="letter">{letters[index]}</div>
          </div>
        ))}
      </div>
      <div data-v-f388b770="" className="FDP__C-symbol">=</div>
      <div data-v-f388b770="" className="FDP__C-sum">{sum}</div>
    </div>
  );
};

export default LotteryResults;
