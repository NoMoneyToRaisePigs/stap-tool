// src/api-sensitive-field.js
import { Styles, getSvgIcon } from './styles.js';

export class ApiSensitiveField extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.feignRequestUrl = '';
    this.fields = [];
  }
  
  static get observedAttributes() {
    return ['feign-request-url', 'fields'];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'feign-request-url') {
      this.feignRequestUrl = newValue;
    } else if (name === 'fields') {
      try {
        this.fields = JSON.parse(newValue);
      } catch (e) {
        console.error('Invalid fields data:', e);
        this.fields = [];
      }
    }
    
    this.render();
  }
  
  connectedCallback() {
    this.render();
  }
  
  render() {
    if (!this.feignRequestUrl) {
      console.warn('No feignRequestUrl provided to ApiSensitiveField');
      return;
    }
    
    if (!this.fields || this.fields.length === 0) {
      console.warn('No fields data available for URL:', this.feignRequestUrl);
    } else {
      console.log('渲染字段数据:', { url: this.feignRequestUrl, fields: this.fields });
    }
    
    this.shadowRoot.innerHTML = `
      <style>
        ${Styles.cssText}
        
        .sensitive-group {
          padding: 8px;
          border-radius: 4px;
          background-color: #FAFAFA;
          margin-bottom: 8px;
        }
        
        .group-header {
          padding: 8px 0;
          margin-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .group-title {
          font-weight: 600;
          font-size: 14px;
          color: var(--text-color);
        }
        
        .group-subtitle {
          font-size: 12px;
          color: #6B7280;
          margin-top: 2px;
        }
        
        .sensitive-field {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          margin-bottom: 8px;
          background-color: #FFFFFF;
          transition: all 0.2s;
        }
        
        .sensitive-field:last-child {
          margin-bottom: 0;
        }
        
        .sensitive-field.marked {
          background-color: rgba(239, 68, 68, 0.05);
          border-left: 3px solid var(--danger-color);
        }
        
        .field-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .field-path {
          font-weight: 500;
          font-size: 13px;
        }
        
        .field-status {
          font-size: 11px;
          color: #6B7280;
          margin-top: 2px;
        }
        
        .status-confirmed {
          color: var(--success-color);
        }
        
        .status-pending {
          color: var(--warning-color);
        }
        
        .field-actions {
          display: flex;
          gap: 6px;
        }
        
        .field-actions button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }
        
        .field-actions button:hover {
          background-color: #F3F4F6;
        }
        
        .field-actions button.mark {
          color: var(--danger-color);
        }
        
        .field-actions button.unmark {
          color: #6B7280;
        }
        
        .field-actions button.filter {
          color: var(--primary-color);
        }
      </style>
      
      <div class="sensitive-group">
        <div class="group-header">
          <div class="group-title">${this.feignRequestUrl}</div>
          <div class="group-subtitle">包含 ${this.fields.length} 个敏感字段路径</div>
        </div>
        
        <div class="fields-container">
          ${this.fields.map(field => this._renderField(field)).join('')}
        </div>
      </div>
    `;
    
    this.setupEventListeners();
  }
  
  _renderField(field) {
    const { id, path, status, isSensitive } = field;
    const statusClass = status === 'CONFIRMED' ? 'status-confirmed' : 'status-pending';
    const statusText = status === 'CONFIRMED' ? '已确认' : '待确认';
    
    return `
      <div class="sensitive-field ${isSensitive ? 'marked' : ''}" data-field-id="${id}">
        <div class="field-info">
          <div class="field-path">${path}</div>
          <div class="field-status ${statusClass}">${statusText}</div>
        </div>
        <div class="field-actions">
          ${isSensitive ? 
            `<button class="unmark" title="取消敏感标记" data-action="toggle" data-field-id="${id}">
              ${getSvgIcon('unmark')}
            </button>` : 
            `<button class="mark" title="标记为敏感" data-action="toggle" data-field-id="${id}">
              ${getSvgIcon('mark')}
            </button>`
          }
          <button class="filter" title="过滤此字段" data-action="filter" data-field-id="${id}">
            ${getSvgIcon('filter')}
          </button>
        </div>
      </div>
    `;
  }
  
  setupEventListeners() {
    // 使用委托处理所有敏感字段的事件
    this.shadowRoot.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (!button) return;
      
      const fieldId = button.getAttribute('data-field-id');
      const action = button.getAttribute('data-action');
      
      if (action === 'toggle') {
        this._toggleSensitiveStatus(fieldId);
      } else if (action === 'filter') {
        this._filterField(fieldId);
      }
    });
  }
  
  _toggleSensitiveStatus(fieldId) {
    const field = this.fields.find(f => f.id === fieldId);
    if (!field) return;
    
    // 切换敏感状态
    field.isSensitive = !field.isSensitive;
    field.status = field.isSensitive ? 'CONFIRMED' : 'PENDING';
    
    // 通知父组件状态变化
    this.dispatchEvent(new CustomEvent('sensitive-toggle', {
      bubbles: true,
      composed: true,
      detail: { 
        fieldId,
        isSensitive: field.isSensitive,
        path: field.path,
        feignRequestUrl: this.feignRequestUrl
      }
    }));
    
    // 重新渲染
    this.render();
  }
  
  _filterField(fieldId) {
    const field = this.fields.find(f => f.id === fieldId);
    if (!field) return;
    
    // 通知父组件过滤字段
    this.dispatchEvent(new CustomEvent('field-filter', {
      bubbles: true,
      composed: true,
      detail: { 
        fieldId,
        path: field.path,
        feignRequestUrl: this.feignRequestUrl
      }
    }));
    
    // 显示提示
    alert(`将过滤字段路径 "${field.path}"`);
  }
}

// Define custom element
customElements.define('api-sensitive-field', ApiSensitiveField);