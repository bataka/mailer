var foduler = require('foduler');
module.exports = foduler.module('mailer.router')
    .factory('mailer-base router', ['routerFactory',
        function (routerFactory) {
            return routerFactory('/');
        }
    ])

    .factory('router service', require('./service'))
    .factory('router app', require('./app'))
    .factory('router template', require('./template'))

    .factory('routers', ['router service','router app','router template',
        function () {

        }
    ])

    ;