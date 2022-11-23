import express from 'express';
import { join } from 'path';
const app = express();

app.use(__dirname + '/dist/demopr');
app.get('/*', function (req, res) {
  res.sendFile(join(__dirname + '/dist/demopr/index.html'));
});
app.listen(process.env['PORT'] || 5005);
