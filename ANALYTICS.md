# Runmity Analytics Runbook

Runmityの初期PoCでは、Garminアプリ本体のテレメトリは収集しない。WebとStoreの集計値だけを定点観測する。

## 計測範囲

### GitHub Pages / GA4

- GA4 property: `Runmity`
- Web stream: `Runmity Support`
- Measurement ID: `G-PSBT313ZZM`
- 対象: ページビュー、流入元、端末・言語、スクロール、Storeへの離脱クリック
- 独自イベント: `store_click`
- Google Signalsおよび広告パーソナライズ: 無効
- Analytics consent: 初期値は拒否。閲覧者が許可した場合にCookieベースの計測を有効化

`store_click`には次のパラメータを付与する。

- `link_url`
- `link_text`
- `page_language`

### Garmin Connect IQ Store

Garmin標準の開発者統計を使用する。Storeページへ独自タグは追加できない。

- 累計ダウンロード数
- 週次ダウンロード差分
- 評価、レビュー数
- バージョン別インストール構成
- デバイス別インストール構成

### 計測しないもの

- Garminアプリの起動数、Run開始数
- Greeting数、相手ID、ストリーク
- Garminアカウント、正確な位置、走行経路

これらを計測するにはウォッチから外部サービスへの通信とバックエンドが必要になるため、バックエンドなしのPoCでは扱わない。

## 週次チェック

毎週月曜に、前週月曜から日曜までの7日間を確認する。GA4のタイムゾーンは日本時間。

| 指標 | 取得元 | 記録方法 |
| --- | --- | --- |
| Webユーザー | GA4 レポート > 集客 | 前週7日 |
| Webセッション | GA4 レポート > 集客 | 前週7日 |
| 流入元上位3件 | GA4 レポート > 集客 > トラフィック獲得 | source / medium |
| Storeクリック | GA4 レポート > エンゲージメント > イベント | `store_click` |
| Garmin累計DL | Connect IQ Storeアプリ管理 | 表示値 |
| Garmin新規DL | Connect IQ Storeアプリ管理 | 今週累計 - 前週累計 |
| レビュー数・評価 | Connect IQ Storeアプリ管理 | 表示値 |
| デバイス・バージョン構成 | Connect IQ Storeアプリ管理 > 統計 | データがある場合のみ |

## 判断指標

```text
Web→Store率 = store_click ÷ Webユーザー
推定Store→DL率 = Garmin新規DL ÷ store_click
```

GarminはStoreページ表示回数、流入元、個別ユーザーとの紐付けを提供しないため、推定Store→DL率は同じ週の集計値を比較する参考値とする。

初期判断では絶対値より次を優先する。

1. 週次ダウンロードが増加しているか
2. Web→Store率が改善しているか
3. 対応デバイスの広がりがあるか
4. レビューでセットアップ阻害が報告されていないか

## 公開後の確認

1. プライベートウィンドウでSupportページを開き、同意UIが表示されることを確認する。
2. 「計測を許可」を選択し、Connect IQ Storeボタンを押す。
3. GA4のリアルタイム画面でページ表示を確認する。
4. DebugViewまたはイベントレポートで`store_click`を確認する。
