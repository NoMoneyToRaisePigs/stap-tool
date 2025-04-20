(function () {
    if (window.__apiTrackerLoaded) return;
    window.__apiTrackerLoaded = true;

    // ==== Intercept fetch ====
    const createWrappedFetch = (original) => {
      return async function (...args) {
        const [url, options] = args;
        const start = performance.now();
        const res = await original.apply(this, args);
        const end = performance.now();

        window.dispatchEvent(new CustomEvent('plugin-api-captured', {
          detail: {
            url: url instanceof Request ? url.url : url,
            method: options?.method || 'GET',
            status: res.status,
            duration: end - start,
          }
        }));

        return res;
      };
    };

    let originalFetch = window.fetch;
    window.__originalFetch = originalFetch;
    window.__interceptedFetch = createWrappedFetch(originalFetch);

    Object.defineProperty(window, 'fetch', {
      configurable: true,
      enumerable: true,
      get() {
        return window.__interceptedFetch;
      },
      set(newFetch) {
        if (typeof newFetch === 'function') {
          window.__originalFetch = newFetch;
          window.__interceptedFetch = createWrappedFetch(newFetch);
        }
      }
    });
    // ==== Intercept XMLHttpRequest ====
    const createWrappedXHR = () => {
      const originalOpen = XMLHttpRequest.prototype.open;
      const originalSend = XMLHttpRequest.prototype.send;

      function defaultOpen(method, url, ...rest) {
        this._trackInfo = { method, url };
        return originalOpen.call(this, method, url, ...rest);
      }

      function defaultSend(...args) {
        const start = performance.now();
        this.addEventListener('loadend', () => {
          const end = performance.now();
          window.dispatchEvent(new CustomEvent('plugin-api-captured', {
            detail: {
              url: this._trackInfo?.url,
              method: this._trackInfo?.method,
              status: this.status,
              duration: end - start,
            }
          }));
        });
        return originalSend.apply(this, args);
      }

      Object.defineProperty(XMLHttpRequest.prototype, 'open', {
        configurable: true,
        enumerable: true,
        get() {
          return defaultOpen;
        },
        set(fn) {
          const wrapped = function (method, url, ...rest) {
            this._trackInfo = { method, url };
            return fn.call(this, method, url, ...rest);
          };
          Object.defineProperty(XMLHttpRequest.prototype, 'open', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: wrapped
          });
        }
      });

      Object.defineProperty(XMLHttpRequest.prototype, 'send', {
        configurable: true,
        enumerable: true,
        get() {
          return defaultSend;
        },
        set(fn) {
          const wrapped = function (...args) {
            const start = performance.now();
            this.addEventListener('loadend', () => {
              const end = performance.now();
              window.dispatchEvent(new CustomEvent('plugin-api-captured', {
                detail: {
                  url: this._trackInfo?.url,
                  method: this._trackInfo?.method,
                  status: this.status,
                  duration: end - start,
                }
              }));
            });
            return fn.apply(this, args);
          };
          Object.defineProperty(XMLHttpRequest.prototype, 'send', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: wrapped
          });
        }
      });
    };

    createWrappedXHR();
  })();