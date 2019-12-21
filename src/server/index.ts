const express = require('express');
const path = require('path');

// Create our app
const app = express();
const PORT = process.env.PORT || 2000;

app.use(function (req, res, next){
    if (req.headers['x-forwarded-proto'] === 'https') {
        res.redirect('http://' + req.hostname + req.url);
    } else {
        next();
    }
});

app.use(express.static('dist'));

app.get('*', (req, res) => {
    res.sendFile('dist/index.html', {root: __dirname})
});

app.listen(PORT, function () {
    console.log('#### Express server is up on port ' + PORT);
});