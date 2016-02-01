/**
 * @apiDefine AppId
 * @apiParam (url) {String} app application id
 */
module.exports = ['mailer-base router', '$web:routerFactory', 'models:model', '$web:body-parser', '$lodash', 'sa:model',
    function (base, factory, Model, bodyParser, _, SaModel) {

        var router = factory('/template/:appId', {
            base: base,
            options: {mergeParams: true},
            before: function (req, res, next) {

                return SaModel.AppConfigMailer.findById(req.params.appId)
                    .then(function (conf) {
                        if (conf && conf.active)
                            return next();
                        throw {
                            name: 'MailerService',
                            status: 400,
                            message: 'Mailer Service is not active'
                        };
                    })
                    .catch(next);
            }
        });

        /**
         * @apiGroup template
         * @api {get} /template/:app/ template list
         */
        router.get('/', function (req, res) {
            res.promiseJson(function () {
                return Model.Template.findAll({
                    where: {
                        appId: req.params.appId
                    }
                });
            });
        });

        /**
         * @api {post} /template/:app/ template create
         * @apiGroup template
         *
         * @apiParam (body) {String} name template name
         * @apiParam (body) {String=html,plain} type=plain template type
         * @apiParam (body) {Text} content template content
         *
         * @apiSuccess {string} template created template id
         */
        router.post('/', bodyParser.json(), function (req, res) {
            res.promiseJson(function () {
                return Model.Template
                    .create(_.extend(req.body, {
                        appId: req.params.appId
                    }))
                    .then(function (tpl) {
                        return {template: tpl.id};
                    });
            });
        });

        /**
         * @api {put} /template/:app/:template template update
         * @apiGroup template
         *
         * @apiUse OkResult
         */
        router.put('/:id', bodyParser.json(), function (req, res) {
            res.promiseJson(function () {
                return Model.Template
                    .update(req.body, {
                        where: {
                            id: req.params.id
                        }
                    })
                    .then(function (result) {
                        if (result[0] > 0)
                            return {result: true};
                        else throw new Error('Template not found.');
                    });
            });
        });

        /**
         * @api {delete} /template/:app/:template template delete
         * @apiGroup template
         * @apiParam (url) app application id
         * @apiParam (url) template template id
         *
         * @apiUse OkResult
         * @apiError result=no
         */
        router.delete('/:id', function (req, res) {
            res.promiseJson(function () {
                return Model.Template
                    .destroy({
                        where: {
                            id: req.params.id
                        }
                    })
                    .then(function (result) {
                        if (result > 0)
                            return {result: true};
                        else throw new Error('Template not found.');
                    });
            });
        });
    }
];

