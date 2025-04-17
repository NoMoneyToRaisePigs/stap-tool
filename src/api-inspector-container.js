// src/api-inspector-container.js
import { Styles, getSvgIcon } from './styles.js';

export class ApiInspectorContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.minimized = false;
    this.position = { left: 20, top: 20 };
    this.size = { width: 400, height: 500 };
    
    // 从localStorage加载位置和大小
    this.loadState();
    
    this.render();
    this.setupEventListeners();
  }
  
  connectedCallback() {
    this.setupDragAndResize();
    
    // 如果没有定位，则初始化到右下角
    if (!this.style.left && !this.style.top) {
      this.style.left = `${this.position.left}px`;
      this.style.top = `${this.position.top}px`;
    }
  }
  
  loadState() {
    const savedState = localStorage.getItem('api-inspector-state');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        this.minimized = state.minimized || false;
        
        // 兼容旧版本的位置数据 (x/y表示right/bottom) 转换为 left/top
        if (state.position) {
          if ('x' in state.position && 'y' in state.position) {
            // 转换旧格式 (right/bottom) 到 新格式 (left/top)
            this.position = { 
              left: window.innerWidth - (state.position.x + (state.size?.width || this.size.width)),
              top: window.innerHeight - (state.position.y + (state.size?.height || this.size.height))
            };
          } else {
            this.position = state.position;
          }
        } else {
          this.position = { left: 20, top: 20 };
        }
        
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
      left: ${this.position.left}px;
      top: ${this.position.top}px;
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
      // 更新位置存储
      this.position = { 
        left: e.detail.x,
        top: e.detail.y
      };
      this.saveState();
    });
  }
}

// Define custom element
customElements.define('api-inspector-container', ApiInspectorContainer);