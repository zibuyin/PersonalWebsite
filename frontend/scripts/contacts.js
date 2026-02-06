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
let rateLimitTimeoutId = null

function setRateLimited(retryAfterSeconds) {
    if (!messageBtn || !rateLimitMessage) {
        return
    }
    const seconds = Math.max(1, Number(retryAfterSeconds) || 300)
    messageBtn.disabled = true
    rateLimitMessage.textContent = `Rate limited. Try again in ${seconds}s.`

    if (rateLimitTimeoutId) {
        clearTimeout(rateLimitTimeoutId)
    }
    rateLimitTimeoutId = setTimeout(() => {
        messageBtn.disabled = false
        rateLimitMessage.textContent = ""
        rateLimitTimeoutId = null
    }, seconds * 1000)
}

function clearRateLimitMessage() {
    if (!messageBtn || !rateLimitMessage) {
        return
    }
    if (rateLimitTimeoutId) {
        clearTimeout(rateLimitTimeoutId)
        rateLimitTimeoutId = null
    }
    messageBtn.disabled = false
    rateLimitMessage.textContent = ""
}
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
                setRateLimited(result.retryAfterSeconds)
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