import React from 'react';
import './App.css';
import Graph from './components/graph';

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <Graph width={750} height={750}></Graph>
      </header>
    </div>
  );
}

export default App;
