const WEBPAGE_TEMPLATE= (title, date, imgsrc, mdsrc) => {
    const base = `${window.location.origin}/`;
    return `<!DOCTYPE html>
    <html lang="en">

    <head>
        <base href="${base}">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="/frontend/styles/styles.css" />

        <link rel="stylesheet" href="/frontend/styles/project-template.css" />
        <link rel="stylesheet" href="/frontend/styles/snow.compiled.css" />
        <script src="/frontend/scripts/script.js" defer></script>


        <!-- Icons -->
        <script src="https://kit.fontawesome.com/11fde4d098.js" crossorigin="anonymous"></script>
        <script type="module" src="/frontend/scripts/mdblock.js"></script>

        <!-- Fonts -->
        <!-- <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet"> -->
        <!--  -->
        <title>${title}</title>
    </head>

    <body>

        <site-header></site-header>

        <div class="project-md">
            <div class="project-md-container">
                <a class="back-btn-wrapper" href="/frontend/pages/projects.html"><i class="fa-solid fa-angle-left back-btn-icon"></i>
                    <p class="back-btn-para">Go Back</p>
                </a>
                <h1 class="page-title">${title}</h1>
                <h2 class="date"><i class="fa-regular fa-calendar"></i> ${date}</h2>
                <md-block src="${mdsrc}">
                    # Loading...
                </md-block>

            </div>

        </div>

        <site-footer></site-footer>
    </body>

    <!-- Custom Component Imports -->
    <script src="/frontend/components/header.js"></script>
    <script src="/frontend/components/footer.js"></script>
    <script src="/frontend/components/projectCards.js"></script>
    <!-- <script src="/frontend/components/hackatimeGraph.js"></script> -->

    </html>
`
}

const blobUrls = []
function createProjectPage(title, subtitle, date, imgsrc, mdsrc){
    const mdUrl = mdsrc.startsWith('http') ? mdsrc : `${window.location.origin}/${mdsrc.replace(/^\//,'')}`
    const html = WEBPAGE_TEMPLATE(title, date, imgsrc, mdUrl)
    const blob = new Blob([html], {type: "text/html"})
    const blobUrl = URL.createObjectURL(blob)

    const container = document.getElementsByClassName("project-cards-container")[0]
    const projectCard = document.createElement("project-card")
    projectCard.setAttribute("title", title)
    projectCard.setAttribute("subtitle", subtitle)
    projectCard.setAttribute("src", imgsrc)
    projectCard.setAttribute("blob", blobUrl)
    container.appendChild(projectCard)



    blobUrls.push(blobUrl)
    console.log(blobUrls)
//     const fileNameWithoutExt = mdsrc.split(/[/\\]/).pop().split('.').slice(0, -1).join('.');
//     console.log(WEBPAGE_TEMPLATE(title,date,imgsrc))
//     const file = new File([WEBPAGE_TEMPLATE(title, date, imgsrc)], `/frontend/pages/projects/${fileNameWithoutExt}.html`, { type: "text/html" })
// }
}

// Gets the JSON storing the filenames of all the md
async function getMetadataJSON(){

    // Always serve the content over the same protocol as the website itself, preventing Mixed content error when website served over https, but resource served over http
    const url = `${window.location.protocol}//${window.location.host}/frontend/pages/markdown/metadata.json`
    console.log(url)
    try{
        const response = await fetch (url)
        
        if (!response.ok){
            return "Failed to fetch projects metadata..."
        }
        const result = await response.json()
        return result
        
    }
    catch(error){
        return "Failed to fetch metadata... " + error.message
    }

}

// Enumerate through all of them
async function goThruAllMd(){
    const metadata = await getMetadataJSON()
    // alert(metadata.filename[1])
    for (let i = 0; i < metadata.pages.length; i++){
        const currentPage = metadata.pages[i]
        createProjectPage(currentPage.title, currentPage.subtitle, currentPage.date, currentPage.imgsrc, `/frontend/pages/markdown/${currentPage.fileName}.md`)
    }
}

goThruAllMd()
// Garbage cleaning, removes the blob urls when page unloads, BROKEN ON Safari [TODO]
window.addEventListener("beforeunload", () => {
    alert("garbage cleaning")
    for (let i = 0; i < blobUrls.length; i++){
        URL.revokeObjectURL(blobUrls[i])
    }
})

console.log("DEBUG")