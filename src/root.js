// src/root.js
import '@/styles/index.js';
import './interceptor.js';

import './layout/api-inspector-container.js';
import './layout/api-inspector-header.js';
import './layout/api-inspector-toolbar.js';
import './layout/api-inspector.footer.js';


import './api-details/index.js';


class ApiInspector extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.requests = [];
    
    // 创建状态存储
    this.state = {
      requestCount: 0,
      sensitiveCount: 0,
      searchTerm: ''
    };
    
    this.render();
    this.setupEventListeners();
  }
  
  connectedCallback() {
    // 自动挂载到body
    if (!document.body.contains(this)) {
      document.body.appendChild(this);
    }
    
    // 确保DOM完全初始化后再监听请求
    requestAnimationFrame(() => {
      this.setupRequestListener();
    });
  }
  
  disconnectedCallback() {
    // 组件被移除时，清除事件监听器
    window.removeEventListener('plugin-api-captured', this.handleApiCaptured);
  }
  
  render() {
    this.shadowRoot.innerHTML = `
    <style>
    api-inspector-container {
      opacity: 0.7;
      z-index: 9999999;
    }

    api-inspector-container:hover {
      opacity: 1;
    }
    </style>

      <api-inspector-container>
        <api-inspector-header slot="header"></api-inspector-header>
        <api-inspector-toolbar slot="toolbar"></api-inspector-toolbar>
        <div slot="api-list" class="api-list" id="api-list-container">
          ${this._renderRequestItems()}
        </div>
        <api-inspector-footer slot="footer"></api-inspector-footer>
      </api-inspector-container>
    `;

    // 完成初始化渲染后获取容器引用
    this.apiListContainer = this.shadowRoot.querySelector('#api-list-container');
    
    // 如果已有请求数据，确保它们被正确初始化
    if (this.requests.length > 0) {
      this._updateRequestItems();
    }
  }
  
  _renderRequestItems() {
    if (this.requests.length === 0) {
      return '<div class="empty-message"></div>';
    }
    
    return this.requests.map((request, index) => `
      <api-request-item id="request-${index}"></api-request-item>
    `).join('');
  }
  
  setupRequestListener() {
    // 使用箭头函数绑定this
    this.handleApiCaptured = (e) => {
      this.addRequest(e.detail);
    };
    
    // 监听API捕获事件
    window.addEventListener('plugin-api-captured', this.handleApiCaptured);
  }
  
  setupEventListeners() {
    // 监听搜索事件
    this.shadowRoot.addEventListener('search-changed', (e) => {
      this.state.searchTerm = e.detail.searchTerm;
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
  }
  
  addRequest(requestData) {
    // 记录之前的状态
    const wasEmpty = this.requests.length === 0;
    
    // 检查请求是否包含敏感数据
    const isSensitive = this._checkIfSensitive(requestData);
    
    // 添加敏感标记到请求数据
    requestData.isSensitive = isSensitive;
    
    // 添加请求到列表
    this.requests.unshift(requestData);
    
    // 检查是否是初始化阶段
    if (!this.apiListContainer) {
      // 初始化阶段，重新渲染整个UI
      this.render();
    } else {
      // 已初始化，只更新列表部分
      if (wasEmpty) {
        // 从空状态切换到有数据状态
        this.apiListContainer.innerHTML = this._renderRequestItems();
        // 确保新添加的项有数据
        const newRequestItem = this.apiListContainer.querySelector('#request-0');
        if (newRequestItem) {
          // 使用延迟以确保自定义元素已定义
          setTimeout(() => {
            newRequestItem.request = this.requests[0];
          }, 0);
        }
      } else {
        // 仅添加新元素到列表开头
        const newItemElement = document.createElement('div');
        newItemElement.innerHTML = `<api-request-item id="request-0"></api-request-item>`;
        
        // 将新元素插入到列表开头
        if (this.apiListContainer.firstChild) {
          this.apiListContainer.insertBefore(newItemElement.firstChild, this.apiListContainer.firstChild);
        } else {
          this.apiListContainer.appendChild(newItemElement.firstChild);
        }
        
        // 更新所有现有项的ID
        const items = this.apiListContainer.querySelectorAll('api-request-item');
        for (let i = 1; i < items.length; i++) {
          items[i].id = `request-${i}`;
        }
        
        // 仅设置新添加的请求项数据
        const newRequestItem = this.apiListContainer.querySelector('#request-0');
        if (newRequestItem) {
          // 使用延迟以确保自定义元素已定义
          setTimeout(() => {
            newRequestItem.request = this.requests[0];
          }, 0);
        }
      }
    }
    
    // 更新统计信息
    this._updateStats();
  }
  
  _updateRequestItems() {
    if (!this.apiListContainer) return;
    
    this.requests.forEach((request, index) => {
      const requestItem = this.apiListContainer.querySelector(`#request-${index}`);
      if (requestItem) {
        // 检查元素是否已准备好接收数据
        if (requestItem.updateComplete) {
          requestItem.request = request;
        } else {
          // 如果元素尚未准备好，使用微任务延迟设置
          setTimeout(() => {
            requestItem.request = request;
          }, 0);
        }
      } else {
        console.warn(`找不到ID为request-${index}的请求项元素`);
      }
    });
  }
  
  _updateStats() {
    const requestCount = this.requests.length;
    
    // 计算带有敏感数据标记的请求数量
    const sensitiveCount = this.requests.filter(request => request.isSensitive).length;
    
    // 更新内部状态
    this.state.requestCount = requestCount;
    this.state.sensitiveCount = sensitiveCount;
    
    // 发送统计更新事件
    this.dispatchCustomEvent('api-stats-updated', { 
      requestCount, 
      sensitiveCount 
    });
  }
  
  // 帮助创建自定义事件的方法，确保事件能穿透Shadow DOM
  dispatchCustomEvent(eventName, data) {
    // 在组件内部传播（给子组件）
    this.shadowRoot.dispatchEvent(new CustomEvent(eventName, {
      bubbles: true,
      composed: true, // 允许事件穿透Shadow DOM边界
      detail: data
    }));
    
    // 向全局窗口传播（给其他组件）
    window.dispatchEvent(new CustomEvent(eventName, {
      detail: data
    }));
  }
  
  filterRequests(searchTerm) {
    if (!this.apiListContainer) return;
    
    if (!searchTerm) {
      // 恢复所有请求项的显示
      this.apiListContainer.querySelectorAll('api-request-item').forEach(item => {
        item.style.display = 'block';
      });
      return;
    }
    
    searchTerm = searchTerm.toLowerCase();
    
    // 筛选请求项
    this.requests.forEach((request, index) => {
      const requestItem = this.apiListContainer.querySelector(`#request-${index}`);
      if (!requestItem) return;
      
      const { method, url, status } = request;
      const searchString = `${method} ${url} ${status}`.toLowerCase();
      
      if (searchString.includes(searchTerm)) {
        requestItem.style.display = 'block';
      } else {
        requestItem.style.display = 'none';
      }
    });
    
    // 检查是否存在匹配项
    const visibleItems = Array.from(this.apiListContainer.querySelectorAll('api-request-item'))
      .filter(item => item.style.display !== 'none');
    
    // 更新搜索结果计数
    this.dispatchCustomEvent('search-results-updated', {
      count: visibleItems.length,
      total: this.requests.length
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
    if (this.apiListContainer) {
      this.apiListContainer.innerHTML = '<div class="empty-message"></div>';
    } else {
      this.render();
    }
    this._updateStats();
  }
  
  // 检查请求是否包含敏感数据
  _checkIfSensitive(request) {
    // 检查不同位置的headers
    const headers = request.headers || 
                   (request.responseData && request.responseData.headers) || 
                   {};
    
    // 检查header中是否存在x-data-protect字段（不区分大小写）
    const hasDataProtect = 
      !!headers['x-data-protect'] || 
      !!headers['X-Data-Protect'] || 
      Object.keys(headers).some(key => key.toLowerCase() === 'x-data-protect');
    
    // 检查header值是否存在敏感标记
    if (hasDataProtect) {
      return true;
    }
    
    // 检查URL是否包含敏感数据标记
    if (request.url && request.url.toLowerCase().includes('sensitive')) {
      return true;
    }
    
    return false;
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