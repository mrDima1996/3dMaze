var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var url = require('url');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');
var log = require('./libs/logger.js')(module);

var routes = require('./routes/index');
var users = require('./routes/users');

var ROOT = __dirname +'';

var app = express();

app.set('port', config.get('port'));
http.createServer(app).listen(app.get('port'),function(){
  log.info('Server is succsessfuly running on '+app.get('port')+ ' port');
});
// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(hook);
function hook(req,res, next){
    if (req.method === 'GET') {
        debugger;
        var parsedUrl = url.parse(req.url, true);
        parsedUrl = parsedUrl.path;

        try {
            parsedUrl = decodeURIComponent(parsedUrl);
        }
        catch (e) {
            res.status = 400;
            res.end('Bad request');
        }
        ;

        if ( parsedUrl == '/' ) parsedUrl = '/index.html';

        var filePath = path.normalize(path.join(ROOT, parsedUrl));


        //res.sendFile(filePath);
        fs.stat(filePath, function (err, stats) {
            if ( err || !stats.isFile() ) {
                res.status = 404;
                log.info(parsedUrl + 'is not found');
                res.end('File not found');
                return;
            }


            sendFile(filePath, res);

        });
    }
};


function sendFile(path, res) {
  fs.readFile(path, function(err, content) {
    if (err) throw err;
    var mine = require('mime').lookup(path);
    log.info('Sending '+ path);
    res.setHeader('Content-type', mine + '; charset=utf-8');
    res.end(content);
  });
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });





module.exports = app;
