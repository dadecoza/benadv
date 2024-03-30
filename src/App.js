import React, { useState, useEffect } from 'react';
import './App.css';
import game from './data.json';
import Room from './components/room';
import Header from './components/header';

function App() {
  const [gameData, setGameData] = useState({});

  useEffect(() => {
    if (Object.keys(gameData).length === 0 || gameData.states.restart === 1) {
      let clone = JSON.parse(JSON.stringify(game));
      setGameData({ ...clone });
    }
  }, [gameData, setGameData]);

  const roomProps = {
    gameData: gameData,
    setGameData: setGameData
  }
  const ready = (Object.keys(gameData).length !== 0);
  return (
    <div className="container">
      <Header props={{gameData: gameData}} />
      {(ready) &&
        <Room props={roomProps} />}
    </div>
  );
}

export default App;
