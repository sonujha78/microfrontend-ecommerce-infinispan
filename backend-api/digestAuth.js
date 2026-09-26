const crypto = require('crypto');

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

function parseAuthHeader(header) {
  const result = {};
  const regex = /(\w+)=(?:"([^"]*)"|([^,]*))/g;
  let match;
  while ((match = regex.exec(header)) !== null) {
    result[match[1]] = match[2] !== undefined ? match[2] : match[3];
  }
  return result;
}

async function digestFetch(url, options = {}, username, password) {
  const method = options.method || 'GET';

  // First request — expect 401 with WWW-Authenticate
  const res1 = await fetch(url, { method, headers: options.headers });
  if (res1.status !== 401) return res1;

  const authHeader = res1.headers.get('www-authenticate');
  if (!authHeader) return res1;

  const params = parseAuthHeader(authHeader);
  const nc = '00000001';
  const cnonce = crypto.randomBytes(8).toString('hex');
  const uri = new URL(url).pathname + new URL(url).search;

  const ha1 = md5(`${username}:${params.realm}:${password}`);
  const ha2 = md5(`${method}:${uri}`);
  const response = md5(`${ha1}:${params.nonce}:${nc}:${cnonce}:${params.qop}:${ha2}`);

  const authValue =
    `Digest username="${username}", realm="${params.realm}", nonce="${params.nonce}", ` +
    `uri="${uri}", qop=${params.qop}, nc=${nc}, cnonce="${cnonce}", response="${response}"` +
    (params.opaque ? `, opaque="${params.opaque}"` : '');

  return fetch(url, {
    ...options,
    method,
    headers: { ...options.headers, Authorization: authValue },
  });
}

module.exports = { digestFetch };
