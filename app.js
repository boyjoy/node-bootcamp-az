var http = require('http'),
	fs = require('fs'),
	path = require('path');

http.createServer(function(req, res) {
	var file = path.join(__dirname, req.url);

	fs.readFile(file, function(err, content) {
		if(err) {
			res.writeHead(404);
			res.end("Could not find the file");
			return;
		}
		res.end(content);
	});

}).listen(3000);