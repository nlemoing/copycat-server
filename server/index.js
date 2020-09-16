const http = require('http');

const { handleChanges } = require("./changes")

const server = http.createServer((request, res) => {
    const { url, method } = request;
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
	if ( request.method === 'OPTIONS' ) {
		res.writeHead(200);
		res.end();
		return;
	}

    if (url !== '/changes' || method !== 'POST') {
        res.statusCode = 404;
        res.end();
        return;
    }

    let body = [];
    request.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', async () => {
        try {
            body = JSON.parse(Buffer.concat(body).toString());
        } catch {
            res.statusCode = 400;
            res.end();
            return;
        }

        await handleChanges(body);
        res.statusCode = 200;
        res.end();
    });
});

server.listen(8000);
