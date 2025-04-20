// src/api-inspector-container.js
import { Styles, getSvgIcon } from '@/styles/index.js';

export class ApiInspectorContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.minimized = false;
    this.position = { left: 20, top: 20 };
    this.size = { width: 400, height: 500 };
    this.previousSize = null; // 保存最小化前的尺寸
    
    // 从localStorage加载位置和大小
    this.loadState();
    
    this.render();
    this.setupEventListeners();
  }
  
  connectedCallback() {
    // 确保元素已添加到DOM
    requestAnimationFrame(() => {
      this.setupDragAndResize();
      this.applyPosition();
    });
  }
  
  // 应用保存的位置到实际样式
  applyPosition() {
    // 直接设置容器元素样式
    this.style.position = 'fixed';
    this.style.left = `${this.position.left}px`;
    this.style.top = `${this.position.top}px`;
    this.style.right = '';
    this.style.bottom = '';
    
    console.log('应用位置:', this.position);
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
    console.log('状态已保存:', state);
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${Styles.cssText}
        
        .container {
          position: fixed;
          z-index: 9999;
          background-color: var(--background-color);
          border-radius: 8px;
          box-shadow: var(--shadow);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 200px;
          max-width: 800px;
          max-height: 800px;
          transition: width 0.3s ease, height 0.3s ease;
        }
        
        .container.minimized {
          width: 200px !important;
          height: 40px !important;
          resize: none;
        }
        
        .container:not(.minimized) {
          width: ${this.size.width}px;
          height: ${this.size.height}px;
          resize: both;
          min-height: 300px;
        }
        
        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .api-list-container {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
        }
        
        .footer-container {
          flex-shrink: 0;
        }
        
        .container.dragging {
          opacity: 0.9;
          transition: none;
        }
      </style>
      
      <div class="container ${this.minimized ? 'minimized' : ''}" id="container">
        <slot name="header"></slot>
        <div class="content" style="${this.minimized ? 'display: none;' : ''}">
          <slot name="toolbar"></slot>
          <div class="api-list-container">
            <slot name="api-list"></slot>
          </div>
          <div class="footer-container">
            <slot name="footer"></slot>
          </div>
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
      // 保存当前尺寸，以便稍后恢复
      this.previousSize = { 
        width: this.size.width, 
        height: this.size.height 
      };
      container.classList.add('minimized');
      content.style.display = 'none';
    } else {
      container.classList.remove('minimized');
      content.style.display = '';
      
      // 恢复上次的尺寸
      if (this.previousSize) {
        this.size.width = this.previousSize.width;
        this.size.height = this.previousSize.height;
        container.style.width = `${this.size.width}px`;
        container.style.height = `${this.size.height}px`;
      } else {
        // 如果没有保存的尺寸，使用默认值
        container.style.width = `${this.size.width}px`;
        container.style.height = `${this.size.height}px`;
      }
    }
    
    // 发送事件通知header更新最小化按钮
    this.dispatchEvent(new CustomEvent('minimized-changed', {
      bubbles: true,
      composed: true,
      detail: { minimized: this.minimized }
    }));
    
    this.saveState();
  }
  
  // 更新组件位置的方法
  updatePosition(x, y) {
    // 边界检查
    const minVisible = 20;
    const maxX = window.innerWidth - minVisible;
    const maxY = window.innerHeight - minVisible;
    const width = this.offsetWidth || this.size.width;
    const height = this.offsetHeight || this.size.height;
    
    // 应用边界限制
    const safeX = Math.min(maxX, Math.max(minVisible - width, x));
    const safeY = Math.min(maxY, Math.max(minVisible - height, y));
    
    // 更新内部存储的位置
    this.position = { 
      left: safeX,
      top: safeY
    };
    
    // 直接更新host元素样式
    this.style.position = 'fixed';
    this.style.left = `${safeX}px`;
    this.style.top = `${safeY}px`;
    this.style.right = '';
    this.style.bottom = '';
    
    // 保存状态
    this.saveState();
    
    console.log('位置已更新:', this.position);
    return this.position;
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
    
    // 拖拽功能在header组件中实现，这里监听position变化并更新样式
    this.addEventListener('position-changed', (e) => {
      // 获取新位置
      const x = e.detail.x;
      const y = e.detail.y;
      
      // 更新位置和样式
      this.updatePosition(x, y);
    });
  }
  
  // 辅助方法：获取元素当前位置
  getPosition() {
    const rect = this.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    };
  }
}

// Define custom element
customElements.define('api-inspector-container', ApiInspectorContainer);