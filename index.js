const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Apple App Site Association (REQUIRED for Universal Links)
app.get('/.well-known/apple-app-site-association', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    "applinks": {
      "details": [
        {
          "appIDs": ["YOUR_TEAM_ID.com.ben.ironwill"],
          "components": [
            { "/": "/invite/*" }
          ]
        }
      ]
    }
  });
});

// Handle invite links
app.get('/invite/:code', (req, res) => {
  const inviteCode = req.params.code.toUpperCase();

  // Validate invite code (8 characters, alphanumeric)
  if (!inviteCode || inviteCode.length !== 8 || !/^[A-Z0-9]+$/.test(inviteCode)) {
    return res.status(400).send('Invalid invite code');
  }

  const html = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>加入團隊挑戰 - Ironwill</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            background: linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 24px;
            padding: 48px 32px;
            text-align: center;
            max-width: 400px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        }
        .icon {
            width: 80px;
            height: 80px;
            background: #FF6B35;
            border-radius: 20px;
            margin: 0 auto 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
        }
        h1 {
            font-size: 24px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 12px;
        }
        .subtitle {
            font-size: 16px;
            color: #666;
            margin-bottom: 32px;
        }
        .invite-code {
            font-size: 28px;
            font-weight: 700;
            font-family: 'SF Mono', Monaco, monospace;
            color: #FF6B35;
            background: #FFF5F3;
            padding: 16px 24px;
            border-radius: 12px;
            margin-bottom: 32px;
            border: 2px solid #FFE5DF;
        }
        .app-button {
            background: #FF6B35;
            color: white;
            border: none;
            border-radius: 16px;
            padding: 16px 32px;
            font-size: 18px;
            font-weight: 600;
            width: 100%;
            margin-bottom: 16px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: transform 0.2s;
        }
        .app-button:hover {
            transform: translateY(-2px);
        }
        .manual-text {
            font-size: 14px;
            color: #999;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #f0f0f0;
        }
        .loading {
            display: none;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">🔥</div>
        <h1>加入團隊挑戰</h1>
        <p class="subtitle">你收到了一個 Ironwill 團隊挑戰邀請</p>

        <div class="invite-code">${inviteCode}</div>

        <div class="loading" id="loading">正在開啟應用...</div>

        <a href="ironwill://invite/${inviteCode}" class="app-button" id="openApp">
            開啟 Ironwill 應用
        </a>

        <a href="https://apps.apple.com/app/ironwill/id123456789" class="app-button" style="background: #007AFF;">
            下載 Ironwill
        </a>

        <div class="manual-text">
            如果應用程式沒有自動開啟，請手動開啟 Ironwill 應用，
            點擊「加入挑戰」並輸入邀請碼：<strong>${inviteCode}</strong>
        </div>
    </div>

    <script>
        // Try to open the app automatically
        document.getElementById('openApp').addEventListener('click', function(e) {
            document.getElementById('loading').style.display = 'block';

            // If app doesn't open within 2 seconds, redirect to App Store
            setTimeout(function() {
                // Check if page is still visible (app didn't open)
                if (!document.hidden) {
                    document.getElementById('loading').style.display = 'none';
                }
            }, 2000);
        });

        // Auto-attempt to open app on page load for mobile
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            setTimeout(function() {
                window.location = 'ironwill://invite/${inviteCode}';
            }, 500);
        }
    </script>
</body>
</html>
  `;

  res.send(html);
});

// Health check
app.get('/', (req, res) => {
  res.send('Ironwill Universal Links Server Running 🔥');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});