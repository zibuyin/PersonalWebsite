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
    const url = 'https://backend.natdrone101.workers.dev/api/v1/hackatime/users/nathan/stats'
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


// All graph colors
// Dark theme with purple, pink, and blue palette

const GRAPH_COLORS = [
  '#F45EFF', // Primary magenta
  '#3A86FF', // Bright blue
  '#A198F4', // Primary blue
  '#FF006E', // Deep pink
  '#8338EC', // Electric purple
  '#00D9FF', // Cyan
  '#C77DFF', // Medium purple
  '#7209B7', // Bright purple
  '#00B4D8', // Sky blue
  '#DA70D6', // Orchid
  '#FF6EC7', // Hot pink
  '#5A189A', // Deep purple
  '#E0AAFF', // Light purple
  '#B744FF', // Vibrant purple
  '#0096C7', // Ocean blue
  '#560BAD', // Dark purple
  '#D0ADFF', // Pale purple
  '#B8DAFF', // Sky lavender
  '#FF10F0', // Hot fuchsia
  '#6A4C93', // Muted purple
  '#0077B6', // Deep blue
  '#C7D9F7', // Light lavender
  '#FB5607', // Coral
  '#FFBE0B', // Warm gold
  '#A8D8FF', // Soft blue
  '#FF9500', // Amber
  '#FFB703', // Gold
  '#03045E', // Navy
  '#E8B4FF', // Light magenta
  '#0096FF', // Vivid blue
];


const totalTimeArea =  document.getElementsByClassName("total-time-area")[0]
const graphWrapper = document.getElementsByClassName("hackatime-graph-wrapper")[0]
const graphLegendWrapper = document.getElementsByClassName("hackatime-graph-legend-wrapper")[0]
let NUMBER_OF_MAX_LANG = 7
let total_others_percentage = -1.0

function generateGraphLegend(currentColor, language){
    // The small wrapper around each legend
    const legendComponentWrapper = document.createElement("div")
    legendComponentWrapper.className = "hackatime-graph-legend-component-wrapper"
    
    // The circle with has the same color as the bar its representing
    const graphLegendIcon = document.createElement("i")
    graphLegendIcon.className = "fa-solid fa-circle hackatime-graph-legend-icon"
    graphLegendIcon.style.color = currentColor

    // The langauge label
    const graphLegendText = document.createElement("p")
    graphLegendText.className = "hackatime-graph-legend-text"
    graphLegendText.innerText = language

    legendComponentWrapper.appendChild(graphLegendIcon)
    legendComponentWrapper.appendChild(graphLegendText)
    graphLegendWrapper.appendChild(legendComponentWrapper)
}

async function updateHackatimeCard(){
    const jsonContentHackatime = await getHackatimeJSON()
    console.log(jsonContentHackatime)
    console.log(jsonContentHackatime.data.human_readable_total)
    totalTimeArea.innerHTML = "Total Coding Time: " + jsonContentHackatime.data.human_readable_total
   
    // Generate hackatime graph
    // Get the list of languages
    const jsonlanguages = jsonContentHackatime.data.languages
    const numberOfLanguages = jsonlanguages.length
    // debug
    console.log("NO"+ numberOfLanguages)

    // Generate a stripe for each language
    for (let i = 0; i < NUMBER_OF_MAX_LANG; i++){
        // Ignore the "Other" tab, and append the percentage to the Other we are using
        if (jsonlanguages[i].name === "Other"){
            // Display one more to fill up the slot
            NUMBER_OF_MAX_LANG += 1
            // Add this to the real "Other" component that I am using
            total_others_percentage += jsonlanguages[i].percent
        }
        else{
            const newGraphComponent = document.createElement("div")
            newGraphComponent.className = "hackatime-graph-component"
            newGraphComponent.style.flex = jsonlanguages[i].percent 
            let currentColor = GRAPH_COLORS[i]
            newGraphComponent.style.backgroundColor = currentColor
            console.log(jsonlanguages[i])
            graphWrapper.appendChild(newGraphComponent)

            // Generate the legend for each language
            generateGraphLegend(currentColor, jsonlanguages[i].name)
        }

    }
    
    // Calculat the percentage that the other less well cared languages take up
    for (let i = NUMBER_OF_MAX_LANG; i < numberOfLanguages; i++){
        total_others_percentage += jsonlanguages[i].percent
        console.log(total_others_percentage)
    }
    const OTHERS_COLOR = "rgb(200,200,200)"
    // Generate the component
    const newGraphComponent = document.createElement("div")
    newGraphComponent.className = "hackatime-graph-component"
    newGraphComponent.style.flex = total_others_percentage
    newGraphComponent.style.backgroundColor = OTHERS_COLOR
    generateGraphLegend(OTHERS_COLOR, "Other")
    graphWrapper.appendChild(newGraphComponent)
}

updateHackatimeCard()



