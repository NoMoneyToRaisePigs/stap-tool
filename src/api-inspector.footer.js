// src/api-inspector-footer.js
import { Styles, getSvgIcon } from './styles.js';

export class ApiInspectorFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }
  
  connectedCallback() {
    this.setupEventListeners();
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${Styles.cssText}
        
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-top: 1px solid var(--border-color);
          background-color: var(--panel-background);
        }
        
        .status {
          font-size: 12px;
          color: #6B7280;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--success-color);
        }
        
        .actions {
          display: flex;
          gap: 8px;
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
      </style>
      
      <div class="footer">
        <div class="status">
          <span class="status-dot"></span>
          当前页面: ${location.pathname + location.hash}
        </div>
        <div class="actions">
          <button class="action" id="export-btn">
            ${getSvgIcon('export')}
            导出JSON
          </button>
          <button class="action" id="clear-btn">
            ${getSvgIcon('refresh')}
            清除
          </button>
        </div>
      </div>
    `;
  }
  
  setupEventListeners() {
    const exportBtn = this.shadowRoot.getElementById('export-btn');
    const clearBtn = this.shadowRoot.getElementById('clear-btn');
    
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('export-data', {
          bubbles: true,
          composed: true
        }));
      });
    }
    
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('clear-data', {
          bubbles: true,
          composed: true
        }));
      });
    }
  }
}

// Define custom element
customElements.define('api-inspector-footer', ApiInspectorFooter);