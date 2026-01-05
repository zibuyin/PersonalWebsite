async function cardClickHandler(id){
    const url = 'https://backend.natdrone101.workers.dev/api/v1/projectViews'
    try{
        const response = await fetch(url)
        const result = response.json
    }
    catch(error){
        console.log(error.message)
    }
}