class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <footer id="footer">
            <a class="github-label" href="https://github.com/zibuyin/PersonalWebsite">
                <p>Github <i class="fa-brands fa-github"></i></p>
            </a>
            <p>© Nathan 2026</p>
            <a href="https://en.wikipedia.org/wiki/Web_badge"><img src="https://anlucas.neocities.org/macos.gif" width="110px"
                    height="38.75px"></img></a>
        </footer>
    `;
  }
}

customElements.define("site-footer", SiteFooter);