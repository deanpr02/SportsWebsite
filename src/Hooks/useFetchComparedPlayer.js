import { useEffect,useState } from 'react'

export function useFetchComparedPlayer(playerID){
    const [playerData,setPlayerData] = useState(undefined)
    const [isLoaded,setIsLoaded] = useState(false)
    
    useEffect(() => {
        const fetchComparedPlayer = async () => {
            setIsLoaded(false)
            if(playerID === null){
                return
            }

            const url = `/api/player_info?id=${playerID}`
            const response = await fetch(url)
            
            if(!response.ok){
                throw new Error('Error fetching compared player')
            }

            const data = await response.json()
            const parsedData = {image: data['image-link'],stats: data['stats']}
            setPlayerData(parsedData)
            setIsLoaded(true)
        }

        fetchComparedPlayer()
    },[playerID])

    return {playerData,isLoaded}
}