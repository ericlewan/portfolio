// OAuth callback — exchanges GitHub code for an access token,
// then posts it back to the Decap CMS window and closes.
export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Missing code parameter');
  }

  let data;
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        code,
      }),
    });
    data = await response.json();
  } catch (err) {
    return res.status(500).send(postMessage('error', { error: 'Token exchange failed' }));
  }

  if (data.error || !data.access_token) {
    const error = data.error_description || data.error || 'Unknown error';
    return res.send(postMessage('error', { error }));
  }

  res.send(postMessage('success', { token: data.access_token, provider: 'github' }));
}

function postMessage(status, payload) {
  const message = 'authorization:github:' + status + ':' + JSON.stringify(payload);
  return (
    '<!DOCTYPE html><html><body><script>' +
    'window.opener.postMessage(' + JSON.stringify(message) + ', "*");' +
    'window.close();' +
    '<\/script></body></html>'
  );
}
