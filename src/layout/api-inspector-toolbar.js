// src/api-inspector-toolbar.js
import { Styles, getSvgIcon } from '@/styles/index.js';

export class ApiInspectorToolbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
    this.setupEventListeners();
  }
  
  connectedCallback() {
    this.updateStats({ requestCount: 0, sensitiveCount: 0 });
    
    // 监听请求数量变化
    window.addEventListener('api-stats-updated', (e) => {
      this.updateStats(e.detail);
    });
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${Styles.cssText}
        
        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-color);
          background-color: var(--panel-background);
        }
        
        .search {
          display: flex;
          align-items: center;
          flex: 1;
          max-width: 240px;
          position: relative;
        }
        
        .search-icon {
          position: absolute;
          left: 8px;
          color: #9CA3AF;
        }
        
        .search input {
          width: 100%;
          padding: 6px 12px 6px 32px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 12px;
          color: var(--text-color);
          outline: none;
        }
        
        .search input:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
        }
        
        .stats {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #6B7280;
        }
        
        .stat {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      </style>
      
      <div class="toolbar">
        <div class="search">
          <div class="search-icon">
            ${getSvgIcon('search')}
          </div>
          <input type="text" placeholder="搜索API..." id="search-input">
        </div>
        <div class="stats">
          <div class="stat">
            ${getSvgIcon('requests')}
            <span id="request-count">0</span> 请求
          </div>
          <div class="stat">
            ${getSvgIcon('warning')}
            <span id="sensitive-count">0</span> 敏感
          </div>
        </div>
      </div>
    `;
  }
  
  setupEventListeners() {
    const searchInput = this.shadowRoot.getElementById('search-input');
    
    searchInput.addEventListener('input', (e) => {
      this.dispatchEvent(new CustomEvent('search-changed', {
        bubbles: true,
        composed: true,
        detail: { searchTerm: e.target.value }
      }));
    });
  }
  
  updateStats({ requestCount, sensitiveCount }) {
    const requestCountElement = this.shadowRoot.getElementById('request-count');
    const sensitiveCountElement = this.shadowRoot.getElementById('sensitive-count');
    
    if (requestCountElement) {
      requestCountElement.textContent = requestCount || 0;
    }
    
    if (sensitiveCountElement) {
      sensitiveCountElement.textContent = sensitiveCount || 0;
    }
  }
}

// Define custom element
customElements.define('api-inspector-toolbar', ApiInspectorToolbar);