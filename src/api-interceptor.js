// src/api-interceptor.js
export class ApiInterceptor {
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
      const self = this; // 保存this引用
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
            window.__interceptedFetch = self.createWrappedFetch(newFetch); // 使用保存的self引用
          }
        }
      });
    }
  
    createWrappedFetch(original) {
      return async function(...args) {
        const [url, options] = args;
        const start = performance.now();
        let timestamp = new Date().toLocaleString()
        let requestHeaders = null;
        
        
        // 捕获请求头
        if (options && options.headers) {
          if (options.headers instanceof Headers) {
            requestHeaders = Object.fromEntries([...options.headers.entries()]);
          } else if (typeof options.headers === 'object') {
            requestHeaders = options.headers;
          }
        }
        
        try {
          const res = await original.apply(this, args);
          const end = performance.now();
          const clone = res.clone();

          // 捕获响应头
          const responseHeaders = res.headers ? Object.fromEntries([...res.headers.entries()]) : {};
          
          window.dispatchEvent(new CustomEvent('plugin-api-captured', {
            detail: {
              url: url instanceof Request ? url.url : url,
              method: options?.method || 'GET',
              status: res.status,
              duration: end - start,
              timestamp,
              page: location.pathname,
              requestHeaders,
              responseHeaders
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
            //   requestData,
              requestHeaders
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
        
        // 捕获请求头
        const requestHeaders = {};
        if (this.setRequestHeader) {
          // 不幸的是，我们无法直接访问XHR的请求头
          // 这部分需要更高级的拦截方法才能捕获
        }
        
        this._apiTrackerInfo.requestData = requestData;
        this._apiTrackerInfo.requestHeaders = requestHeaders;
        
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
          
          // 获取响应头
          const responseHeaders = {};
          if (this.getAllResponseHeaders) {
            const headerString = this.getAllResponseHeaders();
            if (headerString) {
              headerString.trim().split(/[\r\n]+/).forEach(line => {
                const parts = line.split(': ');
                const header = parts.shift();
                const value = parts.join(': ');
                responseHeaders[header] = value;
              });
            }
          }
          
          window.dispatchEvent(new CustomEvent('plugin-api-captured', {
            detail: {
              ...this._apiTrackerInfo,
              status: this.status,
              duration: end - start,
              responseData,
              responseHeaders
            }
          }));
        };
        
        this.addEventListener('loadend', onLoadEnd);
        
        return originalSend.apply(this, arguments);
      };
    }
  }