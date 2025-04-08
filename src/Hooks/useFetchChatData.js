import { useState, useEffect } from 'react'
import { doc,getDoc } from 'firebase/firestore'
import { db } from '.././firebase'


export function useFetchChatData(league,chatName) {
    const [chatData, setChatData] = useState([])
    const [isBaseLoading, setIsBaseLoading] = useState(true)
    const [baseError, setBaseError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            setIsBaseLoading(true);
            setBaseError(null);
            try {
                const snapshot = await getDoc(doc(db,league,'archive','chatlogs',chatName));
                const result = snapshot.data();
                setChatData(result);
            } catch (error) {
                console.error('Fetch error:', error)
                setBaseError(error)
            } finally {
                setIsBaseLoading(false)
            }
        }

        fetchData()

    }, [league,chatName])

    return { chatData, isBaseLoading, baseError }
}

