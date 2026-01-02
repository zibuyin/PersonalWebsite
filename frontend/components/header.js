class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <div class="snow"></div>
    <header>
        <div style="display: flex; align-items: center;">
            <h1 class="header-title">Nathan :D</h1>
            <img class="PHONE-pfp" src="https://ca.slack-edge.com/E09V59WQY1E-U08HYM19NJE-bdc022083fb2-512" />
        </div>

        <div class="navbar">
            <a class="snow-toggle" onClick="snowToggleHandler()"><i class="fa-solid fa-snowflake"></i></a>
            <a href="/index.html">Home</a>
            <a href="/frontend/pages/projects.html">Projects</a>
            <a>About</a>
            <a>Contact</a>

        </div>
        <div class="PHONE-header-btns-wrapper">
          <a class="snow-toggle" onClick="snowToggleHandler()"><i class="fa-solid fa-snowflake PHONE-snowflake"></i></a>
          <a class="PHONE-navbar-toggle" onClick="togglePhoneNavbar()"><i class="fa-solid fa-bars"></i></a>
        </div>
        </header>

    <div class="PHONE-navbar-wrapper">
        <div class="PHONE-navbar">
            <a href="/index.html">Home</a>
            <a href="/frontend/pages/projects.html">Projects</a>
            <a>About</a>
            <a>Contact</a>

        </div>
        <a class="PHONE-clickable-layer" onClick="togglePhoneNavbar()"><div class="PHONE-blur-layer"></div></a>
    </div>

    `;
  }
}

customElements.define("site-header", SiteHeader);