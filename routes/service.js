/**
 * @apiDefine AppId
 * @apiParam (url) {String} app application id
 */

module.exports = ['mailer-base router','routerFactory',
    function (base,factory) {


        var router = factory('/service/:app', {
            base: base
        });


        /**
         * @api {post} /service/:app/send mail sending
         * @apiName serviceSend
         * @apiGroup service
         * @apiDescription
         * Ажиллах 2 mode той <br>
         *     1. `plan`  -  `body` талбарыг шууд илгээнэ<br>
         *     2. `template` - харгалзах `template`-н дагуу хэвшүүлэн илгээнэ.
         *        `sendmode` нь template дээр уридчилан тохигуулагдсан байна <br>
         *
         * `params` талбар утгатай байвал `template mode` -р ажиллана. ямар нэг template олдохгүй бол `params` талбарын утгийг json string-р илгээнэ
         *
         * @apiUse AppId
         * @apiParam (body){Number} level=100 sending order. order type asc
         * @apiParam (body){String=html,plan} sendmode=plan  mail-г илгээх mode
         * @apiParam (body){String} to to email
         * @apiParam (body){String} subject mail subject
         *
         * @apiParam (body){String} body mail content
         *
         * @apiParam (body){String} template="first template" template name
         * @apiParam (body){json} [params] template param
         *
         * @apiSuccess {String} transaction transaction id
         *
         * @apiError NotPayment
         * @apiUse ErrorResp
         */
        router.get('/send', function (req, res) {

        });

        /**
         * @api {get} /service/:app/check/:transaction status checking
         * @apiName serviceCheck
         * @apiGroup service
         *
         * @apiParam (url){String} transaction transaction id
         *
         * @apiUse OkSuccess
         */
        router.get('/check/:transaction', function (req, res) {

        });

        /**
         * @api {get} /service/:app/stop/:transaction sending stop
         * @apiName serviceStop
         * @apiGroup service
         *
         * @apiParam (url){String} transaction transaction id
         * @apiUse OkSuccess
         */
        router.get('/stop/:transaction', function (req, res) {

        });
    }
];