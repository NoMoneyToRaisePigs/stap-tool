export class ApiDetailsTab extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._request = {};
  }

  set request(data) {
    this._request = data;
    this.render();
  }

  get request() {
    return this._request;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this._request || !this._request.url) return;

    const { url, method, status, page, timestamp, duration } = this._request;

    this.shadowRoot.innerHTML = `
      <style>
        .property {
          margin-bottom: 8px;
        }
        
        .property-name {
          font-weight: 500;
          margin-bottom: 4px;
          color: #4B5563;
        }
        
        .property-value {
          padding: 6px 8px;
          background-color: #F3F4F6;
          border-radius: 4px;
          font-family: monospace;
          overflow-x: auto;
          white-space: pre-wrap;
          max-height: 100px;
          overflow-y: auto;
        }
      </style>
      
      <div class="details-container">
        <div class="property">
          <div class="property-name">URL</div>
          <div class="property-value">${url}</div>
        </div>
        <div class="property">
          <div class="property-name">方法</div>
          <div class="property-value">${method}</div>
        </div>
        <div class="property">
          <div class="property-name">状态码</div>
          <div class="property-value">${status || 'N/A'}</div>
        </div>
        <div class="property">
          <div class="property-name">页面</div>
          <div class="property-value">${page || location.pathname}</div>
        </div>
        <div class="property">
          <div class="property-name">时间戳</div>
          <div class="property-value">${timestamp || new Date().toISOString()}</div>
        </div>
        <div class="property">
          <div class="property-name">响应时间</div>
          <div class="property-value">${duration ? duration.toFixed(2) + ' ms' : 'N/A'}</div>
        </div>
      </div>
    `;
  }
}

customElements.define('api-details-tab', ApiDetailsTab); 