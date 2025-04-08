import { collection, query, where, getAggregateFromServer, average } from 'firebase/firestore'
import { db } from '.././firebase'
import { useState,useEffect } from 'react' 

export function useGetAverageStat(league,year,statList){
    const [averageStats,setAverageStat] = useState(undefined)
    console.log(statList)
    useEffect(()=>{

        const createBatches = () => {
            const batchSize = 5;
            const batches = [];

            for(let i = 0; i < statList.length; i += batchSize){
                batches.push(statList.slice(i,i+batchSize));
            }

            return batches
        }


        const calculateAverage = async () => {
            const playerColl = collection(db,league,'data','players');

            const statBatches = createBatches();
            let result = {}
            for(const batch of statBatches){
                const q = query(playerColl);
                const aggregates = {};
                batch.forEach(stat => {
                    aggregates[stat] = average(`stats.${year}.${stat}`)
                });

                const snapshot = await getAggregateFromServer(q,aggregates);
                result = {...result,...snapshot.data()};
            }
            
            setAverageStat(result)
            console.log(result)
            //console.log(`Average: ${result}`)
        }
        calculateAverage();
    },[league,year,statList])

    return {averageStats}
}