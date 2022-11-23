const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname + '/dist/demopr'));
app.get('/*', function (req: any, res: any) {
  res.sendFile(path.join(__dirname + '/dist/demopr/index.html'));
});
app.listen(process.env['PORT'] || 5005);
