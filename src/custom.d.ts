declare global {
  interface Window {
    ymaps: any;
  }
  interface Window {
    Telegram: {
      WebApp: {
        close: () => void;
      };
    };
  }
}
