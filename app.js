var http = require('http'),
	fs = require('fs'),
	path = require('path');

var cachedFiles = {};

http.createServer(function(req, res) {
	var file = path.join(__dirname, req.url);

	var cachedFile = cachedFiles[file];
	if(cachedFile) {
		console.log('serving cached file: ', req.url);
		res.end(cachedFile);
		return;
	}

	fs.readFile(file, function(err, content) {
		if(err) {
			res.writeHead(404);
			res.end("Could not find the file");
			return;
		}

		fs.watch(file, function(e) {
			if(e == 'change') {
				fs.readFile(file, function(err, content) {
				if(err) {
					delete cachedFiles[file];
					return;
				}

					console.log('refreshing cache', req.url);
					cachedFiles[file] = content;
				});
			}
		});

		console.log('serving new file', req.url);
		cachedFiles[file] = content;
		res.end(content);
	});
}).listen(3000);