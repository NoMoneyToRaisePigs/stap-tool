// src/api-inspector-header.js
import { Styles, getSvgIcon } from './styles.js';

export class ApiInspectorHeader extends HTMLElement {
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