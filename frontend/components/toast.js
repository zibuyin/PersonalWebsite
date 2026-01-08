class Toast extends HTMLElement {
  connectedCallback() {
    const body = this.getAttribute('body') || "Insert Title"

    this.innerHTML = /* html */`
        <a href="/frontend/pages/projects.html">
        <div class="toast">
            <div class="toast-inner-wrapper">
                <div class="toast-icon-wrapper"><i class="fa-solid fa-bell toast-icon"></i></div>
                <h3 class="toast-body">${body}<i
                        class="fa-solid fa-arrow-right-from-bracket "></i></h3>
            </div>
        </div>
        </a>
    `;

    // Trigger slide-in animation: ensure initial styles are applied first
    const el = this.querySelector('.toast')
    if (el) {
      // Force a reflow so the browser applies the initial transform
      // before we add the class that changes it, enabling the transition.
      // eslint-disable-next-line no-unused-expressions
      void el.offsetWidth
      requestAnimationFrame(() => el.classList.add('show'))
    }
  }
}

customElements.define("toast-banner", Toast);

