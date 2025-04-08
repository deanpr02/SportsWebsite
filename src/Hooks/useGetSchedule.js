import { useState,useEffect } from 'react'

export function useGetSchedule(league){
    const [schedule,setSchedule] = useState([])

    const fetchMLBSchedule = async () => {
        const fetchedData = await fetch('https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&startDate=2025-03-27&endDate=2025-09-29');
        const jsonData = await fetchedData.json()
        setSchedule(jsonData.dates);
    }

    useEffect(()=>{
        if(league === 'MLB'){
            fetchMLBSchedule();
        }
    },[])

    return { schedule };
}