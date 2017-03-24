var connect = require('./connect');
var app = connect();

require('./middle')(app);
require('./route')(app);
app.listen(8080);
