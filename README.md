# <img src="src/static/icons/icon128.png" width="26" /> GitHub Unicoder

![](https://img.shields.io/badge/Chrome-Extension_MV3-57b9d3.svg?style=flat&logo=googlechrome)
[![](https://img.shields.io/github/v/release/mob-sakai/github-unicoder)](https://github.com/mob-sakai/github-unicoder/releases)
[![](https://img.shields.io/github/release-date/mob-sakai/github-unicoder.svg)](https://github.com/mob-sakai/github-unicoder/releases)  
[![](https://img.shields.io/github/license/mob-sakai/github-unicoder.svg)](https://github.com/mob-sakai/github-unicoder/blob/main/LICENSE.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-orange.svg)](http://makeapullrequest.com)
[![](https://img.shields.io/twitter/follow/mob_sakai.svg?label=Follow&style=social)](https://twitter.com/intent/follow?screen_name=mob_sakai)

GitHub上のUnicodeエスケープシーケンスと16進エスケープシーケンスを人間が読みやすいテキストに変換して表示するChrome拡張機能です。

![](https://github.com/mob-sakai/mob-sakai/releases/download/docs/1756524022409.png)  
![](https://github.com/mob-sakai/mob-sakai/releases/download/docs/1756524543600.png)

<br><br>

## 📌 機能

- **Unicode変換**: 
  - `\u30AD\u30E3\u30F3\u30BB\u30EB` → `キャンセル` のように、Unicodeエスケープシーケンスを実際の文字に変換
  - `\x41\x42\x43` → `ABC` のように、16進エスケープシーケンスを実際の文字に変換
- **ワンクリック操作**: 拡張機能アイコンを直接クリックしてON/OFF切り替え
- **リアルタイム変換**: DOM変更を監視し、動的に追加される要素も自動変換
- **GitHub特化**: GitHubのコードビューやファイル表示に最適化

<br><br>

## ⚙ インストール方法

1. [最新バージョンをダウンロード](https://github.com/mob-sakai/github-unicoder/releases/latest/download/github-unicoder.zip)、または[Release](https://github.com/mob-sakai/github-unicoder/releases) ページからgithub-unicoder.zipをダウンロードします。  
   ![](https://github.com/mob-sakai/mob-sakai/releases/download/docs/1756523223643.png)

2. zipファイルを解凍し、フォルダを任意の場所に移動します。  
   ![](https://github.com/mob-sakai/mob-sakai/releases/download/docs/1756523238198.png)

3. Chromeブラウザのメニューから「拡張機能＞拡張機能を管理」をクリックするか、アドレスバーから `chrome://extensions/` を開きます。

4. 右上の「デベロッパー モード」をONにして、「パッケージされていない拡張機能を読み込む」をクリックし、先ほどのフォルダを指定します。  
   ![](https://github.com/mob-sakai/mob-sakai/releases/download/docs/1756523281578.png)

5. 拡張機能がインストールされたことを確認します。  
   ![](https://github.com/mob-sakai/mob-sakai/releases/download/docs/1756613853828.png)

6. [使い方](#-使い方)セクションを参照して、正しく動作することを確認します。

<br><br>

## 🚀 使い方

- GitHub.com にて、コード内にUnicodeエスケープシーケンスや16進エスケープシーケンスが含まれている場合、自動的に変換されます。
  - https://github.com/mob-sakai/github-unicoder/blob/main/test.txt
    ![](https://github.com/mob-sakai/mob-sakai/releases/download/docs/1756524022409.png)
  - https://github.com/mob-sakai/github-unicoder/pull/2/files?diff=split&w=0
    ![](https://github.com/mob-sakai/mob-sakai/releases/download/docs/1756524543600.png)
- 拡張機能からアイコンをクリックして自動変換をON/OFFにできます。  
  ![](https://github.com/mob-sakai/mob-sakai/releases/download/docs/1756523743318.png)

<br><br>

## 🛠️ 開発

### ローカルビルド

```sh
# 依存関係のインストール
npm install

# ビルド
npm run build

# ファイルの監視と自動ビルド
npm run dev
```

### ローカルビルドのインストール

- `dist` フォルダをChromeの拡張機能ページから読み込みます。
- 再ビルドするたびに、拡張機能ページで「更新」ボタンをクリックして最新のコードを反映します。

<br><br>

## License

* MIT

## Author

* ![](https://user-images.githubusercontent.com/12690315/96986908-434a0b80-155d-11eb-8275-85138ab90afa.png) [mob-sakai](https://github.com/mob-sakai) [![](https://img.shields.io/twitter/follow/mob_sakai.svg?label=Follow&style=social)](https://twitter.com/intent/follow?screen_name=mob_sakai) ![GitHub followers](https://img.shields.io/github/followers/mob-sakai?style=social)

## See Also

* GitHub page : https://github.com/mob-sakai/github-unicoder
* Releases : https://github.com/mob-sakai/github-unicoder/releases
* Issue tracker : https://github.com/mob-sakai/github-unicoder/issues
