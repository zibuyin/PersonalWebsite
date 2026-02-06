// async function sendEmail(){
//     const counterField = document.getElementsByClassName("unique-visitors-counter")[0]
//     let content
//     // OMINITED - [TODO]
//     if (localStorage.getItem("isUniqueVisitor") === "null" || true) {
//         try {
//             const response = await fetch("https://backend.natdrone101.workers.dev/posts/sendEmail", {
//                 method: "PUT",

//             })
//             if (!response.ok){
//                 console.log(`UniqueVisitors error: ${response.status}`)
//             }
            
//             const result = await response.json()
//             console.log(`Sent PUT Request:`, result)
//             content = result.uniqueVisitors
//             if (result.error) {
//                 console.error("DB Error:", result.error)
//             }
//             localStorage.setItem("isUniqueVisitor", "false")
//         }
//         catch(error){
//             console.log(`Failed to send PUT request: ${error.message}`)
//         }
//         counterField.innerText = content ?? "--"
//     }
    

// }


const agent = window.navigator.userAgent
const keyPrompt = document.getElementsByClassName("key-prompt")[0]
console.log(agent)
if (agent.toLowerCase().includes("macintosh")) {
    console.log("macintosh")
    keyPrompt.innerHTML = "⌘ + ↵"
}
else if(agent.toLowerCase().includes("iphone") || agent.toLowerCase().includes("android") || agent.toLowerCase().includes("ipad")) {
    console.log("mobile")
    keyPrompt.innerHTML = ""
}
else {
    console.log("win || linux")
    keyPrompt.innerHTML = "CTRL + ↵"
}
const messageBtn = document.getElementsByClassName("message-btn")[0]
const rateLimitMessage = document.getElementsByClassName("rate-limit-message")[0]
let rateLimitIntervalId = null
const RATE_LIMIT_KEY = 'messageSendRateLimitExpiry'

function updateRateLimitCountdown() {
    if (!messageBtn || !rateLimitMessage) {
        return
    }
    const expiryTime = localStorage.getItem(RATE_LIMIT_KEY)
    if (!expiryTime) {
        messageBtn.disabled = false
        rateLimitMessage.textContent = ""
        if (rateLimitIntervalId) {
            clearInterval(rateLimitIntervalId)
            rateLimitIntervalId = null
        }
        return
    }

    const now = Date.now()
    const secondsLeft = Math.ceil((expiryTime - now) / 1000)

    if (secondsLeft <= 0) {
        messageBtn.disabled = false
        rateLimitMessage.textContent = ""
        localStorage.removeItem(RATE_LIMIT_KEY)
        if (rateLimitIntervalId) {
            clearInterval(rateLimitIntervalId)
            rateLimitIntervalId = null
        }
        return
    }

    messageBtn.disabled = true
    rateLimitMessage.textContent = `Rate limited. Try again in ${secondsLeft}s.`
}

function setRateLimited(retryAfterSeconds) {
    if (!messageBtn || !rateLimitMessage) {
        return
    }
    const seconds = Math.max(1, Number(retryAfterSeconds) || 300)
    const expiryTime = Date.now() + seconds * 1000
    localStorage.setItem(RATE_LIMIT_KEY, expiryTime)

    if (rateLimitIntervalId) {
        clearInterval(rateLimitIntervalId)
    }
    updateRateLimitCountdown()
    rateLimitIntervalId = setInterval(updateRateLimitCountdown, 1000)
}

function clearRateLimitMessage() {
    if (!messageBtn || !rateLimitMessage) {
        return
    }
    if (rateLimitIntervalId) {
        clearInterval(rateLimitIntervalId)
        rateLimitIntervalId = null
    }
    localStorage.removeItem(RATE_LIMIT_KEY)
    messageBtn.disabled = false
    rateLimitMessage.textContent = ""
}

window.addEventListener('DOMContentLoaded', () => {
    updateRateLimitCountdown()
    if (localStorage.getItem(RATE_LIMIT_KEY)) {
        rateLimitIntervalId = setInterval(updateRateLimitCountdown, 1000)
    }
})
async function sendMessage(captchaToken){
    const content = document.getElementsByClassName("message-content-input")[0].value
    const author = document.getElementsByClassName("message-name-input")[0].value
    try {
        const url = `https://backend.natdrone101.workers.dev/api/v1/leaveMessage?content=${encodeURIComponent(content)}&author=${encodeURIComponent(author)}&captchaToken=${encodeURIComponent(captchaToken)}`
        const response = await fetch (url, {
            method: "PUT"
        })
        if (response.ok) {
            const result = await response.json()
            console.log("Message sent:", result)
            document.getElementsByClassName("message-content-input")[0].value = ''
            document.getElementsByClassName("message-name-input")[0].value = ''
            goThruAllCards()
            clearRateLimitMessage()
        } else {
            if (response.status === 429) {
                const result = await response.json().catch(() => ({}))
                const retrySeconds = result.retryAfterSeconds || 300
                setRateLimited(retrySeconds)
            } else {
                console.error(`Error: ${response.status}`)
            }
        }
    }
    catch(error){
        console.log(error.message)
    }
    
}

async function getMessages(){
    try {
        const response = await fetch("https://backend.natdrone101.workers.dev/api/v1/messages", {
            method: "GET",
        })
        if (response.ok){
            const result = await response.json()
            console.log("Messages:", result)
            return result
        } else {
            console.log(`Error getting messages: ${response.status}`)
        }
    }
    catch(error){
        console.log(error.message)
    }  
}

async function renderMessage(content, author, date){
    const container = document.getElementsByClassName("message-cards-container")[0]
    const card = document.createElement("message-card")
    card.setAttribute("content", content)
    card.setAttribute("author", author)
    card.setAttribute("date", date)

    container.appendChild(card)
}

async function goThruAllCards() {
    const container = document.getElementsByClassName("message-cards-container")[0]
    container.innerHTML = ''
    result = await getMessages()
    console.log("result:", result)
    console.log(result.messages.length)
    length = result.messages.length
    for(i = 0; i < length; i++){
        console.log(i)
        currentMessage = result.messages[i]
        console.log(currentMessage)
        renderMessage(currentMessage.message_content, currentMessage.message_author, currentMessage.message_date.substring(0, 10))
    }
}


goThruAllCards()