// src/api-sensitive-panel.js
import { Styles, getSvgIcon } from './styles.js';
import { fetchAccurateSensitiveFields } from './utils/api.js';

export class ApiSensitivePanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.aggregatedFields = []; // 存储聚合后的字段数据
    this.loading = true;
    this.error = null;
    this.apiUrl = '';
  }
  
  static get observedAttributes() {
    return ['api-url', 'url'];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if ((name === 'api-url' || name === 'url') && newValue && newValue !== oldValue) {
      this.apiUrl = newValue;
      console.log(`${name} 属性已更新:`, newValue);
      this.loadSensitiveFields();
    }
  }
  
  // 设置API URL
  set url(value) {
    if (!value) return;
    console.log('通过setter设置URL:', value);
    
    // 确保属性也被设置，保持一致性
    if (this.getAttribute('api-url') !== value) {
      this.setAttribute('api-url', value);
    }
    
    this.apiUrl = value;
    this.loadSensitiveFields();
  }
  
  get url() {
    return this.apiUrl;
  }
  
  connectedCallback() {
    this.render();
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${Styles.cssText}
        
        .sensitive-panel {
          padding: 8px 0;
        }
        
        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          color: #6B7280;
        }
        
        .spinner {
          animation: rotate 2s linear infinite;
          width: 30px;
          height: 30px;
        }
        
        .spinner .path {
          stroke: var(--primary-color);
          stroke-linecap: round;
          animation: dash 1.5s ease-in-out infinite;
        }
        
        .empty {
          text-align: center;
          padding: 20px;
          color: #6B7280;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        
        .sensitive-list {
          margin-bottom: 16px;
        }
        
        .error {
          color: var(--danger-color);
          text-align: center;
          padding: 16px;
        }
        
        .actions {
          margin-top: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .action {
          padding: 6px 12px;
          font-size: 12px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          background-color: var(--panel-background);
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
        
        .refresh-btn {
          margin-right: auto;
        }
        
        .status-summary {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
        }
        
        .status-count {
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .status-count-0 {
          background-color: #F3F4F6;
          color: #9CA3AF;
        }
        
        .status-count-1 {
          background-color: #ECFDF5;
          color: #10B981;
        }
        
        .status-count-2 {
          background-color: #FEF3C7;
          color: #F59E0B;
        }
        
        .status-count-3 {
          background-color: #FEE2E2;
          color: #EF4444;
        }
        
        .section-divider {
          margin: 16px 0;
          border-top: 1px solid var(--border-color);
        }
        
        .partial-loading {
          opacity: 0.7;
          pointer-events: none;
          position: relative;
        }
        
        .partial-loading::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.4);
          border-radius: 4px;
        }
        
        .toast-message {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: #10B981;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          z-index: 9999;
          transform: translateY(100px);
          opacity: 0;
          transition: transform 0.3s, opacity 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .toast-message.show {
          transform: translateY(0);
          opacity: 1;
        }
        
        .toast-message.error {
          background-color: #EF4444;
        }
      </style>
      
      <div class="sensitive-panel">
        ${this.loading ? this._renderLoading() : ''}
        ${this.error ? this._renderError() : ''}
        ${!this.loading && !this.error && this.aggregatedFields.length === 0 ? this._renderEmpty() : ''}
        ${!this.loading && !this.error && this.aggregatedFields.length > 0 ? this._renderFields() : ''}
      </div>
      
      <div id="toast" class="toast-message">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span id="toast-text">操作成功</span>
      </div>
    `;
    
    this.setupEventListeners();
  }
  
  _renderLoading() {
    return `
      <div class="loading">
        ${getSvgIcon('spinner')}
        <p>获取敏感字段信息...</p>
      </div>
    `;
  }
  
  _renderError() {
    return `
      <div class="error">
        <p>获取敏感字段信息失败</p>
        <p>${this.error}</p>
        <button class="action" id="retry-btn">重试</button>
      </div>
    `;
  }
  
  _renderEmpty() {
    return `
      <div class="empty">
        ${getSvgIcon('file')}
        <p>暂无敏感字段信息</p>
      </div>
    `;
  }
  
  _renderFields() {
    // 计算各状态的字段数量
    const statusCounts = { 0: 0, 1: 0, 2: 0, 3: 0 };
    this.aggregatedFields.forEach(group => {
      group.fields.forEach(field => {
        statusCounts[field.status] = (statusCounts[field.status] || 0) + 1;
      });
    });
    
    const statusNames = {
      0: 'Init',
      1: 'Confirmed',
      2: 'Ignored',
      3: 'Deleted'
    };
    
    return `
      <div class="status-summary">
        ${Object.entries(statusCounts).map(([status, count]) => 
          count > 0 ? `<div class="status-count status-count-${status}">
            ${statusNames[status]}: ${count}
          </div>` : ''
        ).join('')}
      </div>
      
      <div class="sensitive-list" id="sensitive-fields-list">
        ${this.aggregatedFields.map((group, index) => `
          <div class="field-group" data-url="${group.feignRequestUrl}">
            <api-sensitive-field
              feign-request-url="${group.feignRequestUrl}"
              fields='${JSON.stringify(group.fields)}'
            ></api-sensitive-field>
            ${index < this.aggregatedFields.length - 1 ? '<div class="section-divider"></div>' : ''}
          </div>
        `).join('')}
      </div>
      
      <div class="actions">
        <button class="action refresh-btn" id="refresh-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 4v6h-6"></path>
            <path d="M1 20v-6h6"></path>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
            <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path>
          </svg>
          刷新
        </button>
        <button class="action primary" id="save-btn">
          ${getSvgIcon('check')}
          保存设置
        </button>
      </div>
    `;
  }
  
  setupEventListeners() {
    // 重试按钮
    const retryBtn = this.shadowRoot.getElementById('retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.loadSensitiveFields();
      });
    }
    
    // 刷新按钮
    const refreshBtn = this.shadowRoot.getElementById('refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.refreshSensitiveFields();
      });
    }
    
    // 保存按钮
    const saveBtn = this.shadowRoot.getElementById('save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.saveSettings();
      });
    }
    
    // 监听敏感字段组件的刷新事件
    this.shadowRoot.addEventListener('refresh-sensitive-fields', (e) => {
      const { fieldId, feignRequestUrl } = e.detail;
      console.log(`接收到字段 ${fieldId} 的刷新请求，URL: ${feignRequestUrl}`);
      
      // 显示成功消息
      this.showToast('字段状态已更新', 'success');
      
      // 更新敏感字段统计
      this.updateSensitiveCount();
    });
  }
  
  loadSensitiveFields() {
    if (!this.apiUrl) {
      console.error('No API URL provided to load sensitive fields');
      return;
    }
    
    console.log('开始加载敏感字段数据:', this.apiUrl);
    this.loading = true;
    this.error = null;
    this.render();
    
    fetchAccurateSensitiveFields(this.apiUrl)
      .then(data => {
        console.log('获取到敏感字段数据:', data);
        // 数据已经在fetchAccurateSensitiveFields中通过aggregateSensitiveFields聚合过，
        // 所以这里直接使用而不需要额外处理
        this.aggregatedFields = data;
        this.loading = false;
        this.render();
        
        // 更新敏感字段统计
        this.updateSensitiveCount();
      })
      .catch(error => {
        console.error('加载敏感字段数据失败:', error);
        this.loading = false;
        this.error = error.message || '获取敏感字段失败';
        this.render();
      });
  }
  
  // 该方法不再需要，但保留以便其他地方可能的调用
  processFieldsData(data) {
    // 如果数据已经是聚合格式，直接返回
    if (data.length > 0 && data[0].fields && data[0].feignRequestUrl) {
      console.log('数据已经是聚合格式，不需要处理');
      return data;
    }
    
    console.log('处理原始字段数据为聚合格式');
    // 聚合及处理字段数据
    const processedData = [];
    const urlGroups = {};
    
    // 分组数据
    data.forEach(item => {
      if (!urlGroups[item.feignRequestUrl]) {
        urlGroups[item.feignRequestUrl] = [];
      }
      urlGroups[item.feignRequestUrl].push(item);
    });
    
    // 处理每个URL组
    Object.entries(urlGroups).forEach(([url, items]) => {
      const fields = items.map(item => ({
        id: item.id,
        path: item.confirmedSensitiveFieldPath,
        status: item.status,
        original: item // 保存原始数据
      }));
      
      processedData.push({
        feignRequestUrl: url,
        fields
      });
    });
    
    return processedData;
  }
  
  refreshSensitiveFields() {
    if (!this.apiUrl) {
      console.error('No API URL provided to refresh sensitive fields');
      return;
    }
    
    console.log('刷新敏感字段数据:', this.apiUrl);
    
    // 获取列表容器
    const listContainer = this.shadowRoot.getElementById('sensitive-fields-list');
    if (listContainer) {
      listContainer.classList.add('partial-loading');
    }
    
    // 禁用刷新按钮
    const refreshBtn = this.shadowRoot.getElementById('refresh-btn');
    if (refreshBtn) {
      refreshBtn.disabled = true;
    }
    
    fetchAccurateSensitiveFields(this.apiUrl)
      .then(data => {
        console.log('刷新获取到敏感字段数据:', data);
        // 数据已经在fetchAccurateSensitiveFields中通过aggregateSensitiveFields聚合过
        this.aggregatedFields = data;
        this.render();
        
        // 显示刷新成功消息
        this.showToast('数据已刷新', 'success');
        
        // 更新敏感字段统计
        this.updateSensitiveCount();
      })
      .catch(error => {
        console.error('刷新敏感字段数据失败:', error);
        this.showToast(`刷新失败: ${error.message}`, 'error');
      })
      .finally(() => {
        // 恢复界面状态
        if (listContainer) {
          listContainer.classList.remove('partial-loading');
        }
        if (refreshBtn) {
          refreshBtn.disabled = false;
        }
      });
  }
  
  updateSensitiveCount() {
    // 计算所有已确认的敏感字段数量
    let sensitiveCount = 0;
    const statusCounts = { 0: 0, 1: 0, 2: 0, 3: 0 };
    
    this.aggregatedFields.forEach(group => {
      group.fields.forEach(field => {
        statusCounts[field.status] = (statusCounts[field.status] || 0) + 1;
        if (field.status === 1) { // 确认状态
          sensitiveCount++;
        }
      });
    });
    
    console.log('字段状态统计:', statusCounts);
    
    this.dispatchEvent(new CustomEvent('sensitive-count-updated', {
      bubbles: true,
      composed: true,
      detail: { 
        sensitiveCount,
        statusCounts
      }
    }));
  }
  
  saveSettings() {
    // 这里应该发送请求到后端保存敏感字段设置
    // 收集所有需要更新的字段
    const fieldsToUpdate = [];
    this.aggregatedFields.forEach(group => {
      group.fields.forEach(field => {
        fieldsToUpdate.push({
          id: field.id,
          path: field.path,
          status: field.status,
          feignRequestUrl: group.feignRequestUrl
        });
      });
    });
    
    // 输出到控制台
    console.log('将保存以下敏感字段设置:', fieldsToUpdate);
    
    // 模拟一个成功操作
    setTimeout(() => {
      this.showToast('敏感字段设置已保存', 'success');
      this.updateSensitiveCount();
    }, 500);
  }
  
  showToast(message, type = 'success') {
    const toast = this.shadowRoot.getElementById('toast');
    const toastText = this.shadowRoot.getElementById('toast-text');
    
    if (toast && toastText) {
      toastText.textContent = message;
      
      // 设置toast类型
      toast.classList.remove('error');
      if (type === 'error') {
        toast.classList.add('error');
      }
      
      // 显示toast
      toast.classList.add('show');
      
      // 3秒后自动隐藏
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  }
}

// Define custom element
customElements.define('api-sensitive-panel', ApiSensitivePanel);