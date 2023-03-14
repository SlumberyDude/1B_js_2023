
module.exports = (req, res) => {
    let body = "";
    req.on('data', (chunk) => {
        body += chunk;
    })
    req.on('end', () => {
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