// @ts-nocheck
export const TelegramApp = {
  init(options) {
    document.body.style.visibility = "";
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.MainButton.setParams({
      text: "CLOSE WEBVIEW",
      is_visible: true,
    }).onClick(DemoApp.close);
  },

  expand() {
    window.Telegram.WebApp.expand();
  },
  close() {
    window.Telegram.WebApp.close();
  },
  toMainScreen() {
    Telegram.WebApp.MainButton.setText("Закрыть")
      .show()
      .onClick(() => {
        const data = JSON.stringify({ success: true });
        Telegram.WebApp.sendData(data);
        Telegram.WebApp.close();
      });
  },

  confirmClose() {
    window.Telegram.WebApp.enableClosingConfirmation();
    window.Telegram.WebApp.isClosingConfirmationEnabled = true;
  },
  showProgress() {
    window.Telegram.WebApp.MainButton.showProgress();
  },
  hideProgress() {
    window.Telegram.WebApp.MainButton.hideProgress();
  },
};
