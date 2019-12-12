var express = require('express');
var path = require('path');

// Create our app
var app = express();
const PORT = process.env.PORT || 2000;

app.use(function (req, res, next){
    if (req.headers['x-forwarded-proto'] === 'https') {
        res.redirect('http://' + req.hostname + req.url);
    } else {
        next();
    }
});

// app.use(express.static('dist'));

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist/index.html')));

app.listen(PORT, function () {
    console.log('Express server is up on port ' + PORT);
});