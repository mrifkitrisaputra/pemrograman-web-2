<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Verify Your Email - Cyber Forge</title>
</head>
<body style="margin: 0; padding: 0; background-color: #1E1E1E; font-family: 'Courier New', Courier, monospace; color: #ffffff;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #2D2D2D; border-left: 4px solid #48BB78; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
                    <tr>
                        <td style="padding: 30px;">
                            <!-- Header -->
                            <h2 style="font-size: 24px; font-weight: bold; color: #48BB78; margin-top: 0;">Welcome to Cyber Forge</h2>

                            <!-- Body -->
                            <p style="font-size: 16px; line-height: 1.6; color: #CBD5E0; margin-bottom: 30px;">
                                Hello {{ $user->username ?? 'User' }},
                            </p>

                            <p style="font-size: 16px; line-height: 1.6; color: #CBD5E0; margin-bottom: 30px;">
                                We're excited to have you on board. To complete your registration, please verify your email address by clicking the button below:
                            </p>

                            <!-- Tombol Verifikasi -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="left" style="padding-bottom: 40px;">
                                        <a href="{{ $url }}" 
                                           style="background-color: #4C51BF; color: #ffffff !important; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 6px; display: inline-block;">
                                           Verify Email Address
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Footer -->
                            <p style="font-size: 14px; color: #718096; margin-top: 0;">
                                If you did not create an account, no further action is required.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>