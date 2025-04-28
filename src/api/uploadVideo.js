module.exports = async function (context, req) {
    context.log('HTTP trigger function processed a request.');
  
    const title = (req.body && req.body.title) || 'No title';
    const caption = (req.body && req.body.caption) || 'No caption';
  
    context.res = {
      // status: 200, /* Defaults to 200 */
      body: {
        message: `Video uploaded successfully!`,
        title: title,
        caption: caption,
      },
    };
  };
  