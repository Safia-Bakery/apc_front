declare global {
  interface Window {
    ymaps: any;
    Telegram: {
      WebApp: {
        close: () => void;
      };
    };
  }
}
