class hackatimeGraph extends HTMLElement {
    connectedCallback(){
        this.innerHTML = `<div class="hackatime-graph-component"></div>`
    }
}

customElements.define("hackatime-graph", hackatimeGraph);