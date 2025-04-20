// src/api-request-item.js
import { Styles, getSvgIcon, getMethodClass, getStatusClass } from '@/styles/index.js';
import './components/api-details-tab.js';
import './components/api-headers-tab.js';
import './components/api-response-tab.js';
import './components/api-sensitive-tab.js';
import './components/api-sensitive-panel.js';
import './components/api-sensitive-field.js';

export class ApiRequestItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.expanded = false;
    this.activeTab = 'details';
    this._request = {};
    this._sensitivePanelLoaded = false;
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
    
    const { method, url, status } = this._request;
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
            <div class="tab ${this.activeTab === 'response' ? 'active' : ''}" data-tab="response">响应头</div>
            <div class="tab ${this.activeTab === 'sensitive' ? 'active' : ''}" data-tab="sensitive">敏感字段</div>
          </div>
          
          <div class="tab-content ${this.activeTab === 'details' ? 'active' : ''}" data-content="details">
            <api-details-tab id="details-tab"></api-details-tab>
          </div>
          
          <div class="tab-content ${this.activeTab === 'headers' ? 'active' : ''}" data-content="headers">
            <api-headers-tab id="headers-tab"></api-headers-tab>
          </div>
          
          <div class="tab-content ${this.activeTab === 'response' ? 'active' : ''}" data-content="response">
            <api-response-tab id="response-tab"></api-response-tab>
          </div>
          
          <div class="tab-content ${this.activeTab === 'sensitive' ? 'active' : ''}" data-content="sensitive">
            <api-sensitive-tab id="sensitive-tab">
              <div id="sensitive-panel-container" slot="sensitive-panel"></div>
            </api-sensitive-tab>
          </div>
        </div>
      </div>
    `;
    
    // 更新子组件的请求数据
    this._updateTabComponents();
    this.setupEventListeners();
  }
  
  _updateTabComponents() {
    const detailsTab = this.shadowRoot.getElementById('details-tab');
    const headersTab = this.shadowRoot.getElementById('headers-tab');
    const responseTab = this.shadowRoot.getElementById('response-tab');
    
    if (detailsTab) detailsTab.request = this._request;
    if (headersTab) headersTab.request = this._request;
    if (responseTab) responseTab.request = this._request;
  }
  
  setupEventListeners() {
    const requestHeader = this.shadowRoot.getElementById('request-header');
    const tabs = this.shadowRoot.querySelectorAll('.tab');
    
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
          const tabName = tab.getAttribute('data-tab');
          this.activeTab = tabName;
          this._updateActiveTab();
          
          // 当点击敏感字段标签页并且尚未加载过敏感面板时，加载敏感字段数据
          if (tabName === 'sensitive' && !this._sensitivePanelLoaded) {
            this._loadSensitivePanel();
          }
        });
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
  
  _loadSensitivePanel() {
    if (!this._request.url) return;
    
    const container = this.shadowRoot.getElementById('sensitive-panel-container');
    if (!container) return;
    
    // 创建敏感字段面板
    const sensitivePanel = document.createElement('api-sensitive-panel');
    sensitivePanel.setAttribute('api-url', this._request.url);
    
    // 添加到容器
    container.innerHTML = '';
    container.appendChild(sensitivePanel);
    
    // 标记已加载
    this._sensitivePanelLoaded = true;
  }
}

// Define custom element
customElements.define('api-request-item', ApiRequestItem);