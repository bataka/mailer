/**
 * Created by Administrator on 1/18/2016.
 */

var foduler = require('foduler');

var mailer = foduler.module('mailer')
    .include(require('foduler/module-web'))
    .include(require('./routes'))

    .config(['express', 'app', // static assets
        function (express, app) {
            app.use('/doc', express.static(__dirname + '/doc'));
            app.use('/out', express.static(__dirname + '/out'));
        }
    ])

    .on('postRun', ['routers', 'app',
        function (routers, app) {
            app.use(function (req, res, next) {
                var err = new Error('Not Found. request path=' + req.path);
                err.status = 404;
                next(err);
            });

            app.use(function (err, req, res, next) {

                res.status(err.status || 500);
                res.json({
                    message: err.message,
                    error: err
                });
            });


            app.listen(process.env.NODE_PORT || 3000, function () {
                var port = this.address().port;
                console.log('`%s` starting. use port:%s', mailer.$name(), port);
            });
        }
    ]);


foduler.start(mailer);