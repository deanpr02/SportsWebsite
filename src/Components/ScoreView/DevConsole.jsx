import './DevConsole.css'

export default function DevConsole({setStrikes,setBalls,setOuts,setInning,setInningHalf,setCanAdvance,setBases,setHomeScore,setAwayScore,setHalfRuns,setLineup,setLineupIndices,lineup,lineupIndices,bases,inningHalf,outs,canAdvance}){
    const addStrike = () => {
        if(outs < 3){
            setStrikes((prev) => prev+1)
        }
    }

    const addBall = () => {
        if(outs < 3){
            setBalls((prev) => prev+1)
        }
    }

    const incrementInning = () => {
        if (canAdvance) {
            setBases([]);
            setOuts(0);
            setCanAdvance(false);
            setHalfRuns(0);
            if(inningHalf == -1){
                setInning((prevInning) => prevInning+1)
            }
            setInningHalf((prevHalf) => prevHalf*-1)
        }
    }

    const resetGame = () => {
        setBalls(0);
        setStrikes(0);
        setOuts(0);
        setHomeScore(0);
        setAwayScore(0);
        setBases([]);
        setInningHalf(1);
        setInning(1);
        setCanAdvance(false);
    }

    const updateBases = (value) => {
        const newBases = []
        let newScore = 0
        bases.forEach((base,i) => {
            if(base.bases + value < 4){
                newBases.push({bases:base.bases+value})
            }
            else{
                newScore += 1
            }
        })
        return {newBases,newScore}
    }

    const updateLineup = (half,index,runners,isOut) => {
        const newLineup = {...lineup}
        const newIndices = {...lineupIndices}

        if(isOut){
            newLineup[half][lineupIndices[half]][index] += 1
            newIndices[half] = newIndices[half]+1 >= 9 ? 0 : newIndices[half]+1
        }
        else{
            newLineup[half][lineupIndices[half]]['h'] += 1
            newLineup[half][lineupIndices[half]]['rbi'] += runners
            newLineup[half][lineupIndices[half]][index] += 1
            newIndices[half] = newIndices[half]+1 >= 9 ? 0 : newIndices[half]+1
        }
        newLineup[half][lineupIndices[half]]['ab'] += 1

        setLineupIndices(newIndices)
        setLineup(newLineup)
        
    }

    const hitSingle = () => {
        if(outs < 3){
            setStrikes(0)
            setBalls(0)
            const baseObj = {bases:1}

            const {newBases,newScore} = updateBases(1);

            if(inningHalf == 1){
                setAwayScore((prev) => prev+newScore)
                updateLineup('away','1b',newScore,false)
            }
            else{
                setHomeScore((prev) => prev+newScore)
                updateLineup('home','1b',newScore,false)
            }
            setHalfRuns((prevRuns) => prevRuns + newScore)

            newBases.push(baseObj)
            setBases(newBases);
    }
    }

    const hitDouble = () => {
        if(outs < 3){
            setStrikes(0)
            setBalls(0)
            const baseObj = {bases:2}

            const {newBases,newScore} = updateBases(2);

            if(inningHalf == 1){
                setAwayScore((prev) => prev+newScore)
                updateLineup('away','2b',newScore,false)
            }
            else{
                setHomeScore((prev) => prev+newScore)
                updateLineup('home','2b',newScore,false)
            }
            setHalfRuns((prevRuns) => prevRuns + newScore)

            newBases.push(baseObj)
            setBases(newBases)
    }
    }

    const hitTriple = () => {
        if(outs < 3){
            setStrikes(0)
            setBalls(0)
            const baseObj = {bases:3}

            const {newBases,newScore} = updateBases(3);

            if(inningHalf == 1){
                setAwayScore((prev) => prev+newScore)
                updateLineup('away','3b',newScore,false)
            }
            else{
                setHomeScore((prev) => prev+newScore)
                updateLineup('home','3b',newScore,false)
            }
            setHalfRuns((prevRuns) => prevRuns + newScore)

            newBases.push(baseObj)
            setBases(newBases)
        }
    }

    const hitHomeRun = () => {
        if(outs < 3){
            setStrikes(0)
            setBalls(0)
            const {newBases,newScore} = updateBases(4);

            if(inningHalf == 1){
                setAwayScore((prev) => prev+newScore+1)
                updateLineup('away','hr',newScore+1,false)
            }
            else{
                setHomeScore((prev) => prev+newScore+1)
                updateLineup('home','hr',newScore+1,false)
            }
            setHalfRuns((prevRuns) => prevRuns + newScore + 1)

            setBases(newBases)
        }
    }

    const groundOut = () => {
        if(outs < 3){
            setStrikes(0)
            setBalls(0)
            setOuts((prev) => prev+1)
        }
    }

    const flyOut = () => {
        if(outs < 3){
            setStrikes(0)
            setBalls(0)
            setOuts((prev) => prev+1)
        }

    }

    return(
        <div className='dev-console'>
            <p>Development Console</p>
            <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap'}}>
                <DevButton text={"Reset"} handleClick={resetGame}/>
                <DevButton text={"Add Strike"} handleClick={addStrike}/>
                <DevButton text={"Add Ball"} handleClick={addBall}/>
                <DevButton text={"Next Inning"} handleClick={incrementInning}/>
                <DevButton text={"Single"} handleClick={hitSingle}/>
                <DevButton text={"Double"} handleClick={hitDouble}/>
                <DevButton text={"Triple"} handleClick={hitTriple}/>
                <DevButton text={"Homerun"} handleClick={hitHomeRun}/>
                <DevButton text={"Ground Out"} handleClick={groundOut}/>
                <DevButton text={"Fly Out"} handleClick={flyOut}/>
            </div>
        </div>
    )
}

function DevButton({text,handleClick}){


    return(
        <div className='dev-button' onClick={handleClick}>
            <p>{text}</p>
        </div>
    )
}