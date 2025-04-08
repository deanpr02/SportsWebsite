import { useState, useEffect } from 'react'
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '.././firebase'

export function useFetchDatabase(url, params, league, team, dataKey) {
    const [baseData, setBaseData] = useState([])
    const [isBaseLoading, setIsBaseLoading] = useState(true)
    const [baseError, setBaseError] = useState(null)


    useEffect(() => {

        const teamRef = doc(db,league,"teams",team,"teamInfo");

        const fetchFromAPI = async () => {
            const paramString = new URLSearchParams(params).toString()
            const fullUrl = `${url}${paramString ? `?${paramString}` : ''}`
            
            const response = await fetch(fullUrl)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return await response.json()
        }

        const updateFirestore = async (result) => {
            await setDoc(doc(db, league, "teams", team, "teamInfo"), {}, { merge: true });
            try {
                await updateDoc(teamRef, {
                    [dataKey]: result
                })
                console.log("Firestore updated successfully!")
            } catch (firestoreError) {
                console.error("Firestore update failed:",firestoreError)
            }
        }

        const fetchData = async () => {
            setIsBaseLoading(true)
            setBaseError(null)
            try {
                const snapshot = await getDoc(teamRef)
                if(snapshot.exists() && snapshot.data()[dataKey]){
                    setBaseData(snapshot.data()[dataKey])
                }
                else{
                    const result = await fetchFromAPI()
                    setBaseData(result)
                    await updateFirestore(result)
                }
            } catch (error) {
                console.error('Fetch error:', error)
                setBaseError(error)
            } finally {
                setIsBaseLoading(false)
            }
        }

        fetchData()

    }, [url,JSON.stringify(params),league,team,dataKey])

    return { baseData, isBaseLoading, baseError }
}

