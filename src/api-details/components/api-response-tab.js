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

    // 格式化响应头
    const responseContent = this._formatResponse();
    const showEmptyState = responseContent === 'No response headers available';

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
      
      <div class="response-container">
        <div class="property">
          <div class="property-name">响应头信息</div>
          ${showEmptyState ? `
            <div class="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>暂未捕获到响应头信息</p>
              <p class="hint">当前拦截器可能未正确捕获响应头信息<br>某些响应头可能因为CORS限制而无法获取</p>
            </div>
          ` : `
            <div class="property-value">${responseContent}</div>
          `}
        </div>
      </div>
    `;
  }

  _formatResponse() {
    const { responseData, responseHeaders } = this._request;
    
    // 增加调试日志，查看响应数据
    console.log('响应数据分析:', {
      hasResponseHeaders: !!responseHeaders,
      responseHeadersType: responseHeaders ? typeof responseHeaders : 'undefined',
      hasHeaders: !!this._request.headers,
      hasResponseData: !!responseData,
      responseDataType: responseData ? typeof responseData : 'undefined'
    });
    
    // 优先使用responseHeaders字段
    if (responseHeaders && typeof responseHeaders === 'object') {
      // 检查responseHeaders对象是否有内容
      const entries = Object.entries(responseHeaders);
      if (entries.length > 0) {
        let formattedHeaders = '';
        for (const [key, value] of entries) {
          formattedHeaders += `${key}: ${value}\n`;
        }
        return formattedHeaders;
      }
    }
    
    // 兼容：如果没有responseHeaders但有headers，尝试用这个（旧版本拦截器）
    if (this._request.headers && typeof this._request.headers === 'object') {
      // 检查headers对象是否有内容
      const entries = Object.entries(this._request.headers);
      if (entries.length > 0) {
        let formattedHeaders = '';
        for (const [key, value] of entries) {
          formattedHeaders += `${key}: ${value}\n`;
        }
        return formattedHeaders;
      }
    }
    
    // 如果没有responseHeaders但有responseData，尝试从中提取headers
    if (responseData && typeof responseData === 'object') {
      // 检查是否有headers属性
      if (responseData.headers && typeof responseData.headers === 'object') {
        const entries = Object.entries(responseData.headers);
        if (entries.length > 0) {
          let formattedHeaders = '';
          for (const [key, value] of entries) {
            formattedHeaders += `${key}: ${value}\n`;
          }
          return formattedHeaders;
        }
      }
      
      // 某些API可能在其他地方包含headers信息
      for (const key of ['header', 'headers', 'responseHeaders']) {
        if (responseData[key] && typeof responseData[key] === 'object') {
          const entries = Object.entries(responseData[key]);
          if (entries.length > 0) {
            let formattedHeaders = '';
            for (const [headerKey, headerValue] of entries) {
              formattedHeaders += `${headerKey}: ${headerValue}\n`;
            }
            return formattedHeaders;
          }
        }
      }
    }
    
    return 'No response headers available';
  }
}

customElements.define('api-response-tab', ApiResponseTab); 