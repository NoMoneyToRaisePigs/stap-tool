

// src/root.js
import './styles.js';
import './api-inspector.js';
import { ApiInterceptor } from './api-inspector.js'; 
import './api-inspector-container.js';
import './api-inspector-header.js';
import './api-inspector-toolbar.js';
import './api-request-item.js';
import './api-details-panel.js';
import './api-sensitive-field.js';
import './api-sensitive-panel.js';
import './api-inspector.footer.js';

class ApiInspector extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.requests = [];
    this.render();
    this.setupInterceptor();
    this.setupEventListeners();
  }
  
  connectedCallback() {
    // 自动挂载到body
    if (!document.body.contains(this)) {
      document.body.appendChild(this);
    }
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <api-inspector-container>
        <api-inspector-header slot="header"></api-inspector-header>
        <api-inspector-toolbar slot="toolbar"></api-inspector-toolbar>
        <div slot="api-list" class="api-list">
          ${this._renderRequestItems()}
        </div>
        <api-inspector-footer slot="footer"></api-inspector-footer>
      </api-inspector-container>
    `;
  }
  
  _renderRequestItems() {
    if (this.requests.length === 0) {
      return '<div class="empty-message">暂无API请求数据</div>';
    }
    
    return this.requests.map((request, index) => `
      <api-request-item id="request-${index}"></api-request-item>
    `).join('');
  }
  
  setupInterceptor() {
    // 初始化API拦截器
    const interceptor = new ApiInterceptor();
    
    // 监听API捕获事件
    window.addEventListener('plugin-api-captured', (e) => {
      this.addRequest(e.detail);
    });
  }
  
  setupEventListeners() {
    // 监听搜索事件
    this.shadowRoot.addEventListener('search-changed', (e) => {
      this.filterRequests(e.detail.searchTerm);
    });
    
    // 监听导出事件
    this.shadowRoot.addEventListener('export-data', () => {
      this.exportData();
    });
    
    // 监听清除事件
    this.shadowRoot.addEventListener('clear-data', () => {
      this.clearData();
    });
    
    // 监听敏感字段分析事件
    this.shadowRoot.addEventListener('analyze-sensitive', (e) => {
      const { request, apiUrl } = e.detail;
      const requestItem = this.shadowRoot.querySelector(`#request-${this.requests.indexOf(request)}`);
      
      if (requestItem) {
        const sensitivePanel = document.createElement('api-sensitive-panel');
        sensitivePanel.slot = 'sensitive-panel';
        sensitivePanel.url = apiUrl;
        
        // 删除已有的敏感面板
        const existingPanel = requestItem.querySelector('api-sensitive-panel');
        if (existingPanel) {
          existingPanel.remove();
        }
        
        requestItem.appendChild(sensitivePanel);
      }
    });
  }
  
  addRequest(requestData) {
    // 添加请求到列表
    this.requests.unshift(requestData);
    
    // 更新UI
    this.render();
    
    // 更新请求项数据
    this._updateRequestItems();
    
    // 更新统计信息
    this._updateStats();
  }
  
  _updateRequestItems() {
    this.requests.forEach((request, index) => {
      const requestItem = this.shadowRoot.querySelector(`#request-${index}`);
      if (requestItem) {
        requestItem.request = request;
      }
    });
  }
  
  _updateStats() {
    const requestCount = this.requests.length;
    const sensitiveCount = 0; // 这里需要实际计算敏感字段数量
    
    // 发送统计更新事件
    window.dispatchEvent(new CustomEvent('api-stats-updated', {
      detail: { requestCount, sensitiveCount }
    }));
  }
  
  filterRequests(searchTerm) {
    if (!searchTerm) {
      // 恢复所有请求项的显示
      this.shadowRoot.querySelectorAll('api-request-item').forEach(item => {
        item.style.display = 'block';
      });
      return;
    }
    
    searchTerm = searchTerm.toLowerCase();
    
    // 筛选请求项
    this.requests.forEach((request, index) => {
      const requestItem = this.shadowRoot.querySelector(`#request-${index}`);
      if (!requestItem) return;
      
      const { method, url, status } = request;
      const searchString = `${method} ${url} ${status}`.toLowerCase();
      
      if (searchString.includes(searchTerm)) {
        requestItem.style.display = 'block';
      } else {
        requestItem.style.display = 'none';
      }
    });
  }
  
  exportData() {
    const blob = new Blob([JSON.stringify(this.requests, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'api-inspector-export.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  
  clearData() {
    this.requests = [];
    this.render();
    this._updateStats();
  }
}

// Define custom element
customElements.define('api-inspector', ApiInspector);

// 自动安装API Inspector
document.addEventListener('DOMContentLoaded', () => {
  // 检查是否已存在
  if (!document.querySelector('api-inspector')) {
    document.body.appendChild(document.createElement('api-inspector'));
  }
});

// 导出供其他模块使用
export default ApiInspector;