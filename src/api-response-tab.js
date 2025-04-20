export class ApiResponseTab extends HTMLElement {
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
    if (!this._request) return;

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
          max-height: 300px;
          overflow-y: auto;
        }
      </style>
      
      <div class="response-container">
        <div class="property">
          <div class="property-name">响应头信息</div>
          <div class="property-value">${this._formatResponse()}</div>
        </div>
      </div>
    `;
  }

  _formatResponse() {
    const { responseData, responseHeaders } = this._request;
    
    // 优先使用responseHeaders字段
    if (responseHeaders && typeof responseHeaders === 'object') {
      let formattedHeaders = '';
      for (const [key, value] of Object.entries(responseHeaders)) {
        formattedHeaders += `${key}: ${value}\n`;
      }
      return formattedHeaders || 'No response headers available';
    }
    
    // 兼容：如果没有responseHeaders但有headers，尝试用这个（旧版本拦截器）
    if (this._request.headers && typeof this._request.headers === 'object') {
      let formattedHeaders = '';
      for (const [key, value] of Object.entries(this._request.headers)) {
        formattedHeaders += `${key}: ${value}\n`;
      }
      return formattedHeaders || 'No response headers available';
    }
    
    // 如果没有responseHeaders但有responseData，尝试从中提取headers
    if (responseData && typeof responseData === 'object' && responseData.headers) {
      let formattedHeaders = '';
      for (const [key, value] of Object.entries(responseData.headers)) {
        formattedHeaders += `${key}: ${value}\n`;
      }
      return formattedHeaders || 'No response headers available';
    }
    
    return 'No response headers available';
  }
}

customElements.define('api-response-tab', ApiResponseTab); 