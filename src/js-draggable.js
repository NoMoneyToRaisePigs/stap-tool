/**
 * 简单拖拽库，用于添加拖拽功能到任何元素
 */
class Draggable {
  /**
   * 初始化拖拽功能
   * @param {HTMLElement} dragElement - 触发拖拽的元素（把手）
   * @param {HTMLElement} targetElement - 要移动的目标元素
   * @param {Object} options - 选项
   */
  constructor(dragElement, targetElement, options = {}) {
    this.dragElement = dragElement;
    this.targetElement = targetElement || dragElement;
    
    this.options = {
      onDragStart: null,
      onDrag: null,
      onDragEnd: null,
      ...options
    };
    
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.startLeft = 0;
    this.startTop = 0;
    
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    
    this.init();
    
    console.log('拖拽初始化: ', {
      dragElement: this.dragElement,
      targetElement: this.targetElement
    });
  }
  
  /**
   * 初始化事件监听
   */
  init() {
    this.dragElement.style.cursor = 'move';
    this.dragElement.addEventListener('mousedown', this.handleMouseDown);
  }
  
  /**
   * 处理鼠标按下事件
   */
  handleMouseDown(event) {
    // 检查是否点击按钮
    if (event.target.tagName === 'BUTTON' || 
        event.target.closest('button') || 
        event.target.closest('.button')) {
      console.log('点击按钮，不进行拖拽');
      return;
    }
    
    event.preventDefault();
    event.stopPropagation();
    
    console.log('开始拖拽');
    this.isDragging = true;
    
    // 记录起始位置
    this.startX = event.clientX;
    this.startY = event.clientY;
    
    // 获取目标元素当前位置
    const rect = this.targetElement.getBoundingClientRect();
    this.startLeft = rect.left;
    this.startTop = rect.top;
    
    // 添加全局事件监听
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
    
    // 调用回调
    if (this.options.onDragStart) {
      this.options.onDragStart({
        element: this.targetElement,
        x: this.startLeft,
        y: this.startTop
      });
    }
  }
  
  /**
   * 处理鼠标移动事件
   */
  handleMouseMove(event) {
    if (!this.isDragging) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    // 计算移动距离
    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;
    
    // 计算新位置
    const newLeft = this.startLeft + deltaX;
    const newTop = this.startTop + deltaY;
    
    // 应用新位置
    this.targetElement.style.left = `${newLeft}px`;
    this.targetElement.style.top = `${newTop}px`;
    
    // 确保使用正确的定位方式
    this.targetElement.style.position = 'fixed';
    this.targetElement.style.right = '';
    this.targetElement.style.bottom = '';
    
    // 调用回调
    if (this.options.onDrag) {
      this.options.onDrag({
        element: this.targetElement,
        x: newLeft,
        y: newTop,
        deltaX,
        deltaY
      });
    }
  }
  
  /**
   * 处理鼠标释放事件
   */
  handleMouseUp(event) {
    if (!this.isDragging) return;
    
    console.log('结束拖拽');
    this.isDragging = false;
    
    // 移除事件监听
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    
    // 获取最终位置
    const rect = this.targetElement.getBoundingClientRect();
    const finalLeft = rect.left;
    const finalTop = rect.top;
    
    // 调用回调
    if (this.options.onDragEnd) {
      this.options.onDragEnd({
        element: this.targetElement,
        x: finalLeft,
        y: finalTop
      });
    }
  }
  
  /**
   * 销毁拖拽实例，移除所有事件监听
   */
  destroy() {
    this.dragElement.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    
    console.log('拖拽实例已销毁');
  }
}

// 导出为默认值
export default Draggable; 