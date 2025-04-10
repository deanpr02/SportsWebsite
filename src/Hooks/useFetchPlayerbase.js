import { useState, useEffect } from 'react'
import { collection, query, where, getDocs,limit } from 'firebase/firestore'
import { db } from '.././firebase'

export function useFetchPlayerbase(url, params, league,team) {
    const [baseData, setBaseData] = useState([])
    const [isBaseLoading, setIsBaseLoading] = useState(true)
    const [baseError, setBaseError] = useState(null)

//mlb/players/{player_name}/profile
    useEffect(() => {


        //const fetchFromAPI = async () => {
        //    const paramString = new URLSearchParams(params).toString()
        //    const fullUrl = `${url}${paramString ? `?${paramString}` : ''}`
        //    
        //    const response = await fetch(fullUrl)
        //    if (!response.ok) {
        //        throw new Error(`HTTP error! status: ${response.status}`)
        //    }
        //    return await response.json()
        //}

        //const updateFirestore = async (result) => {
        //    const batch = writeBatch(db)
        //    const roster = []
        //    Object.entries(result).forEach(([playerName,player]) =>{
        //        const playerRef = doc(db,league,"data","players",playerName)
        //        batch.set(playerRef,{stats:{"2024":player.stats},ref:player.ref,position:player.position},{merge:true})
        //        roster.push(playerName)
        //    });
//
        //    try {
        //        await batch.commit();
        //        await setDoc(doc(db, league, 'teams',team, "roster"), {players: roster});
        //        console.log("Batch write successful")
        //    } catch (error) {
        //        console.error("error performing batch write:",error)
        //    }
        //}

        //const fetchPlayerImages = async (playerObjects) => {
        //    const players = {}
        //    const batchSize = 10;
        //    for (let i = 0; i < Object.keys(playerObjects).length; i += batchSize) {
        //    const batch = Object.keys(playerObjects).slice(i,i+batchSize);
        //    const playersRef = collection(db, league, "data","players");
        //    const q = query(playersRef, where("__name__", "in", batch));
        //    
        //    try {
        //        const querySnapshot = await getDocs(q);
        //        querySnapshot.forEach((doc) => {
        //            console.log(doc.id)
        //        const playerData = doc.data();
        //        players[doc.id] = {
        //            image: playerData["image-link"],
        //            stats: {'2024':playerObjects[doc.id]['stats']},
        //            position: playerObjects[doc.id]['position']
        //        };
        //        });
        //    } catch (error) {
        //        console.error("Error retrieving player data:", error);
        //    }
        //    }
        //
        //    return players;
        //}
//
//
        //const fetchFromDatabase = async (roster) => {
        //    const players = {}
        //    const batchSize = 10;
        //    for (let i = 0; i < roster.length; i += batchSize) {
        //    const batch = roster.slice(i, i + batchSize);
        //    const playersRef = collection(db, league, "data","players");
        //    const q = query(playersRef, where("__name__", "in", batch));
        //    
        //    try {
        //        const querySnapshot = await getDocs(q);
        //        querySnapshot.forEach((doc) => {
        //        const playerData = doc.data();
        //        players[doc.id] = {
        //            image: playerData["image-link"],
        //            stats: playerData["stats"],
        //            position: playerData["position"]
        //        };
        //        });
        //    } catch (error) {
        //        console.error("Error retrieving player data:", error);
        //    }
        //    }
        //
        //    return players;
//}
        

        //const fetchData = async () => {
        //    setIsBaseLoading(true)
        //    setBaseError(null)
        //    try {
        //        const snapshot = await getDoc(doc(db,league,"teams",team,"roster"));
        //        if(snapshot.exists() && snapshot.data().players){
        //            const result = await fetchFromDatabase(snapshot.data().players)
        //            setBaseData(result)
        //        }
        //        else{
        //            const result = await fetchFromAPI()
        //            await updateFirestore(result)
        //            const players = await fetchPlayerImages(result)
        //            setBaseData(players)
        //        }
        //    } catch (error) {
        //        console.error('Fetch error:', error)
        //        setBaseError(error)
        //    } finally {
        //        setIsBaseLoading(false)
        //    }
        //}
//
        //fetchData()

        const fetchPlayersByTeam = async () => {
            const players = {}
            const playersRef = collection(db,league,'data','players')
            const q = query(
                playersRef,
                where('team','==',team),
                limit(1000)
            )

            try{
                const querySnapshot = await getDocs(q)
                querySnapshot.forEach((doc) => {
                    const playerData = doc.data()
                    players[doc.id] = {
                        image: playerData['image-link'],
                        stats: {'2025': playerData['stats']} || {},
                        position: playerData['position'],
                        team: playerData['team']
                    }
                })
                return players
            } catch(error) {
                console.error('Error retrieving player data: ',error)
                throw error
            }
        }

        const fetchData = async () => {
            setIsBaseLoading(true)
            setBaseError(null)
            try{
                const result = await fetchPlayersByTeam()
                setBaseData(result)
            } catch(error){
                console.error('Fetch error: ',error)
                setBaseError(error)
            } finally{
                setIsBaseLoading(false)
            }
        }

        fetchData()

    }, [league,team])

    return { baseData, isBaseLoading, baseError }
}

