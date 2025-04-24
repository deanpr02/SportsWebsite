import { useState,useEffect } from 'react'

export function useDatabase(url,params){
    const [dataObj,setDataObj] = useState(undefined)
    const [isLoading,setIsLoading] = useState(true)

    useEffect(() => {
        const fetchFromDatabase = async () => {
            const paramString = new URLSearchParams(params).toString()

            const response = await fetch(`${url}?${paramString}`)
            if(!response.ok){
                throw new Error('Error!')
            }
            const data = await response.json()
            setDataObj(data)
            setIsLoading(false)
        }

        fetchFromDatabase()
    },[JSON.stringify(params)])

    return { dataObj,isLoading }
}