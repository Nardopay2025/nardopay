# NardoPay Email Templates for Supabase

Copy and paste these beautiful email templates directly into your Supabase Auth email settings.

**How to use:**
1. Go to: https://supabase.com/dashboard/project/mczqwqsvumfsneoknlep/auth/templates
2. Select each email type (Confirm signup, Magic Link, etc.)
3. Copy the corresponding HTML below and paste it into the "Email Body (HTML)" field
4. Save!

---

## 1. Confirmation Email (Signup)

**Use this for:** Confirm signup email template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm your NardoPay account</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          
          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, hsl(220, 100%, 60%) 0%, hsl(200, 100%, 50%) 100%); padding: 40px 20px; text-align: center;">
              <div style="margin: 0 auto 16px; width: 64px; height: 64px; background-color: rgba(255, 255, 255, 0.2); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center;">
                <span style="color: #ffffff; font-size: 36px; font-weight: 700;">N</span>
              </div>
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">NardoPay</h1>
              <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 0;">Accept Payments Globally</p>
            </td>
          </tr>
          
          <!-- Main content -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="color: #1a1a1a; font-size: 26px; font-weight: 700; margin: 0 0 24px 0; text-align: center;">Welcome to NardoPay! 🎉</h2>
              
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
                Thank you for creating your account. We're thrilled to have you join our global payment platform!
              </p>
              
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                You're just one step away from accepting payments from customers worldwide. Please verify your email address to activate your account:
              </p>
              
              <!-- Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="{{ .ConfirmationURL }}" style="background-color: hsl(200, 100%, 50%); border-radius: 8px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; display: inline-block; padding: 16px 48px; box-shadow: 0 4px 12px rgba(0, 191, 255, 0.4);">
                  Verify Email Address
                </a>
              </div>
              
              <p style="color: #718096; font-size: 14px; text-align: center; margin: 16px 0 32px 0;">
                🔒 This link will expire in 24 hours for security purposes.
              </p>
              
              <!-- Features -->
              <div style="background-color: #f7fafc; border-radius: 8px; padding: 24px; margin: 32px 0;">
                <p style="color: #2d3748; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">What you can do with NardoPay:</p>
                <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin: 8px 0;">✓ Accept payments in multiple currencies</p>
                <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin: 8px 0;">✓ Create custom payment links instantly</p>
                <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin: 8px 0;">✓ Track your transactions in real-time</p>
                <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin: 8px 0;">✓ Withdraw funds to your local bank account</p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
              
              <p style="color: #718096; font-size: 14px; margin: 24px 0 12px 0; text-align: center;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              
              <div style="background-color: #f7fafc; border-radius: 6px; padding: 12px; margin: 0 0 24px 0;">
                <p style="color: hsl(200, 100%, 50%); font-size: 13px; line-height: 1.5; margin: 0; word-break: break-all; text-align: center;">
                  {{ .ConfirmationURL }}
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f7fafc; padding: 32px 32px 24px; text-align: center;">
              <p style="color: #718096; font-size: 14px; line-height: 1.5; margin: 0 0 16px 0;">
                If you didn't create a NardoPay account, please ignore this email or contact our support team.
              </p>
              
              <p style="color: #a0aec0; font-size: 13px; margin: 0 0 12px 0;">
                © 2025 NardoPay. All rights reserved.
              </p>
              
              <p style="color: #718096; font-size: 13px; margin: 0;">
                <a href="https://nardopay.com/privacy" style="color: hsl(200, 100%, 50%); text-decoration: none;">Privacy Policy</a>
                ·
                <a href="https://nardopay.com/terms" style="color: hsl(200, 100%, 50%); text-decoration: none;">Terms of Service</a>
                ·
                <a href="https://nardopay.com/contact" style="color: hsl(200, 100%, 50%); text-decoration: none;">Contact Us</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 2. Magic Link Email

**Use this for:** Magic Link email template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your NardoPay Magic Link</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, hsl(220, 100%, 60%) 0%, hsl(200, 100%, 50%) 100%); padding: 40px 20px; text-align: center;">
              <div style="margin: 0 auto 16px; width: 64px; height: 64px; background-color: rgba(255, 255, 255, 0.2); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center;">
                <span style="color: #ffffff; font-size: 36px; font-weight: 700;">N</span>
              </div>
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">NardoPay</h1>
              <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 0;">Accept Payments Globally</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="color: #1a1a1a; font-size: 26px; font-weight: 700; margin: 0 0 24px 0; text-align: center;">Your Login Link 🔐</h2>
              
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Click the button below to securely log in to your NardoPay account:
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="{{ .ConfirmationURL }}" style="background-color: hsl(200, 100%, 50%); border-radius: 8px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; display: inline-block; padding: 16px 48px; box-shadow: 0 4px 12px rgba(0, 191, 255, 0.4);">
                  Log In to NardoPay
                </a>
              </div>
              
              <p style="color: #718096; font-size: 14px; text-align: center; margin: 16px 0 32px 0;">
                🔒 This link will expire in 60 minutes for security purposes.
              </p>
              
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 24px 0;">
                Or use this one-time code: <strong style="color: hsl(200, 100%, 50%); font-size: 18px;">{{ .Token }}</strong>
              </p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
              
              <p style="color: #718096; font-size: 14px; margin: 0; text-align: center;">
                If you didn't request this login link, you can safely ignore this email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f7fafc; padding: 32px; text-align: center;">
              <p style="color: #a0aec0; font-size: 13px; margin: 0 0 12px 0;">
                © 2025 NardoPay. All rights reserved.
              </p>
              <p style="color: #718096; font-size: 13px; margin: 0;">
                <a href="https://nardopay.com/privacy" style="color: hsl(200, 100%, 50%); text-decoration: none;">Privacy Policy</a>
                ·
                <a href="https://nardopay.com/terms" style="color: hsl(200, 100%, 50%); text-decoration: none;">Terms</a>
                ·
                <a href="https://nardopay.com/contact" style="color: hsl(200, 100%, 50%); text-decoration: none;">Support</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 3. Password Reset Email

**Use this for:** Reset Password email template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your NardoPay password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, hsl(220, 100%, 60%) 0%, hsl(200, 100%, 50%) 100%); padding: 40px 20px; text-align: center;">
              <div style="margin: 0 auto 16px; width: 64px; height: 64px; background-color: rgba(255, 255, 255, 0.2); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center;">
                <span style="color: #ffffff; font-size: 36px; font-weight: 700;">N</span>
              </div>
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">NardoPay</h1>
              <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 0;">Accept Payments Globally</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="color: #1a1a1a; font-size: 26px; font-weight: 700; margin: 0 0 24px 0; text-align: center;">Reset Your Password 🔒</h2>
              
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
                We received a request to reset your password. If you made this request, click the button below to create a new password:
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="{{ .ConfirmationURL }}" style="background-color: hsl(200, 100%, 50%); border-radius: 8px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; display: inline-block; padding: 16px 48px; box-shadow: 0 4px 12px rgba(0, 191, 255, 0.4);">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #718096; font-size: 14px; text-align: center; margin: 16px 0 32px 0;">
                🔒 This link will expire in 60 minutes for security purposes.
              </p>
              
              <!-- Warning -->
              <div style="background-color: #fff8e1; border-radius: 8px; padding: 24px; margin: 32px 0; border: 2px solid #ffd54f;">
                <p style="color: #f57c00; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">⚠️ Security Notice</p>
                <p style="color: #4a5568; font-size: 14px; line-height: 1.6; margin: 0 0 8px 0;">
                  If you didn't request a password reset, please ignore this email. Your password will remain unchanged and your account is secure.
                </p>
                <p style="color: #4a5568; font-size: 14px; line-height: 1.6; margin: 0;">
                  We recommend enabling two-factor authentication for additional security.
                </p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
              
              <p style="color: #718096; font-size: 14px; margin: 24px 0 12px 0; text-align: center;">
                If the button doesn't work, copy and paste this link:
              </p>
              
              <div style="background-color: #f7fafc; border-radius: 6px; padding: 12px;">
                <p style="color: hsl(200, 100%, 50%); font-size: 13px; margin: 0; word-break: break-all; text-align: center;">
                  {{ .ConfirmationURL }}
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f7fafc; padding: 32px; text-align: center;">
              <p style="color: #718096; font-size: 14px; margin: 0 0 16px 0;">
                Need help? Contact our support team for assistance.
              </p>
              <p style="color: #a0aec0; font-size: 13px; margin: 0 0 12px 0;">
                © 2025 NardoPay. All rights reserved.
              </p>
              <p style="color: #718096; font-size: 13px; margin: 0;">
                <a href="https://nardopay.com/privacy" style="color: hsl(200, 100%, 50%); text-decoration: none;">Privacy Policy</a>
                ·
                <a href="https://nardopay.com/terms" style="color: hsl(200, 100%, 50%); text-decoration: none;">Terms</a>
                ·
                <a href="https://nardopay.com/contact" style="color: hsl(200, 100%, 50%); text-decoration: none;">Support</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 4. Email Change Confirmation

**Use this for:** Change Email Address email template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm your new email address</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, hsl(220, 100%, 60%) 0%, hsl(200, 100%, 50%) 100%); padding: 40px 20px; text-align: center;">
              <div style="margin: 0 auto 16px; width: 64px; height: 64px; background-color: rgba(255, 255, 255, 0.2); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center;">
                <span style="color: #ffffff; font-size: 36px; font-weight: 700;">N</span>
              </div>
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">NardoPay</h1>
              <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 0;">Accept Payments Globally</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="color: #1a1a1a; font-size: 26px; font-weight: 700; margin: 0 0 24px 0; text-align: center;">Confirm Email Change ✉️</h2>
              
              <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
                You recently requested to change your NardoPay account email address. Click the button below to confirm this change:
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="{{ .ConfirmationURL }}" style="background-color: hsl(200, 100%, 50%); border-radius: 8px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; display: inline-block; padding: 16px 48px; box-shadow: 0 4px 12px rgba(0, 191, 255, 0.4);">
                  Confirm New Email
                </a>
              </div>
              
              <p style="color: #718096; font-size: 14px; text-align: center; margin: 16px 0 32px 0;">
                🔒 This link will expire in 24 hours for security purposes.
              </p>
              
              <div style="background-color: #fff8e1; border-radius: 8px; padding: 20px; margin: 24px 0; border-left: 4px solid #ffd54f;">
                <p style="color: #f57c00; font-size: 15px; font-weight: 600; margin: 0 0 8px 0;">⚠️ Important</p>
                <p style="color: #4a5568; font-size: 14px; line-height: 1.6; margin: 0;">
                  If you didn't request this email change, please contact our support team immediately to secure your account.
                </p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
              
              <p style="color: #718096; font-size: 14px; margin: 0; text-align: center;">
                Alternative link: <a href="{{ .ConfirmationURL }}" style="color: hsl(200, 100%, 50%); word-break: break-all;">{{ .ConfirmationURL }}</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f7fafc; padding: 32px; text-align: center;">
              <p style="color: #a0aec0; font-size: 13px; margin: 0 0 12px 0;">
                © 2025 NardoPay. All rights reserved.
              </p>
              <p style="color: #718096; font-size: 13px; margin: 0;">
                <a href="https://nardopay.com/privacy" style="color: hsl(200, 100%, 50%); text-decoration: none;">Privacy Policy</a>
                ·
                <a href="https://nardopay.com/terms" style="color: hsl(200, 100%, 50%); text-decoration: none;">Terms</a>
                ·
                <a href="https://nardopay.com/contact" style="color: hsl(200, 100%, 50%); text-decoration: none;">Support</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## How to Install These Templates

1. **Go to Supabase Email Templates:**
   - Visit: https://supabase.com/dashboard/project/mczqwqsvumfsneoknlep/auth/templates

2. **For each email type:**
   - Click on the email type (Confirm signup, Magic Link, Reset Password, Change Email)
   - Copy the corresponding HTML from above
   - Paste it into the "Email Body (HTML)" field
   - Click **Save**

3. **Test it:**
   - Try signing up with a new email
   - You'll receive beautifully branded NardoPay emails! 🎉

**Note:** The `{{ .ConfirmationURL }}` and `{{ .Token }}` are Supabase template variables that will be automatically replaced with the actual confirmation link and token.
