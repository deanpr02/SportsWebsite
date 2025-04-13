import { useState,useEffect } from 'react'

export function useMousePosition(){
    const [mousePos,setMousePos] = useState({x: 0,y: 0})

    useEffect(() => {
        const updateMousePosition = (event) => {
            setMousePos({ x: event.clientX, y: event.clientY });
        };
        
        window.addEventListener('mousemove',updateMousePosition)

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    },[])

    return mousePos
}