import { useState, useEffect } from 'react'

export function useFetchData(url, params, keyWord) {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const paramString = new URLSearchParams(params).toString()
            const fullUrl = `${url}${paramString ? `?${paramString}` : ''}`
            try {
                const response = await fetch(fullUrl)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const result = await response.json()
                setData(result)
                console.log(result)
                if(Object.keys(result).length > 0){
                    window.sessionStorage.setItem(keyWord,JSON.stringify(result))
                }
                    //console.log(result)
            } catch (error) {
                if (error instanceof TypeError) {
                    console.log('Network or CORS error: ' + error.message)
                } else {
                    console.log('Fetch error: ' + error.message)
                }
                setError(error)
            } finally {
                setIsLoading(false)
            }
        }
        /*info = JSON.parse(sessionStorage.getItem('team'));
            setTeamInfo(info);
        }
        else{
            sessionStorage.setItem('team',JSON.stringify(teamObject));
            setTeamInfo(teamObject) */
        const storedData = JSON.parse(window.sessionStorage.getItem(keyWord))
        if(storedData !== null){
            setData(()=>storedData)
            setIsLoading(false)
            console.log("Retrieved from session storage!")
        }
        else{
            fetchData()
            //window.sessionStorage.setItem(keyWord,JSON.stringify(data))
            console.log("Fetched data!")
        }
    }, [url,JSON.stringify(params)])
    return { data, isLoading, error }
}
