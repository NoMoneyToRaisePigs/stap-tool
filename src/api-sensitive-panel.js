// src/api-sensitive-panel.js
import { Styles, getSvgIcon } from './styles.js';
import { fetchSensitiveFieldsData } from './utils/api.js';

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
          justify-content: flex-end;
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
        
        .section-divider {
          margin: 16px 0;
          border-top: 1px solid var(--border-color);
        }
      </style>
      
      <div class="sensitive-panel">
        ${this.loading ? this._renderLoading() : ''}
        ${this.error ? this._renderError() : ''}
        ${!this.loading && !this.error && this.aggregatedFields.length === 0 ? this._renderEmpty() : ''}
        ${!this.loading && !this.error && this.aggregatedFields.length > 0 ? this._renderFields() : ''}
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
    return `
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
    
    // 保存按钮
    const saveBtn = this.shadowRoot.getElementById('save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.saveSettings();
      });
    }
    
    // 监听敏感字段组件事件
    this.shadowRoot.addEventListener('sensitive-toggle', (e) => {
      const { fieldId, isSensitive } = e.detail;
      
      // 更新聚合数据中的敏感状态
      this.aggregatedFields.forEach(group => {
        const field = group.fields.find(f => f.id === fieldId);
        if (field) {
          field.isSensitive = isSensitive;
          field.status = isSensitive ? 'CONFIRMED' : 'PENDING';
        }
      });
      
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
    
    fetchSensitiveFieldsData(this.apiUrl)
      .then(data => {
        console.log('获取到敏感字段数据:', data);
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
  
  updateSensitiveCount() {
    // 计算所有已确认的敏感字段数量
    let sensitiveCount = 0;
    this.aggregatedFields.forEach(group => {
      sensitiveCount += group.fields.filter(field => field.isSensitive).length;
    });
    
    this.dispatchEvent(new CustomEvent('sensitive-count-updated', {
      bubbles: true,
      composed: true,
      detail: { sensitiveCount }
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
      alert('敏感字段设置已保存');
      this.updateSensitiveCount();
    }, 500);
  }
}

// Define custom element
customElements.define('api-sensitive-panel', ApiSensitivePanel);