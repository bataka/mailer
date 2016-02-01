/**
 * @apiDefine AppId
 * @apiParam (url) {String} app application id
 */

module.exports = ['mailer-base router', '$web:routerFactory', 'models:model', '$lodash', '$web:body-parser', 'ms:runner', 'sa:model', '$Promise',
    function (base, factory, Model, _, bodyParser, runner, SaModel, Promise) {


        var router = factory('/service/:appId', {
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
         * @api {post} /service/:appId/send send mail
         * @apiName serviceSend
         * @apiGroup service
         * @apiDescription
         * Илгээх 2 төрөлтэй. Үүнд:<br>
         *     1. `plain`  -  `body` талбарыг шууд илгээнэ<br>
         *     2. `template` - харгалзах `template`-н дагуу хэвшүүлэн илгээнэ.
         *        `mode` нь `template` дээр урьдчилан тохируулагдсан байна <br>
         *
         * `params` талбар утгатай байвал `template` төрлөөр ажиллана. ямар нэг 'template' буюу загвар олдохгүй тохиолдолд `params`
         * талбарын утгыг 'json string' хэлбэрээр илгээнэ.
         *
         * @apiUse AppId
         * @apiParam (body){Number} level=100 sending order. order type asc
         * @apiParam (body){String=html,plain} mode=plain  mail-г илгээх mode
         * @apiParam (body){String} to to email
         * @apiParam (body){String} subject mail subject
         * @apiParam (body){String} body mail content
         * @apiParam (body){String} template template name
         * @apiParam (body){json} [params] template-д хэвшүүлэх утгууд
         *
         * @apiSuccess {String} transaction transaction id
         *
         * @apiError NotPayment
         * @apiUse ErrorResp
         */
        router.post('/send', bodyParser.json(), function (req, res) {
            res.promiseJson(function () {
                return Model.Mail
                    .create(_.merge(req.body, {
                        appId: req.params.appId,
                        params: JSON.stringify(req.body.params || {})
                    }))
                    .then(function (mail) {
                        runner.run();
                        return {transaction: mail.id};
                    });
            });

        });

        /**
         * @api {get} /service/:app/check/:transaction check mail status
         * @apiName serviceCheck
         * @apiGroup service
         *
         * @apiParam (url){String} transaction transaction id
         *
         * @apiSuccess {String} status mail status
         */
        router.get('/check/:transaction', function (req, res) {
            res.promiseJson(function () {
                return Model.Mail
                    .findById(req.params.transaction)
                    .then(function (mail) {
                        if (!mail) throw new Error('NOT FOUND EMAIL.');
                        else {
                            return {
                                status: Model.Mail.statusLabelFromValue(mail.status),
                                code: mail.status
                            };
                        }
                    });
            });
        });

        /**
         * @api {get} /service/:app/stop/:transaction cancel mail
         * @apiName serviceStop
         * @apiGroup service
         *
         * @apiParam (url){String} transaction transaction id
         * @apiUse TrueFalseResult
         */
        router.get('/stop/:transaction', function (req, res) {

            res.promiseJson(function () {
                return Model.Mail
                    .findById(req.params.transaction)
                    .then(function (mail) {
                        if (!mail) throw new Error('NOT FOUND EMAIL.');
                        else {
                            var enums = Model.Mail.statusEnums;
                            if (mail.status == enums.pending) {
                                return mail
                                    .update({status: enums.cancelled})
                                    .then(function () {
                                        return {result: true};
                                    });
                            } else
                                return {result: false};
                        }
                    });
            });

        });


        /**
         * @api {get} /service/:app/logs get last 50 mails of application
         * @apiName serviceLogs
         * @apiGroup service
         * @apiSuccess {String} status last 50 mails of application
         */
        router.get('/logs', function (req, res) {
            res.promiseJson(function () {
                var appId = req.params.appId;

                return Model.Mail
                    .findAll({
                        where: {appId: appId},
                        order: 'createdAt DESC',
                        limit: 50
                    })
                    .then(function (data) {
                        return Promise.map(data, function (it) {
                            it.status = Model.Mail.statusLabelFromValue(it.status);
                            return it;
                        })
                    });

            });
        });
    }
];