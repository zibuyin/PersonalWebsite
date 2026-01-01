class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <header>
            <h1 class="header-title">Nathan :D</h1>
            <img class="PHONE-pfp" src="https://ca.slack-edge.com/E09V59WQY1E-U08HYM19NJE-bdc022083fb2-512" />


            <div class="navbar">
                <a href="index.html">Home</a>
                <a href="pages/">Projects</a>
                <a>About</a>
                <a>Contact</a>
            </div>
            <i class="fa-solid fa-bars PHONE-navbar-toggle"></i>

        </header>
    `;
  }
}

customElements.define("site-header", SiteHeader);