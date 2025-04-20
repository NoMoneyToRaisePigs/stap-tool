import { Styles } from './styles.js';

/**
 * 简化的基础Web Component类
 * 所有自定义组件都可以继承这个类来简化开发
 */
export class BaseComponent extends HTMLElement {
  /**
   * 构造函数
   * @param {boolean} useShadow - 是否使用Shadow DOM，默认使用
   */
  constructor(useShadow = true) {
    super();
    
    // 创建Shadow DOM
    if (useShadow) {
      this.attachShadow({ mode: 'open' });
    }
    
    // 初始化组件状态
    this._state = {};
    
    // 事件监听器跟踪
    this._eventListeners = [];
    
    // 初始化属性自动绑定
    this._initAttributeHandlers();
  }
  
  /**
   * 定义组件的属性，子类应该重写此方法
   * @return {Array} 属性名称数组
   */
  static get props() {
    return [];
  }
  
  /**
   * 获取组件应监听的属性列表
   * 自动从props中派生
   */
  static get observedAttributes() {
    return this.props;
  }
  
  /**
   * 初始化属性与处理函数的绑定
   * 自动根据props将属性变化绑定到对应的处理函数
   */
  _initAttributeHandlers() {
    // 获取当前类的props
    const attributes = this.constructor.props || [];
    
    // 为每个属性查找对应的处理函数
    attributes.forEach(attr => {
      // 转换属性名为处理函数名 (例如: 'api-url' -> '_handleApiUrlChange')
      const handlerName = '_handle' + attr.split('-').map(
        part => part.charAt(0).toUpperCase() + part.slice(1)
      ).join('') + 'Change';
      
      // 如果组件有对应的处理函数，则记录下来
      if (typeof this[handlerName] === 'function') {
        // 绑定this上下文
        this[handlerName] = this[handlerName].bind(this);
      }
    });
  }
  
  /**
   * 处理属性变化
   * @param {string} name - 属性名
   * @param {string} oldValue - 旧值
   * @param {string} newValue - 新值
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    // 查找对应的处理函数
    const handlerName = '_handle' + name.split('-').map(
      part => part.charAt(0).toUpperCase() + part.slice(1)
    ).join('') + 'Change';
    
    // 如果存在处理函数，则调用
    if (typeof this[handlerName] === 'function') {
      this[handlerName](newValue, oldValue);
    }
  }
  
  /**
   * 当组件被添加到DOM时调用
   */
  connectedCallback() {
    // 添加到DOM后首次渲染
    this.render();
    this.setupEventListeners();
  }
  
  /**
   * 当组件从DOM中移除时调用
   */
  disconnectedCallback() {
    this.removeEventListeners();
  }
  
  /**
   * 渲染组件
   */
  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
          ${Styles.cssText}
          ${this.css}
        </style>
        ${this.html}
      `;
    }
  }
  
  /**
   * 获取组件HTML模板，子类应重写此方法
   */
  get html() {
    return '';
  }
  
  /**
   * 获取组件CSS样式，子类应重写此方法
   */
  get css() {
    return '';
  }
  
  /**
   * 设置事件监听器，子类应重写此方法
   */
  setupEventListeners() {
    // 子类应该实现此方法
  }
  
  /**
   * 移除所有注册的事件监听器
   */
  removeEventListeners() {
    this._eventListeners.forEach(({ element, type, listener, options }) => {
      element.removeEventListener(type, listener, options);
    });
    this._eventListeners = [];
  }
  
  /**
   * 添加事件监听器并跟踪它
   * @param {EventTarget} element - 要添加监听器的元素
   * @param {string} type - 事件类型
   * @param {Function} listener - 监听器函数
   * @param {Object} options - 事件选项
   */
  addEventListener(element, type, listener, options = {}) {
    const boundListener = listener.bind(this);
    element.addEventListener(type, boundListener, options);
    this._eventListeners.push({ element, type, listener: boundListener, options });
  }
  
  /**
   * 发送自定义事件
   * @param {string} name - 事件名称
   * @param {Object} detail - 事件详情
   * @param {boolean} bubbles - 是否冒泡
   * @param {boolean} composed - 是否穿越Shadow DOM边界
   */
  dispatchCustomEvent(name, detail = {}, bubbles = true, composed = true) {
    const event = new CustomEvent(name, {
      bubbles,
      composed,
      detail
    });
    
    this.dispatchEvent(event);
  }
  
  /**
   * 更新组件状态并触发重新渲染
   * @param {Object} newState - 新的状态对象
   * @param {boolean} shouldRender - 是否触发重新渲染，默认触发
   */
  setState(newState, shouldRender = true) {
    const oldState = { ...this._state };
    this._state = { ...this._state, ...newState };
    
    // 状态变化的通知钩子
    this.onStateChange(this._state, oldState);
    
    if (shouldRender) {
      this.render();
    }
  }
  
  /**
   * 状态变化时的钩子函数，子类可重写
   * @param {Object} newState - 新状态
   * @param {Object} oldState - 旧状态
   */
  onStateChange(newState, oldState) {
    // 子类可重写
  }
  
  /**
   * 获取当前状态
   * @return {Object} 当前的状态对象
   */
  get state() {
    return { ...this._state };
  }
  
  /**
   * 查找Shadow DOM内的元素
   * @param {string} selector - CSS选择器
   * @return {Element} 找到的元素
   */
  $(selector) {
    return this.shadowRoot ? this.shadowRoot.querySelector(selector) : this.querySelector(selector);
  }
  
  /**
   * 查找Shadow DOM内的所有匹配元素
   * @param {string} selector - CSS选择器
   * @return {NodeList} 找到的元素列表
   */
  $$(selector) {
    return this.shadowRoot ? this.shadowRoot.querySelectorAll(selector) : this.querySelectorAll(selector);
  }
  
  /**
   * 获取属性值，带类型转换
   * @param {string} name - 属性名
   * @param {any} defaultValue - 默认值
   * @return {any} 属性值
   */
  getTypedAttribute(name, defaultValue = null) {
    const value = this.getAttribute(name);
    if (value === null) return defaultValue;
    
    // 尝试转换为数字或布尔值
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (!isNaN(value) && value.trim() !== '') return Number(value);
    
    return value;
  }
  
  /**
   * 安全解析JSON属性
   * @param {string} name - 属性名
   * @param {any} defaultValue - 解析失败时的默认值
   * @return {any} 解析后的值
   */
  getJSONAttribute(name, defaultValue = null) {
    const value = this.getAttribute(name);
    if (!value) return defaultValue;
    
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error(`解析属性 ${name} 失败:`, e);
      return defaultValue;
    }
  }
} 