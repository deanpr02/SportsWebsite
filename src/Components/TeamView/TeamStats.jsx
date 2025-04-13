import { setDefaultEventParameters } from 'firebase/analytics'
import { useFetchTeamStats } from '../../Hooks/useFetchTeamStats'

export default function TeamStats(){
    const {teamStats} = useFetchTeamStats('NYY')
    return(
        <>
            {Object.entries(teamStats).map(([statName,stat]) => {
                return <p>{statName} : {stat}</p>
            })}
        </>
    )
}