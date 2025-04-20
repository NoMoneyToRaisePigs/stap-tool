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

    // 格式化请求头
    const headersContent = this._formatHeaders();
    const showEmptyState = headersContent === 'No request headers available';

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
        
        .empty-state {
          text-align: center;
          padding: 16px;
          color: #6B7280;
          background-color: #F9FAFB;
          border-radius: 4px;
          margin: 8px 0;
        }
        
        .empty-state svg {
          width: 24px;
          height: 24px;
          margin-bottom: 8px;
          color: #9CA3AF;
        }
        
        .empty-state p {
          margin: 4px 0;
        }
        
        .hint {
          font-size: 12px;
          color: #9CA3AF;
          margin-top: 8px;
        }
      </style>
      
      <div class="headers-container">
        <div class="property">
          <div class="property-name">请求头信息</div>
          ${showEmptyState ? `
            <div class="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>暂未捕获到请求头信息</p>
              <p class="hint">当前拦截器在捕获请求头时有限制：<br>• Fetch API只能捕获部分请求头<br>• XMLHttpRequest的请求头不能被捕获</p>
            </div>
          ` : `
            <div class="property-value">${headersContent}</div>
          `}
        </div>
      </div>
    `;
  }

  _formatHeaders() {
    // 增加调试日志，查看请求数据
    console.log('请求数据分析:', {
      hasRequest: !!this._request,
      hasHeaders: !!this._request?.headers,
      hasRequestHeaders: !!this._request?.requestHeaders,
      requestType: typeof this._request
    });
    
    // 安全地解构，避免undefined错误
    const { headers, requestHeaders } = this._request || {};
    
    // 优先使用专门的requestHeaders字段
    if (requestHeaders && typeof requestHeaders === 'object') {
      // 检查requestHeaders对象是否有内容
      const entries = Object.entries(requestHeaders);
      if (entries.length > 0) {
        let formattedHeaders = '';
        for (const [key, value] of entries) {
          // 如果是认证信息，隐藏敏感内容
          if (key.toLowerCase() === 'authorization') {
            formattedHeaders += `${key}: ${value.split(' ')[0]} ${'*'.repeat(8)}\n`;
          } else {
            formattedHeaders += `${key}: ${value}\n`;
          }
        }
        return formattedHeaders;
      }
    }
    
    // 兼容旧的headers格式，只在没有responseHeaders时作为请求头处理
    if (headers && typeof headers === 'object' && !this._request.responseHeaders) {
      // 检查headers对象是否有内容
      const entries = Object.entries(headers);
      if (entries.length > 0) {
        let formattedHeaders = '';
        for (const [key, value] of entries) {
          // 如果是认证信息，隐藏敏感内容
          if (key.toLowerCase() === 'authorization') {
            formattedHeaders += `${key}: ${value.split(' ')[0]} ${'*'.repeat(8)}\n`;
          } else {
            formattedHeaders += `${key}: ${value}\n`;
          }
        }
        return formattedHeaders;
      }
    }
    
    // 尝试从请求对象中查找其他可能的请求头信息
    if (this._request) {
      // 检查是否有request子属性
      if (this._request.request && typeof this._request.request === 'object') {
        if (this._request.request.headers && typeof this._request.request.headers === 'object') {
          const entries = Object.entries(this._request.request.headers);
          if (entries.length > 0) {
            let formattedHeaders = '';
            for (const [key, value] of entries) {
              if (key.toLowerCase() === 'authorization') {
                formattedHeaders += `${key}: ${value.split(' ')[0]} ${'*'.repeat(8)}\n`;
              } else {
                formattedHeaders += `${key}: ${value}\n`;
              }
            }
            return formattedHeaders;
          }
        }
      }
      
      // 检查是否在原始请求数据中的其他位置有头信息
      for (const key of ['header', 'headers', 'requestHeaders']) {
        if (this._request[key] && typeof this._request[key] === 'object') {
          const entries = Object.entries(this._request[key]);
          if (entries.length > 0) {
            let formattedHeaders = '';
            for (const [headerKey, headerValue] of entries) {
              if (headerKey.toLowerCase() === 'authorization') {
                formattedHeaders += `${headerKey}: ${headerValue.split(' ')[0]} ${'*'.repeat(8)}\n`;
              } else {
                formattedHeaders += `${headerKey}: ${headerValue}\n`;
              }
            }
            return formattedHeaders;
          }
        }
      }
    }
    
    return 'No request headers available';
  }
}

customElements.define('request-headers-tab', ApiHeadersTab); 