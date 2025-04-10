import { useEffect,useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

const statsToAverage = {
    'b_ba':true,
    'b_obp':true,
    'b_slugging_perc':true,
    'b_onbase_plus_slugging':true,
    'b_onbase_plus_slugging_plus':true,
    'b_rbat_plus':true,
    'p_earned_run_avg':true,
    'p_earned_run_avg_plus':true,
    'p_fip':true,
    'p_whip':true,
    'p_hr_per_nine':true,
    'p_bb_per_nine':true,
    'p_so_per_nine':true,
    'p_win_loss_perc':true

}

export function useFetchTeamStats(teamName){
    useEffect(() => {
        const averageStats = {}
        let numBatters = 0;
        let numPitchers = 0;

        const fetchTeamStats = async () => {
        const playersRef = collection(db,'mlb','data','players')
        const q = query(playersRef,where('team','==',teamName))

        try{
            const querySnapshot = await getDocs(q)

            querySnapshot.forEach(doc => {
                const playerData = doc.data()
                
                const playerPosition = playerData['position']
                if(playerPosition[playerPosition.length-1] === 'P'){
                    numPitchers++
                }
                else{
                    numBatters++
                }

                const currentStats = playerData['stats']['2025'] ? playerData['stats']['2025'] : playerData['stats'] ? playerData['stats'] : {} 
                Object.entries(currentStats).forEach(([statName,stat]) => {
                    if(averageStats[statName]){
                        averageStats[statName] += stat
                    }
                    else{
                        averageStats[statName] = stat
                    }
                })

            })
            Object.keys(averageStats).forEach((avgStatName) => {
                if(statsToAverage[avgStatName]){
                    if(avgStatName[0] === 'b'){
                        averageStats[avgStatName] /= numBatters
                    }
                    else{
                        averageStats[avgStatName] /= numPitchers
                    }
                }
            })

            console.log(averageStats)
        }
        catch(error){
            console.error('Error getting firebase data: ', error)
        }
    }

    fetchTeamStats()

    },[teamName])

}