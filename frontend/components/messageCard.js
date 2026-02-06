class MessageCard extends HTMLElement {
  connectedCallback() {
    const content = this.getAttribute('content') || "Insert Content"
    const date = this.getAttribute('date') || "1970-1-1"
    const author = this.getAttribute('author') || "Insert Author"
    this.innerHTML = /* html */ ` 
        <div class="message-card">
            <p class="message-content">${content}</p>
            <div class="message-footer">
                <p class="message-date">${date}</p>
                <p class="message-author">${author}</p>
            </div>
        </div>
    `;
  }
}

customElements.define("message-card", MessageCard);

