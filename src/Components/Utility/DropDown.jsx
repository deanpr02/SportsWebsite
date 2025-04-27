import { useState } from 'react'

import DownArrow from '../../assets/down-arrow.png'

import './DropDown.css'

export default function DropDown({data,state,setFunc}){
    const DropMenu = () => {
        return(
            <div className='dropdown-menu'>
                {data.map((obj => {
                    return <p className='dropdown-item' 
                                onClick={()=>{
                                    setFunc(obj)
                                    setDropped(false)
                                }}
                            >{obj}</p>
                }))}
            </div>
        )
    }

    const [dropped,setDropped] = useState(false)

    return(
        <div className='dropdown-container'>
            <div className='dropdown' onClick={()=>setDropped((prev) => !prev)}>
                {!dropped ? 
                    <p className='dropdown-text'>{state}</p>
                    :
                    <p className='dropdown-text' style={{opacity:0}}>{state}</p>   
                }
                <img src={DownArrow}/>
            </div>
            {dropped && <DropMenu setFunc={setFunc}/>}
        </div>

    )
}