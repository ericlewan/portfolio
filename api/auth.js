// OAuth entry point — redirects user to GitHub's authorization page.
// Decap CMS calls this when "Login with GitHub" is clicked.
export default function handler(req, res) {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers['host'];
  const base = `${protocol}://${host}`;

  const params = new URLSearchParams({
    client_id: process.env.OAUTH_CLIENT_ID,
    redirect_uri: `${base}/api/callback`,
    scope: 'repo,user',
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
}
