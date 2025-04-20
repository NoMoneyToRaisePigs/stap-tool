export class ApiHeadersTab extends HTMLElement {
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
      
      <div class="headers-container">
        <div class="property">
          <div class="property-name">请求头信息</div>
          <div class="property-value">${this._formatHeaders()}</div>
        </div>
      </div>
    `;
  }

  _formatHeaders() {
    const { headers, requestHeaders } = this._request;
    
    // 优先使用专门的requestHeaders字段
    if (requestHeaders && typeof requestHeaders === 'object') {
      let formattedHeaders = '';
      for (const [key, value] of Object.entries(requestHeaders)) {
        // 如果是认证信息，隐藏敏感内容
        if (key.toLowerCase() === 'authorization') {
          formattedHeaders += `${key}: ${value.split(' ')[0]} ${'*'.repeat(8)}\n`;
        } else {
          formattedHeaders += `${key}: ${value}\n`;
        }
      }
      return formattedHeaders || 'No request headers available';
    }
    
    // 兼容旧的headers格式，只在没有responseHeaders时作为请求头处理
    if (headers && typeof headers === 'object' && !this._request.responseHeaders) {
      let formattedHeaders = '';
      for (const [key, value] of Object.entries(headers)) {
        // 如果是认证信息，隐藏敏感内容
        if (key.toLowerCase() === 'authorization') {
          formattedHeaders += `${key}: ${value.split(' ')[0]} ${'*'.repeat(8)}\n`;
        } else {
          formattedHeaders += `${key}: ${value}\n`;
        }
      }
      return formattedHeaders || 'No request headers available';
    }
    
    return 'No request headers available';
  }
}

customElements.define('api-headers-tab', ApiHeadersTab); 