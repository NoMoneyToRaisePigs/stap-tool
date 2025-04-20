export class ApiSensitiveTab extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .sensitive-container {
          padding: 8px 0;
        }
      </style>
      
      <div class="sensitive-container">
        <slot name="sensitive-panel"></slot>
      </div>
    `;
  }
}

customElements.define('api-sensitive-tab', ApiSensitiveTab); 