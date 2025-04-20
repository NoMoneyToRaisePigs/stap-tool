// src/api-inspector-header.js
import { Styles, getSvgIcon } from '@/styles/index.js';

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
    // 等待DOM完全加载，并确保父元素准备好
    setTimeout(() => this.setupDrag(), 200);
    
    // 监听来自container的最小化状态变更
    if (this.parentElement) {
      this.parentElement.addEventListener('minimized-changed', (e) => {
        this.minimized = e.detail.minimized;
        this.updateMinimizeButton();
      });
    }
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
          <span>Stap Plugin</span>
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
    if (button) {
      button.innerHTML = this.minimized ? getSvgIcon('maximize') : getSvgIcon('minimize');
    }
  }
  
  setupEventListeners() {
    const minimizeButton = this.shadowRoot.getElementById('minimize-button');
    const closeButton = this.shadowRoot.getElementById('close-button');
    
    if (minimizeButton) {
      minimizeButton.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止冒泡，避免触发拖拽
        
        this.dispatchEvent(new CustomEvent('minimize-toggle', {
          bubbles: true,
          composed: true
        }));
      });
    }
    
    if (closeButton) {
      closeButton.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止冒泡，避免触发拖拽
        
        this.dispatchEvent(new CustomEvent('close-inspector', {
          bubbles: true,
          composed: true
        }));
      });
    }
  }
  
  setupDrag() {
    // 确保找到要拖拽的元素
    const header = this.shadowRoot.getElementById('header');
    if (!header) {
      console.error('找不到header元素');
      return;
    }
    
    // 获取容器元素（父元素）
    const container = this.parentElement;
    if (!container) {
      console.error('找不到容器元素');
      return;
    }
    
    // 确保容器有定位属性
    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'fixed';
    }
    
    console.log('初始化拖拽功能', { header, container });
    
    // 拖拽状态变量
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let containerStartX = 0; 
    let containerStartY = 0;
    
    // 鼠标按下时开始拖拽
    const onMouseDown = (e) => {
      // 如果是按钮点击，不启动拖拽
      if (e.target.tagName === 'BUTTON' || 
          e.target.closest('button') || 
          e.target.closest('.button')) {
        return;
      }
      
      // 阻止默认行为和事件冒泡
      e.preventDefault();
      e.stopPropagation();
      
      // 获取当前鼠标位置
      startX = e.clientX;
      startY = e.clientY;
      
      // 获取容器当前位置
      const rect = container.getBoundingClientRect();
      containerStartX = rect.left;
      containerStartY = rect.top;
      
      // 标记拖拽开始
      isDragging = true;
      
      // 添加移动和释放事件监听
      document.addEventListener('mousemove', onMouseMove, { passive: false });
      document.addEventListener('mouseup', onMouseUp);
      
      // 添加拖拽中的样式
      container.classList.add('dragging');
      
      console.log('拖拽开始', { startX, startY, containerStartX, containerStartY });
    };
    
    // 鼠标移动时更新位置
    const onMouseMove = (e) => {
      if (!isDragging) return;
      
      // 阻止默认行为和事件冒泡
      e.preventDefault();
      e.stopPropagation();
      
      // 计算移动距离
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      // 计算新位置
      const newX = containerStartX + deltaX;
      const newY = containerStartY + deltaY;
      
      // 临时更新位置（立即响应）
      container.style.left = `${newX}px`;
      container.style.top = `${newY}px`;
      container.style.right = '';
      container.style.bottom = '';
      
      // 触发位置变更事件
      container.dispatchEvent(new CustomEvent('position-changed', {
        bubbles: true,
        composed: true,
        detail: { x: newX, y: newY }
      }));
    };
    
    // 鼠标释放时结束拖拽
    const onMouseUp = (e) => {
      if (!isDragging) return;
      
      // 阻止事件冒泡
      e.stopPropagation();
      
      // 标记拖拽结束
      isDragging = false;
      
      // 移除事件监听
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      
      // 移除拖拽中的样式
      container.classList.remove('dragging');
      
      // 获取最终位置
      const rect = container.getBoundingClientRect();
      const finalX = rect.left;
      const finalY = rect.top;
      
      // 触发最终位置事件，确保位置被保存
      container.dispatchEvent(new CustomEvent('position-changed', {
        bubbles: true,
        composed: true,
        detail: { x: finalX, y: finalY }
      }));
      
      console.log('拖拽结束', { finalX, finalY });
    };
    
    // 添加鼠标事件监听
    header.addEventListener('mousedown', onMouseDown);
    
    // 调试信息
    console.log('拖拽功能初始化完成');
  }
}

// Define custom element
customElements.define('api-inspector-header', ApiInspectorHeader);