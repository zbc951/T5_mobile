'use strict';

const url = 'mbnt3-demo.op8899.net';

const PROXY_CONFIG = {
  '/api/**': {
    'target': 'https://' + url,
    'secure': false,
    'changeOrigin': true,
    'logLevel': 'debug',
    'bypass': (req, res, proxyOptions) => {
      delete req.headers['origin'];
      req.headers['host'] = url;
    }
  }
};

module.exports = PROXY_CONFIG;
