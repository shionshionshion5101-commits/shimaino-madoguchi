import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const PDF_URL = 'https://shimaino-madoguchi.com/checklist.pdf';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { lastName, firstName, email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'メールアドレスは必須です' });
  }

  const name = lastName && firstName ? `${lastName} ${firstName}` : (lastName || firstName || 'お客様');

  try {
    await resend.emails.send({
      from: 'しまいの窓口 <info@shimaino-madoguchi.com>',
      to: [email],
      subject: '【資料お届け】大切な人が亡くなった後にやること30項目チェックリスト',
      html: buildEmailHtml(name),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'メール送信に失敗しました' });
  }
}

function buildEmailHtml(name) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>チェックリストのお届け</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- ロゴヘッダー -->
          <tr>
            <td style="background:#1a2744;border-radius:12px 12px 0 0;padding:28px 36px;">
              <p style="margin:0;font-size:20px;font-weight:900;color:#fff;letter-spacing:-0.02em;">
                しまいの<span style="color:#0ea5a0;">窓口</span>
              </p>
              <p style="margin:6px 0 0;font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:0.05em;">
                SHIMAINO MADOGUCHI
              </p>
            </td>
          </tr>

          <!-- メイン本文 -->
          <tr>
            <td style="background:#fff;padding:40px 36px;">

              <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.8;">
                ${name} 様
              </p>

              <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.8;">
                この度は「しまいの窓口」のチェックリストをご請求いただき、ありがとうございます。
              </p>

              <p style="margin:0 0 28px;font-size:15px;color:#374151;line-height:1.8;">
                大切な人が亡くなった後にやること<strong>30項目</strong>を、期限・優先順位つきでまとめた『完全チェックリスト（全6ページ）』をお届けします。
              </p>

              <!-- PDFダウンロードボタン -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 32px;">
                    <a href="${PDF_URL}"
                       style="display:inline-block;background:#0ea5a0;color:#fff;font-size:16px;font-weight:700;padding:16px 36px;border-radius:50px;text-decoration:none;letter-spacing:0.01em;box-shadow:0 4px 16px rgba(14,165,160,0.35);">
                      ▼ チェックリストPDFをダウンロード
                    </a>
                  </td>
                </tr>
              </table>

              <!-- PDFの内容説明 -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fb;border-radius:10px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#1a2744;letter-spacing:0.05em;">
                      📋 チェックリストの内容
                    </p>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:3px 0;font-size:13px;color:#374151;line-height:1.7;">
                          <span style="color:#ef4444;font-weight:700;">■</span>&nbsp;
                          <strong>7日以内：</strong>葬儀直後の緊急手続き（死亡届・火葬許可など）
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:3px 0;font-size:13px;color:#374151;line-height:1.7;">
                          <span style="color:#f59e0b;font-weight:700;">■</span>&nbsp;
                          <strong>14日以内：</strong>役所・年金・健康保険の手続き
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:3px 0;font-size:13px;color:#374151;line-height:1.7;">
                          <span style="color:#3b82f6;font-weight:700;">■</span>&nbsp;
                          <strong>3ヶ月以内：</strong>相続・資産の整理
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:3px 0;font-size:13px;color:#374151;line-height:1.7;">
                          <span style="color:#6b7280;font-weight:700;">■</span>&nbsp;
                          <strong>随時：</strong>スマホ・サブスク・口座の解約
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- サービス紹介 -->
              <p style="margin:0 0 12px;font-size:14px;color:#374151;line-height:1.8;">
                手続きの中で「これは面倒だ」「自分では難しい」と感じた場合は、<strong>しまいの窓口</strong>にお任せください。
              </p>
              <p style="margin:0 0 28px;font-size:14px;color:#374151;line-height:1.8;">
                スマホ解約・サブスク停止・役所手続きなど、チェックリストの項目をそのままご依頼いただけます。まずは<strong>無料診断</strong>からどうぞ。
              </p>

              <!-- サービスCTAボタン -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:8px;">
                    <a href="https://app.shimaino-madoguchi.com/"
                       style="display:inline-block;background:#1a2744;color:#fff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:50px;text-decoration:none;">
                      【無料】代行できる手続きを調べる →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- フッター -->
          <tr>
            <td style="background:#f4f5f7;border-radius:0 0 12px 12px;padding:24px 36px;border-top:1px solid #ebedf0;">
              <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;line-height:1.8;">
                このメールは <strong style="color:#6b7280;">しまいの窓口</strong> からお送りしています。<br>
                ご不明な点はLINEまたはホームページよりお問い合わせください。
              </p>
              <p style="margin:0;font-size:11px;color:#c0c8d4;">
                © 2024 しまいの窓口｜
                <a href="https://shimaino-madoguchi.com/privacy" style="color:#9ca3af;">プライバシーポリシー</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
