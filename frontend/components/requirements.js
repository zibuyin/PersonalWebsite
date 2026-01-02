class SiteDependencies extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/frontend/styles/styles.css" />
    <link rel="stylesheet" href="/frontend/styles/snow.compiled.css" />
    <script src="/frontend/scripts/script.js" defer></script>

    <!-- Icons -->
    <script src="https://kit.fontawesome.com/11fde4d098.js" crossorigin="anonymous"></script>

    <!-- Fonts -->
    <!-- <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet"> -->
    <!--  -->
    <title>Document</title>
</head>

    `;
  }
}

customElements.define("requirements", SiteDependencies);