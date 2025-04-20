
class ApiTrackerPanel extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.requests = [];
      this.fieldCache = {};
      this.visible = true;
      this.filterText = '';
      this.render();

      window.addEventListener('plugin-api-captured', (e) => {
        this.requests.push(e.detail);

        this.render();
      });
    }

    render() {
      const panelState = localStorage.getItem('api-tracker-style');
      const styleAttr = panelState ? `style="${panelState}"` : '';
      const filtered = this.requests.filter(r => this.filterText ? (r.method + r.status + r.url).toLowerCase().includes(this.filterText.toLowerCase()) : true);

      this.shadowRoot.innerHTML = `
      <style>
        .panel {
          position: fixed;
          top: 100px;
          left: 100px;
          background: white;
          border: 1px solid #ccc;
          box-shadow: 0 0 10px rgba(0,0,0,0.2);
          width: ${this.visible ? '400px' : '300px'};
          height: ${this.visible ? '250px' : '40px'};
          min-width: 300px;
          min-height: 40px;
          resize: both;
          overflow: hidden;
          font-family: sans-serif;
          z-index: 99999;
          transition: all 0.2s ease;
        }
        .header {
          background: #333;
          color: white;
          padding: 6px;
          cursor: move;
          font-size: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header-left { display: flex; align-items: center; }
        .header-icon {
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          margin-right: 6px;
        }
        .controls button {
          background: none;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 14px;
          margin-left: 8px;
        }
        .content {
          padding: 10px;
          overflow-y: auto;
          max-height: calc(100% - 40px);
        }
        .request {
          border-top: 1px solid #eee;
          padding: 5px 0;
          font-size: 13px;
        }
        .toolbar {
          margin-bottom: 8px;
        }
        .toolbar input {
          font-size: 13px;
          padding: 2px 6px;
          width: 90%;
          box-sizing: border-box;
        }
        .summary {
          font-size: 12px;
          margin-bottom: 6px;
          color: #666;
        }
        .minimized-bar {
          padding: 6px;
          text-align: center;
          background: #f2f2f2;
          font-size: 12px;
          cursor: pointer;
          user-select: none;
        }
        .footer {
          font-size: 10px;
          color: #999;
          padding-top: 8px;
        }
      </style>

      <div id="mydiv" class="panel" ${styleAttr}>
        <div id="mydivheader" class="header">
          <div class="header-left">
            <div class="header-icon"></div>
            API Tracker
          </div>
          <div class="controls">
            <button title="Export">📥</button>
            <button title="Clear">🧹</button>
            <button title="Minimize">${this.visible ? '➖' : '➕'}</button>
          </div>
        </div>
        ${this.visible ? `
        <div class="content">
          <div class="toolbar">
            <input type="text" placeholder="Filter by method, status or URL" />
          </div>
          <div class="summary">Total Requests: ${filtered.length}</div>
          ${filtered.map((r, i) => `
            <div class="request">
              <div><strong>${r.method}</strong> ${r.url}</div>
              <div>${r.status} | ${r.duration.toFixed(1)}ms</div>
            </div>
          `).join('')}
          <div class="footer">Page: ${location.pathname}</div>
        </div>` : `
        <div class="minimized-bar">📊 API Tracker (${this.requests.length})</div>`}
      </div>
    `;

      this.addDrag();
      this.shadowRoot.querySelector('.controls button[title="Export"]').onclick = () => this.exportData();
      this.shadowRoot.querySelector('.controls button[title="Clear"]').onclick = () => this.clearData();
      this.shadowRoot.querySelector('.controls button[title="Minimize"]').onclick = () => this.toggleVisibility();
      this.shadowRoot.querySelector('.minimized-bar')?.addEventListener('click', () => this.toggleVisibility());
      this.shadowRoot.querySelector('.toolbar input')?.addEventListener('input', e => {
        this.filterText = e.target.value;
        this.render();
      });
    }

    addDrag() {
      const panel = this.shadowRoot.getElementById("mydiv");
      const header = this.shadowRoot.getElementById("mydivheader");
      if (!panel || !header) return;

      let offsetX = 0, offsetY = 0;

      const onMouseMove = (e) => {
        const newLeft = Math.max(0, e.clientX - offsetX);
        const newTop = Math.max(0, e.clientY - offsetY);
        panel.style.left = newLeft + 'px';
        panel.style.top = newTop + 'px';
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
        localStorage.setItem('api-tracker-style', panel.getAttribute("style"));
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      header.addEventListener('mousedown', (e) => {
        const rect = panel.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    }

    toggleVisibility() {
      this.visible = !this.visible;
      this.render();
    }

    exportData() {
      const blob = new Blob([JSON.stringify(this.requests, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'api-tracker-export.json';
      a.click();
      URL.revokeObjectURL(url);
    }

    clearData() {
      this.requests = [];

      this.render();
    }
  }

  customElements.define('api-tracker-panel', ApiTrackerPanel);
  document.body.appendChild(document.createElement('api-tracker-panel'));
