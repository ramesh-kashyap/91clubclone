import React, { useState } from 'react';

const MyGameRecordList = ({ myBets }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

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

  // Toggle Details Visibility
  const handleToggleDetails = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <>
      {myBets && myBets.length > 0 ? (
        myBets.map((bet, index) => {
          let colorClass = '';

          switch (bet.bet) {
            case "l":
              colorClass = 'big';
              break;
            case "n":
              colorClass = 'small';
              break;
            case 't':
              colorClass = 'violet';
              break;
            case 'd':
              colorClass = 'red';
              break;
            case 'x':
              colorClass = 'green';
              break;
            case '0':
              colorClass = 0;
              break;
            case '5':
              colorClass = 5;
              break;
            default:
              if (Number(bet.bet)) {
                colorClass = bet.bet;
              }
              break;
          }

          return (
            <>
            <div key={index} data-v-2faec5cb="" className="MyGameRecordList__C-item" onClick={() => handleToggleDetails(index)}>
              <div
                data-v-2faec5cb=""
                className={`MyGameRecordList__C-item-l MyGameRecordList__C-item-l-${colorClass}`}
                
              >
                {Number(bet.bet) ? bet.bet
                  : bet.bet === 'l' ? 'Big'
                  : bet.bet === 'n' ? 'Small'
                  : ''
                }
              </div>
              <div data-v-2faec5cb="" className="MyGameRecordList__C-item-m">
                <div data-v-2faec5cb="" className="MyGameRecordList__C-item-m-top">{bet.stage}</div>
                <div data-v-2faec5cb="" className="MyGameRecordList__C-item-m-bottom">{formatDate(bet.time)}</div>
              </div>
              { bet.status !== 0 && (
  <div data-v-2faec5cb="" className={`MyGameRecordList__C-item-r ${bet.status == '1' ? 'success' : 'fail'}`}>
    <div data-v-2faec5cb="" className={bet.status == '1' ? 'success' : 'fail'}>
      {bet.status == '1' ? 'Succeed' : 'Failed'}
    </div>
    <span data-v-2faec5cb="">
      {bet.status == '1' ? `+₹${bet.get}` : `-₹${bet.money}`}
    </span>
  </div>
)}

              {/* Details Section */}
              
            </div>
            <div
            data-v-2faec5cb=""
            className="MyGameRecordList__C-detail"
            style={{ display: expandedIndex === index ? 'block' : 'none' }}
          >
            <div data-v-2faec5cb="" className="MyGameRecordList__C-detail-text">Details</div>
            <div data-v-2faec5cb="" className="MyGameRecordList__C-detail-line">
              <span data-v-2faec5cb="">Order number</span>
              <div data-v-2faec5cb="">{bet.id_product}
                <svg data-v-2faec5cb="" className="svg-icon icon-copy">
                  <use href="#icon-copy"></use>
                </svg>
              </div>
            </div>
            <div data-v-2faec5cb="" className="MyGameRecordList__C-detail-line">
              <span data-v-2faec5cb="">Period</span>
              <div data-v-2faec5cb="">{bet.stage}</div>
            </div>
            <div data-v-2faec5cb="" className="MyGameRecordList__C-detail-line">
              <span data-v-2faec5cb="">Purchase amount</span>
              <div data-v-2faec5cb="">₹{parseFloat(bet.money) + parseFloat(bet.fee)}</div>
            </div>
            <div data-v-2faec5cb="" className="MyGameRecordList__C-detail-line">
              <span data-v-2faec5cb="">Quantity</span>
              <div data-v-2faec5cb="">{(parseFloat(bet.money) + parseFloat(bet.fee)) / parseFloat(bet.amount)}</div>
            </div>
            <div data-v-2faec5cb="" className="MyGameRecordList__C-detail-line">
              <span data-v-2faec5cb="">Amount after tax</span>
              <div data-v-2faec5cb="" className="red">₹{(bet.money).toFixed(2)}</div>
            </div>
            <div data-v-2faec5cb="" className="MyGameRecordList__C-detail-line">
              <span data-v-2faec5cb="">Tax</span>
              <div data-v-2faec5cb="">₹{bet.fee}</div>
            </div>
            <div data-v-2faec5cb="" className="MyGameRecordList__C-detail-line">
              <span data-v-2faec5cb="">Result</span>
              <div data-v-2faec5cb="">
  {/* Result display */}
  <div data-v-2faec5cb="" className="MyGameRecordList__C-inlineB">
    {bet.status === 0 ? `--` : bet.result}
  </div>

  {bet.status !== 0 && (
    <>
      {/* Conditional color and content */}
      <div
        data-v-2faec5cb=""
        className={`MyGameRecordList__C-inlineB
          ${bet.result === 0 ? 'redColor'
            : bet.result === 5 ? 'greenColor'
            : bet.result % 2 === 0 ? 'redColor' : 'greenColor'
          }`}
      >
        {bet.result === 0 ? 'Red'
          : bet.result === 5 ? 'Green'
          : bet.result % 2 === 0 ? 'Red' : 'Green'}
      </div>

      {/* Special cases */}
      {(bet.result === 0 || bet.result === 5) && (
        <div data-v-2faec5cb="" className="MyGameRecordList__C-inlineB purpleColor">
          Violet
        </div>
      )}

      {/* Small or Big */}
      <div
        data-v-2faec5cb=""
        className={`MyGameRecordList__C-inlineB
          ${bet.result < 5 ? 'small' : 'big'}
        `}
      >
        {bet.result < 5 ? 'Small' : 'Big'}
      </div>
    </>
  )}
</div>

            </div>
            <div data-v-2faec5cb="" className="MyGameRecordList__C-detail-line">
              <span data-v-2faec5cb="">Select</span>
              <div data-v-2faec5cb="">{colorClass}</div>
            </div>
            <div data-v-2faec5cb="" className="MyGameRecordList__C-detail-line">
              <span data-v-2faec5cb="">Status</span>
              {
                bet.status !== 0 ? (
              <div data-v-2faec5cb="" className={bet.status == '1' ? 'green' : 'red'}>
                {bet.status == '1' ? 'Succeed' : 'Failed'}
              </div>
                ):
                <div data-v-2faec5cb="" >
                Unpaid
              </div>
        }
            </div>
            <div data-v-2faec5cb="" className="MyGameRecordList__C-detail-line">
              <span data-v-2faec5cb="">Win/lose</span>
              {
                bet.status !== 0 ? (
              <div data-v-2faec5cb="" className={bet.status == '1' ? 'green' : 'red'}>
                {bet.status == '1' ? `+ ₹${bet.get}` : `- ₹${bet.money}`}
              </div>
              ):
<div data-v-2faec5cb="" >
                --
              </div>
            }
            </div>
            <div data-v-2faec5cb="" className="MyGameRecordList__C-detail-line">
              <span data-v-2faec5cb="">Order time</span>
              <div data-v-2faec5cb="">{formatDate(bet.time)}</div>
            </div>
          </div>
          </>
          );
        })
      ) : (
        <div>No bets found.</div>
      )}
    </>
  );
};

export default MyGameRecordList;
