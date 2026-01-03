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





    console.log(blobUrl)
//     const fileNameWithoutExt = mdsrc.split(/[/\\]/).pop().split('.').slice(0, -1).join('.');
//     console.log(WEBPAGE_TEMPLATE(title,date,imgsrc))
//     const file = new File([WEBPAGE_TEMPLATE(title, date, imgsrc)], `/frontend/pages/projects/${fileNameWithoutExt}.html`, { type: "text/html" })
// }
}
createProjectPage("test", "subtitle lol", "January 1st, 2026", "https://flavortown.hackclub.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MzAyOTAsInB1ciI6ImJsb2JfaWQifX0=--72cfb22800b256c50d70848b6f3c35f92893fabd/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJ3ZWJwIiwicmVzaXplX3RvX2xpbWl0IjpbMTYwMCw5MDBdLCJzYXZlciI6eyJzdHJpcCI6dHJ1ZSwicXVhbGl0eSI6NzV9fSwicHVyIjoidmFyaWF0aW9uIn19--3bc8a2c9d65e3b087c0c0b37dcfb642bb247bc73/Screenshot%202026-01-01%20at%2012.22.06.png", "frontend/pages/markdown/personalWebsite.md")