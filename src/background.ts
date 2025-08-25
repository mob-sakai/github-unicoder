// バックグラウンドスクリプト

// 拡張機能がインストールされたときの初期設定
chrome.runtime.onInstalled.addListener(() => {
  // デフォルトでは有効状態（ONに変更）
  chrome.storage.sync.set({ unicoderEnabled: true });
});

// 拡張機能アイコンがクリックされたときの処理（直接トグル）
chrome.action.onClicked.addListener(async (tab: any) => {
  if (tab.url?.includes('github.com')) {
    // 現在の設定を取得
    const result = await chrome.storage.sync.get(['unicoderEnabled']);
    const currentState = result.unicoderEnabled ?? true;

    // 設定を反転
    const newState = !currentState;
    await chrome.storage.sync.set({ unicoderEnabled: newState });

    // アイコンの状態を即座に更新
    updateIcon(tab.id, newState);

    // タブをリロード
    chrome.tabs.reload(tab.id);
  }
});

// アイコンの状態を更新する関数
function updateIcon(tabId: number, enabled: boolean) {
  // アイコンは常に通常の状態を使用
  chrome.action.setIcon({
    tabId: tabId,
    path: {
      "128": enabled ? "icons/icon128.png" : "icons/icon128_d.png"
    }
  });
}

// タブが更新されたときの処理
chrome.tabs.onUpdated.addListener(async (tabId: number, changeInfo: any, tab: any) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('github.com')) {
    // アイコンの状態を更新
    const result = await chrome.storage.sync.get(['unicoderEnabled']);
    const enabled = result.unicoderEnabled ?? true;

    updateIcon(tabId, enabled);
  }
});
