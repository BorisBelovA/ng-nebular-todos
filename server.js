const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(__dirname + '/dist/ng-nebular-todos'));
app.get('/*', function(req,res) {
    console.log('awdawd')
    res.sendFile(path.join(__dirname + '/dist/ng-nebular-todos/index.html'));
    
});
app.listen(process.env.PORT || 8080);