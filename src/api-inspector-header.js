// src/api-inspector-header.js
import { Styles, getSvgIcon } from './styles.js';
import Draggable from './js-draggable.js';

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
    // 确保DOM已经完全加载
    setTimeout(() => this.setupDrag(), 300);
    
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
          touch-action: none;
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
    
    minimizeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      
      this.dispatchEvent(new CustomEvent('minimize-toggle', {
        bubbles: true,
        composed: true
      }));
    });
    
    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      
      this.dispatchEvent(new CustomEvent('close-inspector', {
        bubbles: true,
        composed: true
      }));
    });
  }
  
  setupDrag() {
    const header = this.shadowRoot.getElementById('header');
    const container = this.parentElement;
    
    if (!header || !container) {
      console.error('找不到需要的元素:', { header, container });
      return;
    }
    
    console.log('初始化拖拽', { header, container });
    
    // 使用新的拖拽库
    this.draggable = new Draggable(header, container, {
      onDragEnd: (position) => {
        // 拖拽结束时，发送事件以保存位置
        container.dispatchEvent(new CustomEvent('position-changed', {
          bubbles: true,
          composed: true,
          detail: { 
            x: position.x, 
            y: position.y 
          }
        }));
        
        console.log('发送位置变更事件:', position);
      }
    });
  }
  
  disconnectedCallback() {
    // 销毁拖拽实例
    if (this.draggable) {
      this.draggable.destroy();
    }
  }
}

// Define custom element
customElements.define('api-inspector-header', ApiInspectorHeader);