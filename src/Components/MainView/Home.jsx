import { useState,useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate,Route,Routes } from 'react-router-dom'
import { auth } from '../../firebase'

import MainMenu from './MainMenu'

export default function Home(){
    const [isAuthenticated,setIsAuthenticated] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        onAuthStateChanged(auth,(user) => {
            if(user){
                setIsAuthenticated(true);
                console.log(user.uid);
            }
            else{
                navigate("/")
                console.log("No user signed in")
            }
        })
    })
    
    return(
        <>
        {isAuthenticated &&
        <Routes>
            <Route path={"/"} element={<MainMenu/>}/>
        </Routes>
        
        }
        </>
    )
} 