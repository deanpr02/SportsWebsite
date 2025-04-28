import { useState, useRef } from 'react'

import HomePlate from '../../assets/mlb-resources/mlb-homeplate.jpg'

import './GameSimulation.css'

export default function GameSimulation() {

    const [strikeCount,setStrikeCount] = useState(0)
    const [ballCount,setBallCount] = useState(0)
    const [strikes, setStrikes] = useState([])
    const [balls, setBalls] = useState([])
    const strikeZoneRef = useRef(null)  

    const handlePitchClick = (event) => {
        const homePlate = event.currentTarget
        const homePlateRect = homePlate.getBoundingClientRect()
        const strikeZoneRect = strikeZoneRef.current.getBoundingClientRect()

        // Calculate click position relative to home plate
        const relativeX = event.clientX - homePlateRect.left
        const relativeY = event.clientY - homePlateRect.top

        // Calculate strike zone boundaries relative to home plate
        const strikeZoneLeft = strikeZoneRect.left - homePlateRect.left
        const strikeZoneRight = strikeZoneLeft + strikeZoneRect.width
        const strikeZoneTop = strikeZoneRect.top - homePlateRect.top
        const strikeZoneBottom = strikeZoneTop + strikeZoneRect.height

        // Check if click is within strike zone boundaries
        if (relativeX >= strikeZoneLeft && 
            relativeX <= strikeZoneRight &&
            relativeY >= strikeZoneTop &&
            relativeY <= strikeZoneBottom) {
                setStrikes(prev => [...prev, { x: relativeX, y: relativeY }])
        } else {
            setBalls(prev => [...prev, { x: relativeX, y: relativeY }])
        }
    }

    return(
    <div className='game-simulation-container'>
        <div className='simulation-homeplate' style={{ backgroundImage:`url(${HomePlate})` }} onClick={handlePitchClick}>
            {strikes.map((strike, index) => (
                <Strike key={`strike-${index}`} x={strike.x} y={strike.y} />
            ))}
            {balls.map((ball, index) => (
                <Ball key={`ball-${index}`} x={ball.x} y={ball.y} />
            ))}
            <div className='simulation-strikezone' ref={strikeZoneRef}></div>
        </div>
    </div>
    )
}

function Strike({ x, y }) {
  const offset = 1.5 // 3vh / 2

  return(
    <div 
      className='simulation-strike' 
      style={{
        left: `calc(${x}px - ${offset}vh)`,
        top: `calc(${y}px - ${offset}vh)`
      }}
    >
      <p>X</p>
    </div>
  )
}

function Ball({ x, y }) {
  const offset = 1.5 // 3vh / 2

  return(
    <div 
      className='simulation-ball' 
      style={{
        left: `calc(${x}px - ${offset}vh)`,
        top: `calc(${y}px - ${offset}vh)`
      }}
    >
      <p>B</p>
    </div>
  )
}
