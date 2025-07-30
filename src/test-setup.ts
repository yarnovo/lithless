import '@testing-library/jest-dom/vitest';

// 确保 Web Components 在测试环境中可用
if (!customElements.get('lith-radio')) {
  import('./components/form/lith-radio');
}

if (!customElements.get('lith-radio-group')) {
  import('./components/form/lith-radio-group');
}

if (!customElements.get('lith-checkbox')) {
  import('./components/form/lith-checkbox');
}

// 添加全局测试帮助方法
declare global {
  interface Window {
    testHelpers: {
      waitForElement: (selector: string) => Promise<Element>;
    };
  }
}

window.testHelpers = {
  waitForElement: async (selector: string): Promise<Element> => {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // 超时机制
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within timeout`));
      }, 5000);
    });
  },
};
