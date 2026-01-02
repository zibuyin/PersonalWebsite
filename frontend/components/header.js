class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
     <div class="snow"></div>
        <header>
           <div>
            <h1 class="header-title">Nathan :D</h1>
            <img class="PHONE-pfp" src="https://ca.slack-edge.com/E09V59WQY1E-U08HYM19NJE-bdc022083fb2-512" />
           <div>

            <div class="navbar">
            <a class="snow-toggle" onClick="snowToggleHandler()"><i class="fa-solid fa-snowflake"></i></a>
                <a href="/index.html">Home</a>
                <a href="/frontend/pages/projects.html">Projects</a>
                <a>About</a>
                <a>Contact</a>
            </div>
            <a onClick = "togglePhoneNavbar()"><i class="fa-solid fa-bars PHONE-navbar-toggle"></i></a>
        </header> 
    `;
  }
}

customElements.define("site-header", SiteHeader);