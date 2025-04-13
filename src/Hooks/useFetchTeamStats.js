import { useEffect,useState } from 'react'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

export function useFetchTeamStats(teamName){
    const [teamStats,setTeamStats] = useState({})

    useEffect(() => {

        const fetchTeamStats = async () => {
            const teamRef = doc(db,'mlb','data','teams',teamName)

            try{
                const querySnapshot = await getDoc(teamRef)

                const teamStats = querySnapshot.data()['averageStats']
                setTeamStats(teamStats)
            } catch(error){
                console.error("Error getting average stats: ",error)
            }
}

    fetchTeamStats()

    },[teamName])

    return {teamStats}
}