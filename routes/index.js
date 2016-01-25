var foduler = require('foduler');

module.exports = foduler.module('mailer.router').as('mr')
    .factory('mailer-base router', ['$web:routerFactory',
        function (routerFactory) {
            return routerFactory('/');
        }
    ])

    .factory('service', require('./service'))
    .factory('template', require('./template'))

    .factory('routers', ['service', 'template']);