// Unicodeエスケープシーケンスを変換するコンテンツスクリプト

interface UnicoderState {
  enabled: boolean;
  processedElements: Set<Element>;
}

class UnicoderForGitHub {
  private state: UnicoderState = {
    enabled: false,
    processedElements: new Set()
  };

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    // 保存された設定を読み込み
    const result = await chrome.storage.sync.get(['unicoderEnabled']);
    this.state.enabled = result.unicoderEnabled ?? true; // デフォルトをtrueに変更

    // 初期変換実行
    if (this.state.enabled) {
      this.convertUnicodeEscapes();
    }

    // DOM変更の監視
    this.observeChanges();

    // ストレージ変更の監視（拡張機能アイコンクリック時）
    chrome.storage.onChanged.addListener((changes: any) => {
      if (changes.unicoderEnabled) {
        // ページをリロード
        window.location.reload();
      }
    });
  }

  private convertUnicodeEscapes(): void {
    // GitHubのコードブロックを対象とする
    const codeElements = document.querySelectorAll('.blob-code-inner, .react-file-line, .diff-text-inner');

    codeElements.forEach((element) => {
      // 既に処理済みの要素はスキップ
      if (this.state.processedElements.has(element)) {
        return;
      }

      const originalText = element.textContent;
      // 統合パターン: \uXXXX または \xXX のいずれかが含まれているかチェック
      if (originalText && /\\(?:u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2})/.test(originalText)) {
        // 一度の処理で両方のパターンを変換
        const convertedText = originalText.replace(/\\(?:u([0-9a-fA-F]{4})|x([0-9a-fA-F]{2}))/g, (match, unicode, hex) => {
          if (unicode) {
            // \uXXXX パターンの場合
            const charCode = parseInt(unicode, 16);
            const character = String.fromCharCode(charCode);
            console.log(`Unicoder: Converted ${match} to ${character}`);
            return character;
          } else if (hex) {
            // \xXX パターンの場合
            const charCode = parseInt(hex, 16);
            const character = String.fromCharCode(charCode);
            console.log(`Unicoder: Converted ${match} to ${character}`);
            return character;
          }
          return match; // フォールバック（通常は到達しない）
        });

        element.textContent = convertedText;
        element.classList.add('unicoder-converted');
        this.state.processedElements.add(element);
      }
    });
  }

  private observeChanges(): void {
    const observer = new MutationObserver((mutations) => {
      if (!this.state.enabled) return;

      let shouldConvert = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // 新しく追加されたノードがある場合のみ変換を実行
          const hasNewCodeElements = Array.from(mutation.addedNodes).some(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              return element.querySelector('.blob-code-inner, .react-file-line, .diff-text-inner');
            }
            return false;
          });

          if (hasNewCodeElements) {
            shouldConvert = true;
          }
        }
      });

      if (shouldConvert) {
        // デバウンス処理
        setTimeout(() => {
          this.convertUnicodeEscapes();
        }, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// GitHub上でのみ実行
if (window.location.hostname === 'github.com') {
  new UnicoderForGitHub();
}
