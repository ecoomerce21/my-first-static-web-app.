const multiparty = require('multiparty');

module.exports = async function (context, req) {
  context.log('POST request received for uploading video.');

  if (req.method !== 'POST') {
    context.res = {
      status: 405,
      body: 'Method Not Allowed',
    };
    return;
  }

  const body = req.body;

  context.res = {
    status: 200,
    body: { message: 'Video upload API is working!', receivedData: body },
  };
};

