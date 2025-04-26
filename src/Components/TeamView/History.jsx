import { useDatabase } from "../../Hooks/useDatabase"

import './History.css'

export default function History(){
    const { dataObj, isLoading } = useDatabase('/api/team_history',{'name':'NYY'})

    return(
        <>
        {dataObj &&
            <HistoricTable data={dataObj['results']}/>
        }
        </>
    )
}


function HistoricTable({data}){
    return(
        <div className='historic-table-container'>
            <HistoricTableLabel/>
            {[...data].reverse().map((season) => {
                return(
                    <div key={season.year} className='historic-table-row'>
                        <div className='historic-table-section'><p>{season.year}</p></div>
                        <div className='historic-table-section'><p>{season.wins}</p></div>
                        <div className='historic-table-section'><p>{season.losses}</p></div>
                        <div className='historic-table-section'><p>{season.rank}</p></div>
                        <div className='historic-table-section'><p>{season.finish}</p></div>
                    </div>
                )
            })}
        </div>
    )
}

function HistoricTableLabel(){
    return(
        <div className='historic-table-label'>
            <div className='historic-table-section'><p>Year</p></div>
            <div className='historic-table-section'><p>Wins</p></div>
            <div className='historic-table-section'><p>Losses</p></div>
            <div className='historic-table-section'><p>Division Finish</p></div>
            <div className='historic-table-section'><p>Result</p></div>
        </div>
    )
}