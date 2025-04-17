// src/api-sensitive-panel.js
import { Styles, getSvgIcon, fetchSensitiveFields } from './styles.js';

export class ApiSensitivePanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.fields = [];
    this.loading = true;
    this.error = null;
    this.apiUrl = '';
  }
  
  static get observedAttributes() {
    return ['api-url'];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'api-url' && newValue && newValue !== oldValue) {
      this.apiUrl = newValue;
      this.loadSensitiveFields();
    }
  }
  
  // 设置API URL
  set url(value) {
    this.apiUrl = value;
    this.loadSensitiveFields();
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
      </style>
      
      <div class="sensitive-panel">
        ${this.loading ? this._renderLoading() : ''}
        ${this.error ? this._renderError() : ''}
        ${!this.loading && !this.error && this.fields.length === 0 ? this._renderEmpty() : ''}
        ${!this.loading && !this.error && this.fields.length > 0 ? this._renderFields() : ''}
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
        ${this.fields.map(field => `
          <api-sensitive-field
            name="${field.name}"
            path="${field.path}"
            is-sensitive="${field.isSensitive}"
            description="${field.description || ''}"
          ></api-sensitive-field>
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
      const { field } = e.detail;
      const index = this.fields.findIndex(f => f.name === field.name && f.path === field.path);
      
      if (index >= 0) {
        this.fields[index].isSensitive = field.isSensitive;
      }
    });
    
    this.shadowRoot.addEventListener('field-filter', (e) => {
      const { field } = e.detail;
      alert(`字段 "${field.name}" 已设置为过滤处理`);
    });
  }
  
  loadSensitiveFields() {
    if (!this.apiUrl) return;
    
    this.loading = true;
    this.error = null;
    this.render();
    
    fetchSensitiveFields(this.apiUrl)
      .then(fields => {
        this.fields = fields;
        this.loading = false;
        this.render();
        
        // 更新敏感字段统计
        this.updateSensitiveCount();
      })
      .catch(error => {
        this.loading = false;
        this.error = error.message || '获取敏感字段失败';
        this.render();
      });
  }
  
  updateSensitiveCount() {
    const sensitiveCount = this.fields.filter(f => f.isSensitive).length;
    
    this.dispatchEvent(new CustomEvent('sensitive-count-updated', {
      bubbles: true,
      composed: true,
      detail: { sensitiveCount }
    }));
  }
  
  saveSettings() {
    // 这里应该发送请求到后端保存敏感字段设置
    // 模拟一个成功操作
    setTimeout(() => {
      alert('敏感字段设置已保存');
      this.updateSensitiveCount();
    }, 500);
  }
}

// Define custom element
customElements.define('api-sensitive-panel', ApiSensitivePanel);