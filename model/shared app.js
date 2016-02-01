var foduler = require('foduler');
var Sequelize = require('sequelize');

module.exports = foduler.module('shared app').as('sa')
    .value('Sequelize', Sequelize)
    .factory('sequelize instance', ['mailer:config',
        function (config) {
            return new Sequelize(config.byte.db.database, config.byte.db.user, config.byte.db.password, {
                host: config.byte.db.host,
                port: config.byte.db.port,
                dialect: 'mysql',
                pool: config.byte.db.pool
            });
        }
    ])
    .factory('model AppConfigMailer', require('./app config mailer'))
    .factory('model', ['model AppConfigMailer',
        function (AppConfigMailer) {
            return {
                AppConfigMailer: AppConfigMailer
            };
        }
    ]);



