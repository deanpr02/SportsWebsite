import { useState, useEffect } from 'react';

const POSITIONS = ['C','1B','2B','3B','SS','DH','LF','CF','RF'];

export function useLineup(gameID) {
    const [lineup, setLineup] = useState(undefined);
    const [images, setImages] = useState(undefined);
    const [isLoaded,setIsLoaded] = useState(false)

    useEffect(() => {
        const fetchLineups = async () => {
            setIsLoaded(false)
            try {
                const data = await fetch(`/api/lineup?gameID=${gameID}`);
                if (!data.ok) throw new Error('Network response was not ok');
                const parsedData = await data.json();
                if (parsedData) {
                    setImages(parsedData['images'])
                    setLineup(parsedData['lineups']);
                    setIsLoaded(true)
                } else {
                    generateLineup();
                }
            } catch (error) {
                //If lineup does not exist, generate mock lineup
                generateLineup();
            }
        };

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
                away: generatePlayers(),
                home: generatePlayers()
            };
            setLineup(tempLineup);
        };

        if (gameID) {
            fetchLineups();
        } else {
            generateLineup();
        }

    }, [gameID]);

    return { lineup, setLineup, images, isLoaded };
}
