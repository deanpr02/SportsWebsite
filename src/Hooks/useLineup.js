import { useState,useEffect } from 'react'

const POSITIONS = ['C','1B','2B','3B','SS','DH','LF','CF','RF']

export function useLineup(){
    const [lineup,setLineup] = useState(undefined)
    
    useEffect(() => {
        const players = [];

        const generateLineup = () => {
            POSITIONS.forEach((pos,i) => {
                players.push({name:`Player: ${i+1}`,position:pos,number:i});
            })

            const tempLineup = {}
            tempLineup['away'] = [...players];
            tempLineup['home'] = [...players];
            setLineup(tempLineup);
        }

        generateLineup()
    },[])

    return { lineup }
}