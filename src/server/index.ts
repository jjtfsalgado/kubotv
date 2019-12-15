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

app.use(express.static(path.join(process.cwd(), 'dist')));

app.get('*', (req, res) => res.sendFile(path.join(process.cwd(), 'dist/index.html')));




app.listen(PORT, function () {
    console.log('#### Express server is up on port ' + PORT);
});