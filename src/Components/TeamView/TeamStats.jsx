import { useFetchTeamStats } from '../../Hooks/useFetchTeamStats'

export default function TeamStats(){
    const teamStats = useFetchTeamStats('NYY')
    return(
        <>
            <p>Team Stats</p>
        </>
    )
}