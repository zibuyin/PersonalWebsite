class ProjectCard extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || "Insert Title"
    const subtitle = this.getAttribute('subtitle') || "Insert Subtitle"
    const imgsrc = this.getAttribute('src') || "Insert Image Source"
    const customClassName = this.getAttribute("className") || "none"

    this.innerHTML = `
            <div class="project-card">
                <div class="project-card-title-wrapper ${customClassName}">
                    <h2 class="project-card-title">${title}</h2>
                    <p class="project-card-subtitle">${subtitle}
                    </p>
                </div>
                <img class="project-card-image"
                    src="${imgsrc}"></img>
            </div>
    `;
  }
}

customElements.define("project-card", ProjectCard);

