import { useState,useEffect } from 'react'

const POSITIONS = ['C','1B','2B','3B','SS','DH','LF','CF','RF']

export function useLineup(){
    const [lineup,setLineup] = useState(undefined)
    
    useEffect(() => {
        const players = [];

        const generateLineup = () => {
            const generatePlayers = () => POSITIONS.map((pos, i) => ({
                name: `Player ${i+1}`,
                position: pos,
                number: i,
                ab: 0,
                h: 0,
                rbi: 0,
                '1b': 0,
                '2b': 0,
                '3b': 0,
                hr: 0,
                so: 0,
                bb: 0
            }));
            const tempLineup = {
                away: generatePlayers().map(player => ({ ...player })),
                home: generatePlayers().map(player => ({ ...player }))
            };
            setLineup(tempLineup);
        }

        generateLineup()
    },[])

    return { lineup,setLineup }
}