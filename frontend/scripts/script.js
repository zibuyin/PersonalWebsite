// Defining Elements

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



