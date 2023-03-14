
module.exports = (baseUrl) => (req, res) => {
    const parsedUrl = new URL(req.url, baseUrl);

    // query params parsing
    const params = {}
    console.log(parsedUrl);
    parsedUrl.searchParams.forEach( (val, key) => params[key] = val );

    req.pathname = parsedUrl.pathname;

    // // pathname parsing
    let pnChunks = req.pathname.split('/');
    
    if (isFinite(pnChunks[pnChunks.length - 1])) {
        console.log('last chunk is finite');
        params['id'] = +pnChunks[pnChunks.length - 1];
        pnChunks[pnChunks.length - 1] = ':id';
        req.pathname = pnChunks.join('/');
    }

    req.params = params;
}
