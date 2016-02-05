module.exports = ['Sequelize', 'sequelize instance',
    function (Sequelize, sqInstance) {
        var AppConfigMailer = sqInstance.define('app_config_mails', {
                app: {type: Sequelize.INTEGER, primaryKey: true, allowNull: false},
                active: {type: Sequelize.BOOLEAN, defaultValue: false}
            }
        );
        return AppConfigMailer;
    }
];