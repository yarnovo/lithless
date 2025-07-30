import '@testing-library/jest-dom/vitest';

// 使用社区的 polyfill 而不是自己 mock
// TODO: 考虑使用 element-internals-polyfill
// import 'element-internals-polyfill';

// Mock ElementInternals for JSDOM
// 注意：这是临时方案，建议使用 element-internals-polyfill
if (typeof window !== 'undefined' && !window.ElementInternals) {
  class MockElementInternals {
    role: string | null = null;
    ariaActiveDescendant: string | null = null;
    ariaChecked: string | null = null;
    ariaDisabled: string | null = null;
    ariaRequired: string | null = null;
    ariaOrientation: string | null = null;
    form: HTMLFormElement | null = null;
    labels: NodeList = [] as unknown as NodeList;
    validationMessage: string = '';
    private _validityState = {
      badInput: false,
      customError: false,
      patternMismatch: false,
      rangeOverflow: false,
      rangeUnderflow: false,
      stepMismatch: false,
      tooLong: false,
      tooShort: false,
      typeMismatch: false,
      valid: true,
      valueMissing: false,
    };
    get validity(): ValidityState {
      return this._validityState as ValidityState;
    }
    willValidate: boolean = true;

    setFormValue(): void {
      // Mock implementation
    }

    setValidity(flags?: ValidityStateFlags | undefined, message?: string | undefined): void {
      // Mock implementation
      if (flags) {
        Object.assign(this._validityState, flags);
        // Update valid based on flags
        this._validityState.valid = !Object.values(flags).some((v) => v === true);
      } else {
        // Reset to valid state
        this._validityState = {
          badInput: false,
          customError: false,
          patternMismatch: false,
          rangeOverflow: false,
          rangeUnderflow: false,
          stepMismatch: false,
          tooLong: false,
          tooShort: false,
          typeMismatch: false,
          valid: true,
          valueMissing: false,
        };
      }
      this.validationMessage = message || '';
    }

    checkValidity(): boolean {
      return this.validity.valid;
    }

    reportValidity(): boolean {
      return this.validity.valid;
    }
  }

  (window as unknown as { ElementInternals?: typeof MockElementInternals }).ElementInternals =
    MockElementInternals;

  // Mock attachInternals
  if (!HTMLElement.prototype.attachInternals) {
    HTMLElement.prototype.attachInternals = function () {
      return new MockElementInternals() as unknown as ElementInternals;
    };
  }
}

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

if (!customElements.get('lith-button')) {
  import('./components/button/lith-button');
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
