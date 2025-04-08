import { useState, useEffect } from 'react'
import { doc, updateDoc, getDoc, setDoc, writeBatch, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '.././firebase'

export function useFetchPlayerStats(url, league, playerName) {
    const [playerData, setPlayerData] = useState(undefined)
    const [isBaseLoading, setIsBaseLoading] = useState(true)
    const [baseError, setBaseError] = useState(null)

//mlb/players/{player_name}/profile
    useEffect(() => {


        const fetchFromAPI = async (ref) => {
            const paramString = new URLSearchParams({'ref':ref}).toString()
            const fullUrl = `${url}${paramString ? `?${paramString}` : ''}`
            
            const response = await fetch(fullUrl)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return await response.json()
        }

        const updateFirestore = async (result) => {
            const playerRef = doc(db,league,"data","players",playerName)

            try {
                await updateDoc(playerRef,{about:result['about'],stats:result['stats'],awards:result['awards']})
                console.log("Batch write successful")
            } catch (error) {
                console.error("error performing batch write:",error)
            }
        }

        const fetchFromDatabase = async () => {
            const playerRef = doc(db, league, "data","players",playerName);
            try {
                const playerStats = await getDoc(playerRef);
                return {'stats':playerStats.data()['stats'],
                        'awards':playerStats.data()['awards'],
                        'about':playerStats.data()['about'],
                        'image':playerStats.data()['image-link'],
                        'position':playerStats.data()['position']
                        //add the image and position grab from database here and when i fetch from api, separate dstabase call to get those too
                    }
            } catch (error) {
                console.error("Error retrieving player data:", error);
            }
            return {};
            }
        

        const fetchData = async () => {
            setIsBaseLoading(true)
            setBaseError(null)
            try {
                const snapshot = await getDoc(doc(db,league,"data","players",playerName));
                if(snapshot.exists() && Object.keys(snapshot.data().stats).length > 1){
                    const result = await fetchFromDatabase()
                    setPlayerData(result)
                }
                else{
                    const result = await fetchFromAPI(snapshot.data().ref)
                    await updateFirestore(result)
                    //setPlayerData(result)
                    setPlayerData({
                        'stats':result['stats'],
                        'awards':result['awards'],
                        'about':result['about'],
                        'image':snapshot.data()['image-link'],
                        'position':snapshot.data()['position']
                    })
                }
            } catch (error) {
                console.error('Fetch error:', error)
                setBaseError(error)
            } finally {
                setIsBaseLoading(false)
            }
        }

        fetchData()

    }, [url,league,playerName])

    return { playerData, isBaseLoading, baseError }
}

