// Default States (Initializer)
if (localStorage.getItem("snowTheme") === null){
    localStorage.setItem("snowTheme", "true")
}

// Dynamic footer positioning
const footer = document.getElementById("footer")

function isPageOverflowing() {
    return document.documentElement.scrollHeight > window.innerHeight;
}

function updateFooterPosition() {
    if (isPageOverflowing()) {
        footer.style.position = "relative"
        console.log("overflowed")
    }
    else{
        footer.style.position = "fixed"
        console.log("not overflowing")
    }
}

updateFooterPosition();
window.addEventListener("resize", updateFooterPosition);


// Snow toggle
const snow = document.getElementsByClassName("snow")[0]
const toggleButton = document.getElementsByClassName("snow-toggle")[0]

snow.style.display = (localStorage.getItem("snowTheme") === "true") ? "block" : "none"
toggleButton.style.color = (localStorage.getItem("snowTheme") === "true") ? "var(--text-primary)" : "var(--secondary)"
function snowToggleHandler(){
    console.log(localStorage.getItem("snowTheme"))
    // If set to snow theme
    if (localStorage.getItem("snowTheme") === "true"){
        // turn it off
        localStorage.setItem("snowTheme", "false")
        snow.style.display = "none"
        toggleButton.style.color = "var(--secondary)"
    }
    else{
        localStorage.setItem("snowTheme", "true")
        snow.style.display = "block"
        toggleButton.style.color = "var(--text-primary)"
    }
}




function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = [
    { label: "year", sec: 31536000 },
    { label: "month", sec: 2592000 },
    { label: "day", sec: 86400 },
    { label: "hour", sec: 3600 },
    { label: "minute", sec: 60 },
    { label: "second", sec: 1 }
  ];

  for (const i of intervals) {
    const count = Math.floor(seconds / i.sec);
    if (count >= 1) return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
  }
  return "Just now";
}

// Fetch recent devlogs - flavourtown
const devlogArea = document.getElementsByClassName("devlog-area")[0]
const devlogTimestampArea = document.getElementsByClassName("devlog-timestamp-area")[0]
async function getFlavourTownDevlogs(){
    const url = 'https://backend.natdrone101.workers.dev/api/v1/flavourtown'
    try{
        const response = await fetch (url)
        
        if (!response.ok){
            return "Failed to fetch devlogs..."
        }
        const result = await response.json()
        return result
        
    }
    catch(error){
        return "Failed to fetch devlogs... " + error.message
    }

}

async function updateDevlogArea(){
    const jsonContent = await getFlavourTownDevlogs()
    const devlogBody = jsonContent.devlogs[0].body   
    devlogArea.innerHTML = `"${devlogBody} "`

    // Calculate time elapsed
    const elapsedTime = timeSince(new Date(jsonContent.devlogs[0].updated_at))

    devlogTimestampArea.innerHTML = elapsedTime
}
updateDevlogArea()



// Fetch from hackatime api https://backend.natdrone101.workers.dev/api/v1/hackatime
async function getHackatimeJSON(){
    const url = 'https://backend.natdrone101.workers.dev/api/v1/hackatime/'
    try{
        const response = await fetch (url)
        
        if (!response.ok){
            return "Failed to fetch devlogs..."
        }
        const result = await response.json()
        return result
        
    }
    catch(error){
        return "Failed to fetch devlogs... " + error.message
    }

}

async function updateHackatimeCard(){
    const jsonContentHackatime = await getHackatimeJSON()
    console.log(jsonContentHackatime)
}

updateHackatimeCard()

