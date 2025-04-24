import { useEffect,useState } from 'react'

export function usePlayerNames(pos){
    const [playerNameList,setPlayerNameList] = useState({})

    useEffect(() => {
        const fetchNames = async () => {
            const url = `/api/player_names?pos=${pos}`
            const response = await fetch(url)
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