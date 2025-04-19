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