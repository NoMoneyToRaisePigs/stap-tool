// src/api-request-item.js
import { Styles, getSvgIcon, getMethodClass, getStatusClass } from './styles.js';

export class ApiRequestItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.expanded = false;
    this.activeTab = 'details';
    this._request = {};
  }
  
  static get observedAttributes() {
    return ['expanded', 'request'];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'expanded') {
      this.expanded = newValue === 'true';
      this._updateExpandedState();
    } else if (name === 'request') {
      try {
        this._request = JSON.parse(newValue);
        this.render();
      } catch (e) {
        console.error('Invalid request data:', e);
      }
    }
  }
  
  // 通过属性设置请求数据
  set request(data) {
    this._request = data;
    this.render();
  }
  
  get request() {
    return this._request;
  }
  
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }
  
  render() {
    if (!this._request || !this._request.url) return;
    
    const { method, url, status, duration, timestamp, page } = this._request;
    const methodClass = getMethodClass(method);
    const statusClass = getStatusClass(status);
    const statusText = status || 'Error';
    
    // 提取路径部分，忽略查询参数
    const urlObj = new URL(url.startsWith('http') ? url : `http://example.com${url}`);
    const path = urlObj.pathname;
    
    this.shadowRoot.innerHTML = `
      <style>
        ${Styles.cssText}
        
        .request {
          border: 1px solid var(--border-color);
          border-radius: 6px;
          margin-bottom: 8px;
          overflow: hidden;
          transition: all 0.2s;
        }
        
        .request:hover {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .request-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          background-color: var(--panel-background);
          cursor: pointer;
          user-select: none;
        }
        
        .request-method {
          font-weight: 600;
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        
        .method-get {
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--success-color);
        }
        
        .method-post {
          background-color: rgba(79, 70, 229, 0.1);
          color: var(--primary-color);
        }
        
        .method-put {
          background-color: rgba(245, 158, 11, 0.1);
          color: var(--warning-color);
        }
        
        .method-delete {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--danger-color);
        }
        
        .request-path {
          flex: 1;
          font-size: 12px;
          margin: 0 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--text-color);
        }
        
        .request-status {
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 4px;
        }
        
        .status-success {
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--success-color);
        }
        
        .status-error {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--danger-color);
        }
        
        .request-content {
          padding: 12px;
          font-size: 12px;
          border-top: 1px solid var(--border-color);
          background-color: var(--background-color);
          display: ${this.expanded ? 'block' : 'none'};
        }
        
        .tabs {
          display: flex;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 8px;
        }
        
        .tab {
          padding: 8px 12px;
          font-size: 12px;
          cursor: pointer;
          color: #6B7280;
          border-bottom: 2px solid transparent;
        }
        
        .tab.active {
          color: var(--primary-color);
          border-bottom-color: var(--primary-color);
          font-weight: 500;
        }
        
        .tab-content {
          display: none;
        }
        
        .tab-content.active {
          display: block;
        }
        
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
        
        .actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }
        
        .action {
          padding: 6px 12px;
          font-size: 12px;
          border-radius: 4px;
          border: none;
          background-color: var(--panel-background);
          border: 1px solid var(--border-color);
          color: var(--text-color);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .action:hover {
          background-color: #F3F4F6;
        }
        
        .action.primary {
          background-color: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }
        
        .action.primary:hover {
          background-color: var(--secondary-color);
        }
      </style>
      
      <div class="request">
        <div class="request-header" id="request-header">
          <span class="request-method ${methodClass}">${method}</span>
          <span class="request-path">${path}</span>
          <span class="request-status ${statusClass}">${statusText}</span>
        </div>
        <div class="request-content">
          <div class="tabs">
            <div class="tab ${this.activeTab === 'details' ? 'active' : ''}" data-tab="details">详情</div>
            <div class="tab ${this.activeTab === 'headers' ? 'active' : ''}" data-tab="headers">请求头</div>
            <div class="tab ${this.activeTab === 'response' ? 'active' : ''}" data-tab="response">响应</div>
            ${this._request.sensitivePanelActive ? `<div class="tab ${this.activeTab === 'sensitive' ? 'active' : ''}" data-tab="sensitive">敏感字段</div>` : ''}
          </div>
          
          <div class="tab-content ${this.activeTab === 'details' ? 'active' : ''}" data-content="details">
            <div class="property">
              <div class="property-name">URL</div>
              <div class="property-value">${url}</div>
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
            
            <div class="actions">
              <button class="action" id="copy-btn">
                ${getSvgIcon('export')}
                复制
              </button>
              <button class="action primary" id="analyze-btn">
                ${getSvgIcon('check')}
                分析敏感字段
              </button>
            </div>
          </div>
          
          <div class="tab-content ${this.activeTab === 'headers' ? 'active' : ''}" data-content="headers">
            <div class="property">
              <div class="property-value">${this._formatHeaders()}</div>
            </div>
          </div>
          
          <div class="tab-content ${this.activeTab === 'response' ? 'active' : ''}" data-content="response">
            <div class="property">
              <div class="property-value">${this._formatResponse()}</div>
            </div>
          </div>
          
          ${this._request.sensitivePanelActive ? `
            <div class="tab-content ${this.activeTab === 'sensitive' ? 'active' : ''}" data-content="sensitive">
              <slot name="sensitive-panel"></slot>
            </div>
          ` : ''}
        </div>
      </div>
    `;
    
    this.setupEventListeners();
  }
  
  _formatHeaders() {
    const headers = this._request.headers || {};
    let formattedHeaders = '';
    
    for (const [key, value] of Object.entries(headers)) {
      // 如果是认证信息，隐藏敏感内容
      if (key.toLowerCase() === 'authorization') {
        formattedHeaders += `${key}: ${value.split(' ')[0]} ${'*'.repeat(8)}\n`;
      } else {
        formattedHeaders += `${key}: ${value}\n`;
      }
    }
    
    return formattedHeaders || 'No headers available';
  }
  
  _formatResponse() {
    const { responseData } = this._request;
    
    if (!responseData) {
      return 'No response data available';
    }
    
    try {
      if (typeof responseData === 'string') {
        try {
          // 尝试格式化JSON字符串
          const json = JSON.parse(responseData);
          return JSON.stringify(json, null, 2);
        } catch (e) {
          return responseData;
        }
      } else {
        return JSON.stringify(responseData, null, 2);
      }
    } catch (e) {
      return String(responseData);
    }
  }
  
  setupEventListeners() {
    const requestHeader = this.shadowRoot.getElementById('request-header');
    const tabs = this.shadowRoot.querySelectorAll('.tab');
    const copyBtn = this.shadowRoot.getElementById('copy-btn');
    const analyzeBtn = this.shadowRoot.getElementById('analyze-btn');
    
    if (requestHeader) {
      requestHeader.addEventListener('click', () => {
        this.expanded = !this.expanded;
        this._updateExpandedState();
      });
    }
    
    if (tabs) {
      tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
          e.stopPropagation();
          this.activeTab = tab.getAttribute('data-tab');
          this._updateActiveTab();
        });
      });
    }
    
    if (copyBtn) {
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._copyRequestDetails();
      });
    }
    
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._analyzeSensitiveData();
      });
    }
  }
  
  _updateExpandedState() {
    const content = this.shadowRoot.querySelector('.request-content');
    if (content) {
      content.style.display = this.expanded ? 'block' : 'none';
    }
  }
  
  _updateActiveTab() {
    const tabs = this.shadowRoot.querySelectorAll('.tab');
    const contents = this.shadowRoot.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
      if (tab.getAttribute('data-tab') === this.activeTab) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    contents.forEach(content => {
      if (content.getAttribute('data-content') === this.activeTab) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }
  
  _copyRequestDetails() {
    const details = {
      method: this._request.method,
      url: this._request.url,
      status: this._request.status,
      duration: this._request.duration,
      headers: this._request.headers,
      responseData: this._request.responseData
    };
    
    navigator.clipboard.writeText(JSON.stringify(details, null, 2))
      .then(() => {
        // 可以添加复制成功的提示
        alert('请求详情已复制到剪贴板');
      })
      .catch(err => {
        console.error('复制失败:', err);
      });
  }
  
  _analyzeSensitiveData() {
    console.log('分析敏感字段开始:', this._request.url);
    
    // 添加敏感字段标签
    if (!this._request.sensitivePanelActive) {
      this._request.sensitivePanelActive = true;
      this.render();
    }
    
    // 触发敏感字段分析
    console.log('触发analyze-sensitive事件');
    this.dispatchEvent(new CustomEvent('analyze-sensitive', {
      bubbles: true,
      composed: true,
      detail: { 
        request: this._request,
        apiUrl: this._request.url
      }
    }));
    
    // 自动切换到敏感字段标签
    this.activeTab = 'sensitive';
    this._updateActiveTab();
    console.log('已切换到敏感字段标签');
  }
}

// Define custom element
customElements.define('api-request-item', ApiRequestItem);