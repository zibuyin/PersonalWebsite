class ProjectCard extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || "Insert Title"
    const subtitle = this.getAttribute('subtitle') || "Insert Subtitle"
    const imgsrc = this.getAttribute('src') || "Insert Image Source"
    const customClassName = this.getAttribute("className") || "none"
    const blob = this.getAttribute("blob")
    const views = this.getAttribute("views")
    this.innerHTML = `
            <a href="${blob}">
              <div class="project-card">
                  <div class="project-card-title-wrapper ${customClassName}">
                      <h2 class="project-card-title">${title}</h2>
                      <p class="project-card-subtitle">${subtitle}</p>
                      <p>${views} Views</p>
                  </div>
                  <img class="project-card-image"
                      src="${imgsrc}"></img>
              </div>
            </a>
    `;
  }
}

customElements.define("project-card", ProjectCard);

