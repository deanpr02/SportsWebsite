import { useEffect,useState } from 'react'

export function usePlayerNames(){
    const [playerNameList,setPlayerNameList] = useState({})

    useEffect(() => {
        const fetchNames = async () => {
            const response = await fetch('/api/player_names')
            if(!response.ok){
                throw new Error('Error getting player names from database')
            }

            const names = await response.json()
            setPlayerNameList(names)
        }

        fetchNames()
    },[])
    
    return {playerNameList}
}