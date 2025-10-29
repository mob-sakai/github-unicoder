# GitHub Copilot Instructions for GitHub Unicoder

## プロジェクト概要

**GitHub Unicoder** (github-unicoder) は、GitHub上のUnicodeエスケープシーケンス（例：`\u30AD\u30E3\u30F3\u30BB\u30EB`）を読みやすい文字（例：`キャンセル`）に変換して表示するChrome拡張機能です。
Unityプロジェクトなどでは、マルチバイト文字列が自動的にUnicodeエスケープシーケンスに変換されるため、このままでは可読性が低く、適切なコードレビューが困難です。
本拡張機能は、これらを読みやすい元の文字列にリアルタイム変換して表示することで、開発効率を向上させます。

## 技術スタック

- **フレームワーク**: Chrome Extension Manifest V3
- **言語**: TypeScript
- **ビルドツール**: TypeScript Compiler (tsc)
- **対象環境**: GitHub.com
- **主要API**: Chrome Extension APIs, DOM APIs

## プロジェクト構造

```
/github-unicoder/
├── .editorconfig               # エディタ設定
├── .gitignore                  # Git無視ファイル設定
├── .releaserc.json             # セマンティックリリース設定
├── .vscode/                    # VS Code設定
│   ├── extensions.json         # 推奨拡張機能
│   └── tasks.json              # ビルドタスク設定
├── manifest.json               # Chrome拡張機能マニフェスト (GitHub Unicoder)
├── package.json                # Node.js依存関係とスクリプト (作者: mob-sakai)
├── package-lock.json           # npm依存関係ロック
├── tsconfig.json               # TypeScript設定
├── LICENSE.md                  # MIT License
├── README.md                   # プロジェクト説明 (GitHub Unicoder)
├── ARCHITECTURE.md             # アーキテクチャドキュメント
├── src/
│   ├── content.ts              # メインのコンテンツスクリプト
│   ├── background.ts           # バックグラウンドサービスワーカー
│   ├── types.d.ts              # TypeScript型定義
│   └── static/
│       ├── styles.css          # CSS スタイル
│       └── icons/              # 拡張機能アイコン
│           ├── icon128.png     # 128x128 アイコン（通常状態）
│           ├── icon128_d.png   # 128x128 アイコン（無効状態）
│           └── README.md       # アイコン説明
├── dist/                       # ビルド出力（Git無視）
├── node_modules/               # npm依存関係（Git無視）
└── .github/
    ├── copilot-instructions.md # このファイル
    ├── ISSUE_TEMPLATE/         # Issueテンプレート
    └── workflows/              # GitHub Actions ワークフロー
```

## コーディング規約

### TypeScript

- **厳密型付け**: `strict: true`を使用
- **命名規則**: 
  - クラス: PascalCase (`UnicoderForGitHub`)
  - メソッド/変数: camelCase (`convertUnicodeEscapes`)
  - 定数: UPPER_SNAKE_CASE
  - インターフェース: PascalCase + Interface suffix (`UnicoderState`)
- **非同期処理**: async/await を優先
- **エラーハンドリング**: try-catch で適切な例外処理

### Chrome Extension

- **Manifest V3**: 最新仕様に準拠
- **権限の最小化**: 必要最小限の権限のみ使用
- **Service Worker**: バックグラウンド処理にService Workerパターン使用
- **Content Security Policy**: インラインスクリプト禁止

### DOM操作

- **パフォーマンス重視**: 
  - 重複処理防止（`processedElements` Set使用）
  - デバウンス処理（100ms）
  - 選択的要素検索
- **セレクタ**: GitHubの特定クラスのみ対象（`.blob-code-inner`, `.react-file-line`, `.diff-text-inner`）
- **変更検知**: `MutationObserver`で効率的にDOM変更を監視

## 重要な設計パターン

### 1. ステートマネジメント

```typescript
interface UnicoderState {
  enabled: boolean;              // 機能の有効/無効
  processedElements: Set<Element>; // 処理済み要素の追跡
}
```

### 2. Unicode変換アルゴリズム

```typescript
// パターン: \uXXXX (4桁16進数)
const pattern = /\\u([0-9a-fA-F]{4})/g;
const converted = text.replace(pattern, (match, hexCode) => {
  return String.fromCharCode(parseInt(hexCode, 16));
});
```

### 3. Chrome Storage同期

```typescript
// 設定の読み込み
const result = await chrome.storage.sync.get(['unicoderEnabled']);
// 設定の保存  
await chrome.storage.sync.set({ unicoderEnabled: newState });
```

## 開発ガイドライン

### 新機能追加時

1. **型定義を最初に追加** (`types.d.ts`)
2. **設定項目は`chrome.storage.sync`で永続化**
3. **DOM操作は必ずパフォーマンス考慮**
4. **GitHub固有のセレクタに依存する場合は要素の存在確認**
5. **デバッグログは`console.log('Unicoder: ...')`形式で統一**

### パフォーマンス最適化

- **処理済み要素の重複処理回避**: `Set<Element>`で管理
- **DOM変更の効率的監視**: 新要素追加時のみ変換処理実行
- **正規表現の事前コンパイル**: 変換パターンは定数で定義
- **デバウンス処理**: 連続するDOM変更は100ms後にまとめて処理

### セキュリティ考慮

- **最小権限の原則**: 必要な権限のみ`manifest.json`で宣言
- **ドメイン制限**: GitHub.com のみで動作
- **外部通信禁止**: 外部APIへの通信なし
- **ユーザーデータ収集禁止**: プライバシー保護

### テスト戦略

- **単体テスト**: Unicode変換ロジックの正確性
- **統合テスト**: Chrome Extension APIとの連携
- **実機テスト**: 実際のGitHubページでの動作確認
- **パフォーマンステスト**: 大量要素での処理速度確認

## よくあるタスク

### 新しい変換パターンの追加

1. 正規表現パターンを定義
2. `convertUnicodeEscapes()`メソッドを拡張
3. 単体テストケースを追加

### 設定項目の追加

1. `UnicoderState`インターフェースを更新
2. `chrome.storage.sync`の読み込み/保存処理を追加
3. バックグラウンドスクリプトでデフォルト値設定

### 対象サイトの拡張

1. `manifest.json`の`host_permissions`を更新
2. `content.ts`のドメイン判定ロジックを修正
3. 新サイト固有のセレクタを追加

### UI要素の追加

1. `static/`ディレクトリに静的ファイル追加
2. `package.json`の`copy-static`スクリプトを確認
3. `manifest.json`でリソースを宣言

## トラブルシューティング

### よくある問題

1. **変換が動作しない**
   - GitHub固有セレクタの変更確認
   - ストレージ設定の確認
   - DOM要素の存在確認

2. **パフォーマンス低下**
   - 処理済み要素の重複処理確認
   - MutationObserverの監視範囲確認
   - デバウンス処理の動作確認

3. **Chrome Extension API エラー**
   - Manifest V3準拠確認
   - 権限設定の確認
   - Service Worker の動作確認

### デバッグ方法

- **Content Script**: GitHub上でF12 → Console → "Unicoder:"でフィルタ
- **Background Script**: Chrome拡張機能管理 → "サービスワーカー"をクリック
- **Storage**: Chrome DevTools → Application → Storage → Extensions

## コミット規約

- **feat**: 新機能追加
- **fix**: バグ修正
- **perf**: パフォーマンス改善
- **refactor**: リファクタリング
- **docs**: ドキュメント更新
- **style**: コードスタイル修正
- **test**: テストコード追加/修正

例: `feat: add custom conversion pattern support`

## リリース手順

1. `npm run build` でビルド確認
2. バージョン番号更新 (`package.json`, `manifest.json`)
3. `CHANGELOG.md` 更新
4. Git tag作成
5. Chrome Web Store アップロード（将来）

---

この指示書に従って、効率的で保守性の高いコードを書いてください。不明な点があれば、ARCHITECTURE.mdを参照するか、既存コードの実装パターンを確認してください。

## プロジェクト情報

- **パッケージ名**: `github-unicoder`
- **プロダクト名**: GitHub Unicoder
- **作者**: mob-sakai
- **ライセンス**: MIT License (LICENSE.md 参照)
- **Issue/PR テンプレート**: `.github/` 配下に完備
- **アーキテクチャ**: ARCHITECTURE.md で詳細説明
