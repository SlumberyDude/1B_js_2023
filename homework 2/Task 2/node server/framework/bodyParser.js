
module.exports = (req, res) => {
    console.log('in bodyParser middleware');
    let body = "";
    req.on('data', (chunk) => {
        body += chunk;
    })
    req.on('end', () => {
        console.log('in "end" signal in bodyParser');
        if (body) {
            try {
                req.body = JSON.parse(body);
            } catch(err) {
                console.log(err);
                req.body = {};
            }
        }
        req.emit('endBodyParse', req, res);
    })
}