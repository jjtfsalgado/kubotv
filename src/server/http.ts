import express from 'express';
const app = express();

class Http {
    init(){
        const PORT = process.env.PORT || 2000;
        app.use((req, res, next) => {
            if (req.headers['x-forwarded-proto'] === 'https') {
                return res.redirect('http://' + req.hostname + req.url);
            };

            next();
        });

        app.use(express.static('dist'));

        app.get('*', (req, res) => {
            res.sendFile('dist/index.html', {root: __dirname})
        });

        app.listen(PORT, () => {
            console.log('#### Express server is up on port ' + PORT);
        });
    }
}

const http = new Http();

export default http;