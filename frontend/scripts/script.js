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
