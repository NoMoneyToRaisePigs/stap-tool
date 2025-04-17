// src/api-sensitive-field.js
import { Styles, getSvgIcon } from './styles.js';

export class ApiSensitiveField extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._field = {
      name: '',
      path: '',
      isSensitive: false,
      description: ''
    };
  }
  
  static get observedAttributes() {
    return ['name', 'path', 'is-sensitive', 'description'];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'name') {
      this._field.name = newValue;
    } else if (name === 'path') {
      this._field.path = newValue;
    } else if (name === 'is-sensitive') {
      this._field.isSensitive = newValue === 'true';
    } else if (name === 'description') {
      this._field.description = newValue;
    }
    
    this.render();
  }
  
  // 通过属性设置字段数据
  set field(data) {
    this._field = { ...this._field, ...data };
    this.render();
  }
  
  get field() {
    return this._field;
  }
  
  connectedCallback() {
    this.render();
  }
  
  render() {
    const { name, path, isSensitive, description } = this._field;
    
    this.shadowRoot.innerHTML = `
      <style>
        ${Styles.cssText}
        
        .sensitive-field {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          margin-bottom: 8px;
          background-color: #FAFAFA;
          transition: all 0.2s;
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
        
        .field-name {
          font-weight: 500;
          font-size: 13px;
        }
        
        .field-path {
          font-size: 11px;
          color: #6B7280;
        }
        
        .field-description {
          font-size: 11px;
          color: #6B7280;
          margin-top: 2px;
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
      </style>
      
      <div class="sensitive-field ${isSensitive ? 'marked' : ''}">
        <div class="field-info">
          <div class="field-name">${name}</div>
          <div class="field-path">${path}</div>
          ${description ? `<div class="field-description">${description}</div>` : ''}
        </div>
        <div class="field-actions">
          ${isSensitive ? 
            `<button class="unmark" title="取消敏感标记" id="toggle-btn">
              ${getSvgIcon('unmark')}
            </button>` : 
            `<button class="mark" title="标记为敏感" id="toggle-btn">
              ${getSvgIcon('mark')}
            </button>`
          }
          <button class="filter" title="过滤此字段" id="filter-btn">
            ${getSvgIcon('filter')}
          </button>
        </div>
      </div>
    `;
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    const toggleBtn = this.shadowRoot.getElementById('toggle-btn');
    const filterBtn = this.shadowRoot.getElementById('filter-btn');
    
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this._field.isSensitive = !this._field.isSensitive;
        
        this.dispatchEvent(new CustomEvent('sensitive-toggle', {
          bubbles: true,
          composed: true,
          detail: { field: this._field }
        }));
        
        this.render();
      });
    }
    
    if (filterBtn) {
      filterBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('field-filter', {
          bubbles: true,
          composed: true,
          detail: { field: this._field }
        }));
      });
    }
  }
}

// Define custom element
customElements.define('api-sensitive-field', ApiSensitiveField);