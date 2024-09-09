import React from 'react';

const MyGameRecordList = ({ myBets }) => {
  // Format Date Function
  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Function to determine the display value and class for bet.bet
  const getBetDisplayAndClass = (bet) => {
    let displayValue = bet.bet;
    let className = "num";

   
      if (bet.bet === 'l') {
        displayValue = 'Odd';
        className = 'O';
      } else if (bet.bet === 'c') {
        displayValue = 'Even';
        className = 'E';
      } else if (bet.bet === 's') {
        displayValue = 'Small';
        className = 'L';
      } else if (bet.bet === 'b') {
        displayValue = 'Big';
        className = 'H';
      }
    

    return { displayValue, className };
  };

  return (
    <>
      {myBets && myBets.length > 0 ? (
        myBets.map((bet, index) => {
          const formattedDate = formatDate(bet.time); // Assuming `bet.time` is available
          const { displayValue, className } = getBetDisplayAndClass(bet); // Get the display value and class based on bet.bet

          return (
            <div key={index} data-v-2faec5cb="" className="MyGameRecordList__C-item">
              {/* Left Side - Game Info */}
              <div
                data-v-a5ef3154=""
                className={`MyGameRecordList__C-item-l MyGameRecordList__C-item-l-${className}`}
              >
                {displayValue} 
              </div>

              {/* Middle - Date and Time */}
              <div data-v-a5ef3154="" className="MyGameRecordList__C-item-m">
                <div data-v-a5ef3154="" className="MyGameRecordList__C-item-m-top">
                  {bet.stage}
                </div>
                <div data-v-a5ef3154="" className="MyGameRecordList__C-item-m-bottom">
                  {formattedDate}
                </div>
              </div>

              {/* Right Side - Status and Amount */}
              { bet.status !== 0 && (
              <div data-v-a5ef3154="" className={`MyGameRecordList__C-item-r ${bet.status == '1' ? 'success' : ''}`}>
                <div data-v-a5ef3154=""> {bet.status == '1' ? 'Succeed' : 'Failed'}</div>
                <span data-v-a5ef3154="">
                  {bet.status == '1' ? `+₹${bet.get}` : `-₹${bet.money}`}
                </span>
              </div>
              )}
            </div>
          );
        })
      ) : (
        <div>No bets found.</div>
      )}
    </>
  );
};

export default MyGameRecordList;
