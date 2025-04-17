
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var ApiInspector = (function () {
  'use strict';

  // src/styles.js
  const Styles = {
      get cssText() {
        return /* css */`
        :host {
          --primary-color: #4F46E5;
          --secondary-color: #6366F1;
          --background-color: #FFFFFF;
          --panel-background: #F9FAFB;
          --text-color: #1F2937;
          --border-color: #E5E7EB;
          --success-color: #10B981;
          --warning-color: #F59E0B;
          --danger-color: #EF4444;
          --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
  
        /* Animation Styles */
        @keyframes rotate {
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes dash {
          0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
          }
          100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
          }
        }
      `;
      }
    };
    
    function getSvgIcon(type) {
      const icons = {
        info: `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
        minimize: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
        maximize: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 12 5 19 19 19 19 12"></polyline><polyline points="12 5 12 19"></polyline></svg>`,
        close: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
        requests: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
        warning: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
        export: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
        check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`,
        refresh: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
        mark: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`,
        unmark: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l-6 6v3h9l3-3"></path><path d="M22 12l-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"></path></svg>`,
        filter: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>`,
        file: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>`,
        spinner: `<svg class="spinner" viewBox="0 0 50 50" width="30" height="30"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>`
      };
      
      return icons[type] || '';
    }
    
    function getMethodClass(method) {
      const methodMap = {
        'GET': 'method-get',
        'POST': 'method-post',
        'PUT': 'method-put',
        'DELETE': 'method-delete'
      };
      
      return methodMap[method] || '';
    }
    
    function getStatusClass(status) {
      return (status >= 200 && status < 400) ? 'status-success' : 'status-error';
    }
    
    // 模拟从后端获取敏感字段的函数
    function fetchSensitiveFields(apiUrl) {
      return new Promise((resolve, reject) => {
        // 模拟网络请求
        setTimeout(() => {
          // 这里返回模拟数据，实际应用中应该从后端获取
          const sensitiveFields = [
            {
              name: "email",
              path: "data[].email",
              isSensitive: true,
              description: "用户电子邮箱，属于个人隐私信息"
            },
            {
              name: "password",
              path: "data[].password",
              isSensitive: true,
              description: "用户密码，高度敏感信息"
            },
            {
              name: "address",
              path: "data[].address",
              isSensitive: false,
              description: "用户地址信息"
            },
            {
              name: "phone",
              path: "data[].contact.phone",
              isSensitive: true,
              description: "用户联系电话，属于个人隐私信息"
            }
          ];
          resolve(sensitiveFields);
        }, 1000);
      });
    }

  // src/api-interceptor.js
  class ApiInterceptor {
      constructor() {
        if (window.__apiTrackerLoaded) return;
        window.__apiTrackerLoaded = true;
        this.setupInterceptors();
      }
    
      setupInterceptors() {
        this.interceptFetch();
        this.interceptXHR();
      }
    
      interceptFetch() {
        const originalFetch = window.fetch;
        window.__originalFetch = originalFetch;
        window.__interceptedFetch = this.createWrappedFetch(originalFetch);
    
        Object.defineProperty(window, 'fetch', {
          configurable: true,
          enumerable: true,
          get() {
            return window.__interceptedFetch;
          },
          set(newFetch) {
            if (typeof newFetch === 'function') {
              window.__originalFetch = newFetch;
              window.__interceptedFetch = this.createWrappedFetch(newFetch);
            }
          }
        });
      }
    
      createWrappedFetch(original) {
        return async function(...args) {
          const [url, options] = args;
          const start = performance.now();
          let timestamp = new Date().toISOString();
          let requestData = null;
          
          // 捕获请求体
          if (options && options.body) {
            try {
              requestData = options.body;
              if (typeof requestData === 'string') {
                requestData = JSON.parse(requestData);
              }
            } catch (e) {
              requestData = options.body.toString();
            }
          }
          
          try {
            const res = await original.apply(this, args);
            const end = performance.now();
            const clone = res.clone();
            
            // 尝试获取响应体
            let responseData = null;
            try {
              responseData = await clone.json();
            } catch (e) {
              try {
                responseData = await clone.text();
              } catch (e) {
                responseData = 'Unable to capture response body';
              }
            }
            
            window.dispatchEvent(new CustomEvent('plugin-api-captured', {
              detail: {
                url: url instanceof Request ? url.url : url,
                method: options?.method || 'GET',
                status: res.status,
                duration: end - start,
                timestamp,
                page: location.pathname,
                requestData,
                responseData,
                headers: res.headers ? Object.fromEntries([...res.headers.entries()]) : {}
              }
            }));
            
            return res;
          } catch (error) {
            const end = performance.now();
            
            window.dispatchEvent(new CustomEvent('plugin-api-captured', {
              detail: {
                url: url instanceof Request ? url.url : url,
                method: options?.method || 'GET',
                status: 0,
                error: error.message,
                duration: end - start,
                timestamp,
                page: location.pathname,
                requestData
              }
            }));
            
            throw error;
          }
        };
      }
    
      interceptXHR() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;
    
        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
          this._apiTrackerInfo = { 
            method, 
            url,
            timestamp: new Date().toISOString(),
            page: location.pathname
          };
          return originalOpen.apply(this, [method, url, ...rest]);
        };
    
        XMLHttpRequest.prototype.send = function(body) {
          if (!this._apiTrackerInfo) {
            return originalSend.apply(this, arguments);
          }
          
          const start = performance.now();
          let requestData = null;
          
          // 捕获请求体
          if (body) {
            try {
              requestData = body;
              if (typeof body === 'string') {
                try {
                  requestData = JSON.parse(body);
                } catch (e) {
                  requestData = body;
                }
              }
            } catch (e) {
              requestData = String(body);
            }
          }
          
          this._apiTrackerInfo.requestData = requestData;
          
          const onLoadEnd = () => {
            const end = performance.now();
            let responseData = null;
            // 尝试捕获响应体
            try {
              if (this.responseType === 'json') {
                responseData = this.response;
              } else if (this.responseType === '' || this.responseType === 'text') {
                try {
                  responseData = JSON.parse(this.responseText);
                } catch (e) {
                  responseData = this.responseText;
                }
              } else {
                responseData = `Response type "${this.responseType}" not supported for capture`;
              }
            } catch (e) {
              responseData = 'Unable to capture response body';
            }
            
            // 获取headers
            const headers = {};
            if (this.getAllResponseHeaders) {
              const headerString = this.getAllResponseHeaders();
              if (headerString) {
                headerString.trim().split(/[\r\n]+/).forEach(line => {
                  const parts = line.split(': ');
                  const header = parts.shift();
                  const value = parts.join(': ');
                  headers[header] = value;
                });
              }
            }
            
            window.dispatchEvent(new CustomEvent('plugin-api-captured', {
              detail: {
                ...this._apiTrackerInfo,
                status: this.status,
                duration: end - start,
                responseData,
                headers
              }
            }));
          };
          
          this.addEventListener('loadend', onLoadEnd);
          
          return originalSend.apply(this, arguments);
        };
      }
    }

  // src/api-inspector-container.js

  class ApiInspectorContainer extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.minimized = false;
      this.position = { x: 20, y: 20 };
      this.size = { width: 400, height: 500 };
      
      // 从localStorage加载位置和大小
      this.loadState();
      
      this.render();
      this.setupEventListeners();
    }
    
    connectedCallback() {
      this.setupDragAndResize();
    }
    
    loadState() {
      const savedState = localStorage.getItem('api-inspector-state');
      if (savedState) {
        try {
          const state = JSON.parse(savedState);
          this.minimized = state.minimized || false;
          this.position = state.position || { x: 20, y: 20 };
          this.size = state.size || { width: 400, height: 500 };
        } catch (e) {
          console.error('Failed to load API Inspector state', e);
        }
      }
    }
    
    saveState() {
      const state = {
        minimized: this.minimized,
        position: this.position,
        size: this.size
      };
      localStorage.setItem('api-inspector-state', JSON.stringify(state));
    }
    
    render() {
      const containerStyle = `
      position: fixed;
      bottom: ${this.position.y}px;
      right: ${this.position.x}px;
      z-index: 9999;
      width: ${this.minimized ? '200px' : `${this.size.width}px`};
      height: ${this.minimized ? '40px' : `${this.size.height}px`};
      background-color: var(--background-color);
      border-radius: 8px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      resize: ${this.minimized ? 'none' : 'both'};
      min-width: 320px;
      min-height: ${this.minimized ? '40px' : '300px'};
      max-width: 800px;
      max-height: 800px;
      transition: all 0.3s ease;
    `;
      
      this.shadowRoot.innerHTML = `
      <style>
        ${Styles.cssText}
        
        .container {
          ${containerStyle}
        }
        
        .container.minimized {
          width: 200px !important;
          height: 40px !important;
          resize: none;
        }
        
        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
      </style>
      
      <div class="container ${this.minimized ? 'minimized' : ''}" id="container">
        <slot name="header"></slot>
        <div class="content" style="${this.minimized ? 'display: none;' : ''}">
          <slot name="toolbar"></slot>
          <slot name="api-list"></slot>
          <slot name="footer"></slot>
        </div>
      </div>
    `;
    }
    
    setupEventListeners() {
      // 监听子组件事件
      this.addEventListener('minimize-toggle', () => {
        this.toggleMinimized();
      });
      
      this.addEventListener('close-inspector', () => {
        this.style.display = 'none';
      });
    }
    
    toggleMinimized() {
      this.minimized = !this.minimized;
      const container = this.shadowRoot.getElementById('container');
      const content = this.shadowRoot.querySelector('.content');
      
      if (this.minimized) {
        container.classList.add('minimized');
        content.style.display = 'none';
      } else {
        container.classList.remove('minimized');
        content.style.display = '';
      }
      
      // 发送事件通知header更新最小化按钮
      this.dispatchEvent(new CustomEvent('minimized-changed', {
        bubbles: true,
        composed: true,
        detail: { minimized: this.minimized }
      }));
      
      this.saveState();
    }
    
    setupDragAndResize() {
      const container = this.shadowRoot.getElementById('container');
      
      // 大小调整结束时保存状态
      const resizeObserver = new ResizeObserver(entries => {
        if (!this.minimized) {
          const { width, height } = entries[0].contentRect;
          this.size = { width, height };
          this.saveState();
        }
      });
      
      resizeObserver.observe(container);
      
      // 拖拽功能在header组件中实现，这里仅监听position变化
      this.addEventListener('position-changed', (e) => {
        this.position = e.detail;
        this.saveState();
      });
    }
  }

  // Define custom element
  customElements.define('api-inspector-container', ApiInspectorContainer);

  // src/api-inspector-header.js

  class ApiInspectorHeader extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.minimized = false;
      this.render();
      this.setupEventListeners();
    }
    
    static get observedAttributes() {
      return ['minimized'];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'minimized') {
        this.minimized = newValue === 'true';
        this.updateMinimizeButton();
      }
    }
    
    connectedCallback() {
      this.setupDrag();
      
      // 监听来自container的最小化状态变更
      this.parentElement.addEventListener('minimized-changed', (e) => {
        this.minimized = e.detail.minimized;
        this.updateMinimizeButton();
      });
    }
    
    render() {
      this.shadowRoot.innerHTML = `
      <style>
        ${Styles.cssText}
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background-color: var(--primary-color);
          color: white;
          cursor: move;
          user-select: none;
        }
        
        .title {
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .title-icon {
          width: 16px;
          height: 16px;
        }
        
        .controls {
          display: flex;
          gap: 8px;
        }
        
        .button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        
        .button:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      </style>
      
      <div class="header" id="header" part="header">
        <div class="title">
          ${getSvgIcon('info')}
          <span>API Inspector</span>
        </div>
        <div class="controls">
          <button class="button" id="minimize-button">
            ${getSvgIcon('minimize')}
          </button>
          <button class="button" id="close-button">
            ${getSvgIcon('close')}
          </button>
        </div>
      </div>
    `;
    }
    
    updateMinimizeButton() {
      const button = this.shadowRoot.getElementById('minimize-button');
      button.innerHTML = this.minimized ? getSvgIcon('maximize') : getSvgIcon('minimize');
    }
    
    setupEventListeners() {
      const minimizeButton = this.shadowRoot.getElementById('minimize-button');
      const closeButton = this.shadowRoot.getElementById('close-button');
      
      minimizeButton.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('minimize-toggle', {
          bubbles: true,
          composed: true
        }));
      });
      
      closeButton.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('close-inspector', {
          bubbles: true,
          composed: true
        }));
      });
    }
    
    setupDrag() {
      const header = this.shadowRoot.getElementById('header');
      let isDragging = false;
      let startX, startY;
      let initialRight, initialBottom;
      
      const onMouseDown = (e) => {
        isDragging = true;
        
        const containerRect = this.parentElement.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        
        // 计算初始的right和bottom位置
        initialRight = window.innerWidth - containerRect.right;
        initialBottom = window.innerHeight - containerRect.bottom;
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
      };
      
      const onMouseMove = (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        // 计算新位置，确保不超出屏幕
        const newRight = Math.max(0, initialRight - deltaX);
        const newBottom = Math.max(0, initialBottom - deltaY);
        
        // 更新容器位置
        this.parentElement.style.right = `${newRight}px`;
        this.parentElement.style.bottom = `${newBottom}px`;
        
        // 发送位置变更事件
        this.dispatchEvent(new CustomEvent('position-changed', {
          bubbles: true,
          composed: true,
          detail: { x: newRight, y: newBottom }
        }));
      };
      
      const onMouseUp = () => {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      
      header.addEventListener('mousedown', onMouseDown);
    }
  }

  // Define custom element
  customElements.define('api-inspector-header', ApiInspectorHeader);

  // src/api-inspector-toolbar.js

  class ApiInspectorToolbar extends HTMLElement {
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

  // src/api-request-item.js

  class ApiRequestItem extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.expanded = false;
      this.activeTab = 'details';
      this._request = {};
    }
    
    static get observedAttributes() {
      return ['expanded', 'request'];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'expanded') {
        this.expanded = newValue === 'true';
        this._updateExpandedState();
      } else if (name === 'request') {
        try {
          this._request = JSON.parse(newValue);
          this.render();
        } catch (e) {
          console.error('Invalid request data:', e);
        }
      }
    }
    
    // 通过属性设置请求数据
    set request(data) {
      this._request = data;
      this.render();
    }
    
    get request() {
      return this._request;
    }
    
    connectedCallback() {
      this.render();
      this.setupEventListeners();
    }
    
    render() {
      if (!this._request || !this._request.url) return;
      
      const { method, url, status, duration, timestamp, page } = this._request;
      const methodClass = getMethodClass(method);
      const statusClass = getStatusClass(status);
      const statusText = status || 'Error';
      
      // 提取路径部分，忽略查询参数
      const urlObj = new URL(url.startsWith('http') ? url : `http://example.com${url}`);
      const path = urlObj.pathname;
      
      this.shadowRoot.innerHTML = `
      <style>
        ${Styles.cssText}
        
        .request {
          border: 1px solid var(--border-color);
          border-radius: 6px;
          margin-bottom: 8px;
          overflow: hidden;
          transition: all 0.2s;
        }
        
        .request:hover {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .request-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          background-color: var(--panel-background);
          cursor: pointer;
          user-select: none;
        }
        
        .request-method {
          font-weight: 600;
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        
        .method-get {
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--success-color);
        }
        
        .method-post {
          background-color: rgba(79, 70, 229, 0.1);
          color: var(--primary-color);
        }
        
        .method-put {
          background-color: rgba(245, 158, 11, 0.1);
          color: var(--warning-color);
        }
        
        .method-delete {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--danger-color);
        }
        
        .request-path {
          flex: 1;
          font-size: 12px;
          margin: 0 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--text-color);
        }
        
        .request-status {
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 4px;
        }
        
        .status-success {
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--success-color);
        }
        
        .status-error {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--danger-color);
        }
        
        .request-content {
          padding: 12px;
          font-size: 12px;
          border-top: 1px solid var(--border-color);
          background-color: var(--background-color);
          display: ${this.expanded ? 'block' : 'none'};
        }
        
        .tabs {
          display: flex;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 8px;
        }
        
        .tab {
          padding: 8px 12px;
          font-size: 12px;
          cursor: pointer;
          color: #6B7280;
          border-bottom: 2px solid transparent;
        }
        
        .tab.active {
          color: var(--primary-color);
          border-bottom-color: var(--primary-color);
          font-weight: 500;
        }
        
        .tab-content {
          display: none;
        }
        
        .tab-content.active {
          display: block;
        }
        
        .property {
          margin-bottom: 8px;
        }
        
        .property-name {
          font-weight: 500;
          margin-bottom: 4px;
          color: #4B5563;
        }
        
        .property-value {
          padding: 6px 8px;
          background-color: #F3F4F6;
          border-radius: 4px;
          font-family: monospace;
          overflow-x: auto;
          white-space: pre-wrap;
          max-height: 100px;
          overflow-y: auto;
        }
        
        .actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
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
        
        .action.primary {
          background-color: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }
        
        .action.primary:hover {
          background-color: var(--secondary-color);
        }
      </style>
      
      <div class="request">
        <div class="request-header" id="request-header">
          <span class="request-method ${methodClass}">${method}</span>
          <span class="request-path">${path}</span>
          <span class="request-status ${statusClass}">${statusText}</span>
        </div>
        <div class="request-content">
          <div class="tabs">
            <div class="tab ${this.activeTab === 'details' ? 'active' : ''}" data-tab="details">详情</div>
            <div class="tab ${this.activeTab === 'headers' ? 'active' : ''}" data-tab="headers">请求头</div>
            <div class="tab ${this.activeTab === 'response' ? 'active' : ''}" data-tab="response">响应</div>
            ${this._request.sensitivePanelActive ? `<div class="tab ${this.activeTab === 'sensitive' ? 'active' : ''}" data-tab="sensitive">敏感字段</div>` : ''}
          </div>
          
          <div class="tab-content ${this.activeTab === 'details' ? 'active' : ''}" data-content="details">
            <div class="property">
              <div class="property-name">URL</div>
              <div class="property-value">${url}</div>
            </div>
            <div class="property">
              <div class="property-name">页面</div>
              <div class="property-value">${page || location.pathname}</div>
            </div>
            <div class="property">
              <div class="property-name">时间戳</div>
              <div class="property-value">${timestamp || new Date().toISOString()}</div>
            </div>
            <div class="property">
              <div class="property-name">响应时间</div>
              <div class="property-value">${duration ? duration.toFixed(2) + ' ms' : 'N/A'}</div>
            </div>
            
            <div class="actions">
              <button class="action" id="copy-btn">
                ${getSvgIcon('export')}
                复制
              </button>
              <button class="action primary" id="analyze-btn">
                ${getSvgIcon('check')}
                分析敏感字段
              </button>
            </div>
          </div>
          
          <div class="tab-content ${this.activeTab === 'headers' ? 'active' : ''}" data-content="headers">
            <div class="property">
              <div class="property-value">${this._formatHeaders()}</div>
            </div>
          </div>
          
          <div class="tab-content ${this.activeTab === 'response' ? 'active' : ''}" data-content="response">
            <div class="property">
              <div class="property-value">${this._formatResponse()}</div>
            </div>
          </div>
          
          ${this._request.sensitivePanelActive ? `
            <div class="tab-content ${this.activeTab === 'sensitive' ? 'active' : ''}" data-content="sensitive">
              <slot name="sensitive-panel"></slot>
            </div>
          ` : ''}
        </div>
      </div>
    `;
      
      this.setupEventListeners();
    }
    
    _formatHeaders() {
      const headers = this._request.headers || {};
      let formattedHeaders = '';
      
      for (const [key, value] of Object.entries(headers)) {
        // 如果是认证信息，隐藏敏感内容
        if (key.toLowerCase() === 'authorization') {
          formattedHeaders += `${key}: ${value.split(' ')[0]} ${'*'.repeat(8)}\n`;
        } else {
          formattedHeaders += `${key}: ${value}\n`;
        }
      }
      
      return formattedHeaders || 'No headers available';
    }
    
    _formatResponse() {
      const { responseData } = this._request;
      
      if (!responseData) {
        return 'No response data available';
      }
      
      try {
        if (typeof responseData === 'string') {
          try {
            // 尝试格式化JSON字符串
            const json = JSON.parse(responseData);
            return JSON.stringify(json, null, 2);
          } catch (e) {
            return responseData;
          }
        } else {
          return JSON.stringify(responseData, null, 2);
        }
      } catch (e) {
        return String(responseData);
      }
    }
    
    setupEventListeners() {
      const requestHeader = this.shadowRoot.getElementById('request-header');
      const tabs = this.shadowRoot.querySelectorAll('.tab');
      const copyBtn = this.shadowRoot.getElementById('copy-btn');
      const analyzeBtn = this.shadowRoot.getElementById('analyze-btn');
      
      if (requestHeader) {
        requestHeader.addEventListener('click', () => {
          this.expanded = !this.expanded;
          this._updateExpandedState();
        });
      }
      
      if (tabs) {
        tabs.forEach(tab => {
          tab.addEventListener('click', (e) => {
            e.stopPropagation();
            this.activeTab = tab.getAttribute('data-tab');
            this._updateActiveTab();
          });
        });
      }
      
      if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._copyRequestDetails();
        });
      }
      
      if (analyzeBtn) {
        analyzeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this._analyzeSensitiveData();
        });
      }
    }
    
    _updateExpandedState() {
      const content = this.shadowRoot.querySelector('.request-content');
      if (content) {
        content.style.display = this.expanded ? 'block' : 'none';
      }
    }
    
    _updateActiveTab() {
      const tabs = this.shadowRoot.querySelectorAll('.tab');
      const contents = this.shadowRoot.querySelectorAll('.tab-content');
      
      tabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === this.activeTab) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
      
      contents.forEach(content => {
        if (content.getAttribute('data-content') === this.activeTab) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    }
    
    _copyRequestDetails() {
      const details = {
        method: this._request.method,
        url: this._request.url,
        status: this._request.status,
        duration: this._request.duration,
        headers: this._request.headers,
        responseData: this._request.responseData
      };
      
      navigator.clipboard.writeText(JSON.stringify(details, null, 2))
        .then(() => {
          // 可以添加复制成功的提示
          alert('请求详情已复制到剪贴板');
        })
        .catch(err => {
          console.error('复制失败:', err);
        });
    }
    
    _analyzeSensitiveData() {
      // 添加敏感字段标签
      if (!this._request.sensitivePanelActive) {
        this._request.sensitivePanelActive = true;
        this.render();
      }
      
      // 触发敏感字段分析
      this.dispatchEvent(new CustomEvent('analyze-sensitive', {
        bubbles: true,
        composed: true,
        detail: { 
          request: this._request,
          apiUrl: this._request.url
        }
      }));
      
      // 自动切换到敏感字段标签
      this.activeTab = 'sensitive';
      this._updateActiveTab();
    }
  }

  // Define custom element
  customElements.define('api-request-item', ApiRequestItem);

  // src/api-details-panel.js

  class ApiDetailsPanel extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._request = {};
    }
    
    static get observedAttributes() {
      return ['request'];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'request') {
        try {
          this._request = JSON.parse(newValue);
          this.render();
        } catch (e) {
          console.error('Invalid request data:', e);
        }
      }
    }
    
    // 通过属性设置请求数据
    set request(data) {
      this._request = data;
      this.render();
    }
    
    get request() {
      return this._request;
    }
    
    connectedCallback() {
      this.render();
    }
    
    render() {
      if (!this._request || !this._request.url) {
        this.shadowRoot.innerHTML = `
        <style>
          ${Styles.cssText}
          
          .empty {
            padding: 16px;
            text-align: center;
            color: #6B7280;
          }
        </style>
        
        <div class="empty">No request details available</div>
      `;
        return;
      }
      
      const { url, method, status, duration, timestamp, page } = this._request;
      
      this.shadowRoot.innerHTML = `
      <style>
        ${Styles.cssText}
        
        .details-panel {
          padding: 8px 0;
        }
        
        .property {
          margin-bottom: 8px;
        }
        
        .property-name {
          font-weight: 500;
          margin-bottom: 4px;
          color: #4B5563;
        }
        
        .property-value {
          padding: 6px 8px;
          background-color: #F3F4F6;
          border-radius: 4px;
          font-family: monospace;
          overflow-x: auto;
          white-space: pre-wrap;
          max-height: 100px;
          overflow-y: auto;
          font-size: 12px;
        }
        
        .actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
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
        
        .action.primary {
          background-color: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }
        
        .action.primary:hover {
          background-color: var(--secondary-color);
        }
      </style>
      
      <div class="details-panel">
        <div class="property">
          <div class="property-name">URL</div>
          <div class="property-value">${url}</div>
        </div>
        <div class="property">
          <div class="property-name">方法</div>
          <div class="property-value">${method}</div>
        </div>
        <div class="property">
          <div class="property-name">状态码</div>
          <div class="property-value">${status || 'N/A'}</div>
        </div>
        <div class="property">
          <div class="property-name">页面</div>
          <div class="property-value">${page || location.pathname}</div>
        </div>
        <div class="property">
          <div class="property-name">时间戳</div>
          <div class="property-value">${timestamp || new Date().toISOString()}</div>
        </div>
        <div class="property">
          <div class="property-name">响应时间</div>
          <div class="property-value">${duration ? duration.toFixed(2) + ' ms' : 'N/A'}</div>
        </div>
        
        <div class="actions">
          <button class="action" id="copy-btn">
            ${getSvgIcon('export')}
            复制
          </button>
          <button class="action primary" id="analyze-btn">
            ${getSvgIcon('check')}
            分析敏感字段
          </button>
        </div>
      </div>
    `;
      
      this.setupEventListeners();
    }
    
    setupEventListeners() {
      const copyBtn = this.shadowRoot.getElementById('copy-btn');
      const analyzeBtn = this.shadowRoot.getElementById('analyze-btn');
      
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          this._copyRequestDetails();
        });
      }
      
      if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
          this._analyzeSensitiveData();
        });
      }
    }
    
    _copyRequestDetails() {
      navigator.clipboard.writeText(JSON.stringify(this._request, null, 2))
        .then(() => {
          // 可以添加复制成功的提示
          alert('请求详情已复制到剪贴板');
        })
        .catch(err => {
          console.error('复制失败:', err);
        });
    }
    
    _analyzeSensitiveData() {
      this.dispatchEvent(new CustomEvent('analyze-sensitive', {
        bubbles: true,
        composed: true,
        detail: { 
          request: this._request,
          apiUrl: this._request.url
        }
      }));
    }
  }

  // Define custom element
  customElements.define('api-details-panel', ApiDetailsPanel);

  // src/api-sensitive-field.js

  class ApiSensitiveField extends HTMLElement {
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

  // src/api-sensitive-panel.js

  class ApiSensitivePanel extends HTMLElement {
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

  // src/api-inspector-footer.js

  class ApiInspectorFooter extends HTMLElement {
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
          活跃 | 当前页面: ${location.pathname}
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
      new ApiInterceptor();
      
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

  return ApiInspector;

})();
//# sourceMappingURL=api-inspector.js.map
