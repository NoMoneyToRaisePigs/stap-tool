// src/api-sensitive-field.js
import { Styles } from './styles.js';
import { confirmSensitiveRequest } from './utils/api.js';

export class ApiSensitiveField extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.fields = [];
    this.feignRequestUrl = '';
    
    // 字段状态配置
    this.statusConfig = {
      0: { name: 'Init', color: '#9CA3AF', bgColor: '#F3F4F6' },
      1: { name: 'Confirmed', color: '#10B981', bgColor: '#ECFDF5' },
      2: { name: 'Ignored', color: '#F59E0B', bgColor: '#FEF3C7' },
      3: { name: 'Deleted', color: '#EF4444', bgColor: '#FEE2E2' }
    };
    
    // 绑定方法
    this._handleStatusChange = this._handleStatusChange.bind(this);
    this._handleDropdownToggle = this._handleDropdownToggle.bind(this);
    this._handleClickOutside = this._handleClickOutside.bind(this);
  }
  
  static get observedAttributes() {
    return ['fields', 'feign-request-url'];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'fields' && newValue) {
      try {
        this.fields = JSON.parse(newValue);
        this.render();
      } catch (error) {
        console.error('解析字段数据失败:', error);
      }
    }
    
    if (name === 'feign-request-url' && newValue) {
      this.feignRequestUrl = newValue;
      this.render();
    }
  }
  
  connectedCallback() {
    document.addEventListener('click', this._handleClickOutside);
    this.render();
  }
  
  disconnectedCallback() {
    document.removeEventListener('click', this._handleClickOutside);
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${Styles.cssText}
        
        .sensitive-field-container {
          padding: 12px;
          border-radius: 6px;
          background-color: var(--panel-background);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 12px;
        }
        
        .url-title {
          font-weight: 500;
          margin-bottom: 10px;
          font-size: 14px;
          color: var(--header-color);
          word-break: break-all;
        }
        
        .field-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 10px;
          border-radius: 4px;
          margin-bottom: 6px;
          transition: background-color 0.2s;
          border: 1px solid var(--border-color);
          position: relative;
        }
        
        .field-item:hover {
          background-color: #F9FAFB;
        }
        
        .field-path {
          font-family: 'Courier New', monospace;
          font-size: 13px;
          flex-grow: 1;
          margin-right: 8px;
          user-select: all;
          word-break: break-all;
        }
        
        .field-status {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }
        
        .status-badge {
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
        }
        
        .status-menu {
          position: relative;
          margin-left: 8px;
        }
        
        .status-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background-color: #ccc;
          position: relative;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .status-dot::after {
          content: "⋮";
          color: white;
          font-weight: bold;
          transform: rotate(90deg);
        }
        
        .status-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          min-width: 150px;
          background-color: white;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 10;
          display: none;
        }
        
        .status-dropdown.show {
          display: block;
        }
        
        .status-option {
          padding: 6px 12px;
          font-size: 12px;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .status-option:hover {
          background-color: #F3F4F6;
        }
        
        .status-option:first-child {
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }
        
        .status-option:last-child {
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
        }
        
        .status-color {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          z-index: 5;
        }
        
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #ccc;
          border-top-color: var(--primary-color);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
      
      <div class="sensitive-field-container">
        <div class="url-title">${this.feignRequestUrl}</div>
        ${this.fields.map(field => this._renderField(field)).join('')}
      </div>
    `;
    
    // 添加事件监听器
    this.shadowRoot.querySelectorAll('.status-dot').forEach(dot => {
      dot.addEventListener('click', this._handleDropdownToggle);
    });
    
    this.shadowRoot.querySelectorAll('.status-option').forEach(option => {
      option.addEventListener('click', this._handleStatusChange);
    });
  }
  
  _renderField(field) {
    const status = this.statusConfig[field.status] || this.statusConfig[0];
    
    return `
      <div class="field-item" data-field-id="${field.id}">
        <div class="field-path">${field.path}</div>
        <div class="field-status">
          <div class="status-badge" style="background-color: ${status.bgColor}; color: ${status.color};">
            ${status.name}
          </div>
          <div class="status-menu">
            <div class="status-dot" style="background-color: ${status.color};" data-field-id="${field.id}"></div>
            <div class="status-dropdown" id="dropdown-${field.id}">
              ${Object.entries(this.statusConfig).map(([statusId, statusData]) => `
                <div class="status-option" data-field-id="${field.id}" data-status="${statusId}">
                  <span class="status-color" style="background-color: ${statusData.color};"></span>
                  <span>${statusData.name}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  _handleDropdownToggle(event) {
    const fieldId = event.currentTarget.getAttribute('data-field-id');
    const dropdown = this.shadowRoot.getElementById(`dropdown-${fieldId}`);
    
    // 关闭所有其他下拉菜单
    this.shadowRoot.querySelectorAll('.status-dropdown.show').forEach(el => {
      if (el.id !== `dropdown-${fieldId}`) {
        el.classList.remove('show');
      }
    });
    
    // 切换当前下拉菜单
    dropdown.classList.toggle('show');
    
    // 阻止事件冒泡
    event.stopPropagation();
  }
  
  _handleClickOutside(event) {
    // 检查事件源是否在shadowRoot之外
    const path = event.composedPath();
    if (!path.includes(this.shadowRoot)) {
      // 关闭所有下拉菜单
      this.shadowRoot.querySelectorAll('.status-dropdown.show').forEach(el => {
        el.classList.remove('show');
      });
    }
  }
  
  _handleStatusChange(event) {
    const fieldId = event.currentTarget.getAttribute('data-field-id');
    const newStatus = parseInt(event.currentTarget.getAttribute('data-status'));
    
    // 查找字段
    const field = this.fields.find(f => f.id.toString() === fieldId);
    if (!field) {
      console.error('未找到字段ID:', fieldId);
      return;
    }
    
    // 如果状态相同，不做任何操作
    if (field.status === newStatus) {
      // 关闭下拉菜单
      this.shadowRoot.getElementById(`dropdown-${fieldId}`).classList.remove('show');
      return;
    }
    
    // 添加加载状态
    const fieldElement = this.shadowRoot.querySelector(`.field-item[data-field-id="${fieldId}"]`);
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = '<div class="spinner"></div>';
    fieldElement.appendChild(loadingOverlay);
    
    // 确保我们有原始数据
    if (!field.original) {
      console.error('字段缺少原始数据:', field);
      fieldElement.removeChild(loadingOverlay);
      return;
    }
    
    // 构建请求数据
    const requestData = {
      id: field.id,
      feignRequestUrl: this.feignRequestUrl,
      scannedSensitiveFieldPath: field.original.scannedSensitiveFieldPath || field.path,
      confirmedSensitiveFieldPath: field.path,
      sensitiveKeywordType: field.original.sensitiveKeywordType || 'USER',
      status: newStatus,
      feignInvocationId: field.original.feignInvocationId || 0
    };
    
    console.log('发送状态更新请求:', requestData);
    
    // 发送请求更新字段状态
    confirmSensitiveRequest(requestData)
      .then(response => {
        console.log('字段状态更新成功:', response);
        
        // 更新本地状态
        field.status = newStatus;
        
        // 触发刷新事件
        this.dispatchEvent(new CustomEvent('refresh-sensitive-fields', {
          bubbles: true,
          composed: true,
          detail: {
            fieldId: field.id,
            status: newStatus,
            feignRequestUrl: this.feignRequestUrl
          }
        }));
        
        // 重新渲染
        this.render();
      })
      .catch(error => {
        console.error('更新字段状态失败:', error);
        alert(`更新字段状态失败: ${error.message}`);
      })
      .finally(() => {
        // 移除加载状态
        if (fieldElement && loadingOverlay.parentNode === fieldElement) {
          fieldElement.removeChild(loadingOverlay);
        }
        
        // 关闭下拉菜单
        const dropdown = this.shadowRoot.getElementById(`dropdown-${fieldId}`);
        if (dropdown) {
          dropdown.classList.remove('show');
        }
      });
  }
}

// 注册自定义元素
customElements.define('api-sensitive-field', ApiSensitiveField);