import React from 'react';

const GameList = ({ gamelist }) => {
  return (
    <div>
      {gamelist && gamelist.length > 0 ? (
        gamelist.map((game, index) => (
          <div key={index} data-v-481307ec="" className="van-row">
            <div data-v-481307ec="" className="van-col van-col--8">
              {game.period}
            </div>
            <div data-v-481307ec="" className="van-col van-col--5 numcenter">
              <div
                data-v-481307ec=""
                className={`GameRecord__C-body-num ${
                  game.amount === 0
                    ? 'mixedColor0'
                    : game.amount === 5
                    ? 'mixedColor5'
                    : game.amount % 2 === 0
                    ? 'defaultColor'
                    : 'greenColor'
                }`}
              >
                {game.amount}
              </div>
            </div>
            <div data-v-481307ec="" className="van-col van-col--5">
              <span data-v-481307ec="">
                {game.amount >= 5 ? 'Big' : 'Small'}
              </span>
            </div>
            <div data-v-481307ec="" className="van-col van-col--6">
              <div data-v-481307ec="" className="GameRecord__C-origin">
                {game.amount === 0 ? (
                  <>
                    <div
                      data-v-481307ec=""
                      className="GameRecord__C-origin-I red"
                    ></div>
                    <div
                      data-v-481307ec=""
                      className="GameRecord__C-origin-I violet"
                    ></div>
                  </>
                ) : game.amount === 5 ? (
                  <>
                    <div
                      data-v-481307ec=""
                      className="GameRecord__C-origin-I green"
                    ></div>
                    <div
                      data-v-481307ec=""
                      className="GameRecord__C-origin-I violet"
                    ></div>
                  </>
                ) : game.amount % 2 === 0 ? (
                  <div
                    data-v-481307ec=""
                    className="GameRecord__C-origin-I red"
                  ></div>
                ) : (
                  <div
                    data-v-481307ec=""
                    className="GameRecord__C-origin-I green"
                  ></div>
                )}
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
