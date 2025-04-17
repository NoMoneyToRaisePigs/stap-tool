// src/api-details-panel.js
import { Styles, getSvgIcon } from './styles.js';

export class ApiDetailsPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._request = {};
  }
  
  static get observedAttributes() {
    return ['request'];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'request') {
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
  }
  
  render() {
    if (!this._request || !this._request.url) {
      this.shadowRoot.innerHTML = `
        <style>
          ${Styles.cssText}
          
          .empty {
            padding: 16px;
            text-align: center;
            color: #6B7280;
          }
        </style>
        
        <div class="empty">No request details available</div>
      `;
      return;
    }
    
    const { url, method, status, duration, timestamp, page } = this._request;
    
    this.shadowRoot.innerHTML = `
      <style>
        ${Styles.cssText}
        
        .details-panel {
          padding: 8px 0;
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
          font-size: 12px;
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
      
      <div class="details-panel">
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
    `;
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    const copyBtn = this.shadowRoot.getElementById('copy-btn');
    const analyzeBtn = this.shadowRoot.getElementById('analyze-btn');
    
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        this._copyRequestDetails();
      });
    }
    
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => {
        this._analyzeSensitiveData();
      });
    }
  }
  
  _copyRequestDetails() {
    navigator.clipboard.writeText(JSON.stringify(this._request, null, 2))
      .then(() => {
        // 可以添加复制成功的提示
        alert('请求详情已复制到剪贴板');
      })
      .catch(err => {
        console.error('复制失败:', err);
      });
  }
  
  _analyzeSensitiveData() {
    this.dispatchEvent(new CustomEvent('analyze-sensitive', {
      bubbles: true,
      composed: true,
      detail: { 
        request: this._request,
        apiUrl: this._request.url
      }
    }));
  }
}

// Define custom element
customElements.define('api-details-panel', ApiDetailsPanel);