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
        // console.log("overflowed")
    }
    else{
        footer.style.position = "fixed"
        // console.log("not overflowing")
    }
}

updateFooterPosition();
window.addEventListener("resize", updateFooterPosition);
window.addEventListener("load", updateFooterPosition);
setInterval(updateFooterPosition)
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




// Toggle phone navbar using button

const toggleBtn = document.getElementsByClassName("PHONE-navbar-toggle")[0]
const PHONENavbar = document.getElementsByClassName("PHONE-navbar-wrapper")[0]

// function togglePhoneNavbar(){
//     const styles = window.getComputedStyle(PHONENavbar)
//     if (styles.display != "none"){
//         PHONENavbar.style.display = "none"
//     }
//     else {
//         PHONENavbar.style.display = "block"
//     }
// }

function togglePhoneNavbar(){
    console.log(PHONENavbar.className)
    if (PHONENavbar.className.includes("open")){
        PHONENavbar.classList.remove("open")
    }
    else {
        PHONENavbar.classList.add("open")
    }
}


// Handle unique visitors
async function putUniqueVisitors(){
    const counterField = document.getElementsByClassName("unique-visitors-counter")[0]
    let content
    // OMINITED - [TODO]
    if (localStorage.getItem("isUniqueVisitor") === "null" || true) {
        try {
            const response = await fetch("https://backend.natdrone101.workers.dev/posts/uniqueVisitor", {
                method: "PUT",

            })
            if (!response.ok){
                console.log(`UniqueVisitors error: ${response.status}`)
            }
            
            const result = await response.json()
            console.log(`Sent PUT Request:`, result)
            content = result.uniqueVisitors
            if (result.error) {
                console.error("DB Error:", result.error)
            }
            localStorage.setItem("isUniqueVisitor", "false")
        }
        catch(error){
            console.log(`Failed to send PUT request: ${error.message}`)
        }
        counterField.innerText = content ?? "--"
    }
    

}
window.addEventListener("load", putUniqueVisitors)