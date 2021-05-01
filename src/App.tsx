import { useEffect, useState } from 'react';
import './App.css';
import Graph from './components/graph';

const App = () => {
    let [chosenPoints, setChosenPoints] = useState<{x: number, y: number}[]>([]);

    const choosePoint = (point: {x: number, y: number}) => {
        setChosenPoints(prev => {
            if (prev.some(p => p.x === point.x && p.y === point.y)) {
                return prev;
            }
            if (!!prev[1]) {
                return [prev[1], point];
            } else if (!!prev[0]) {
                return [prev[0], point];
            } else {
                return [point];
            }
        });
    };

    useEffect(() => {

    }, [chosenPoints]);

    return (
        <div className="App">
            <div className="Info">
                <p>
                    This is a tool to visualize Elliptic Curve cryptography.
                </p>
                <p>
                    The strength of Elliptic Curve cryptography is in the fact that it is very easy to perform N actions on an EC for a given starting point to find an ending point, but is extremely difficult to figure out N given those two points.
                </p>
                <p>
                    Try selecting a number of actions, as well as two base points (for simplicity), to begin simulating EC cryptography and find your public key!
                </p>
                {chosenPoints.length >= 1 &&
                    <p>
                        <b>Point A:</b> ({chosenPoints[0].x}, {chosenPoints[0].y})
                    </p>
                }
                {chosenPoints.length === 2 &&
                    <>
                        <p>
                            <b>Point B:</b> ({chosenPoints[1].x}, {chosenPoints[1].y})
                        </p>
                        <button>Simulate!</button>
                    </>
                }
            </div>
            <header className="App-header">
                <Graph width={750} height={750} choosePoint={choosePoint}/>
            </header>
        </div>
    );
}

export default App;
