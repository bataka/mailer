module.exports = ['mailer-base router','routerFactory',
    function (base,factory) {
        var router = factory('/app', {
            base: base
        });

        /**
         * @apiGroup app
         * @api {get} /app/ get app listing
         * @apiPermission admin
         */
        router.get('/', function (req, res) {

        });

        /**
         * @api {post} /app/ create app
         * @apiGroup app
         *
         * @apiParam {String} name application name
         *
         * @apiSuccess {Number} app generated app id
         */
        router.post('/', function (req, res) {

        });

        /**
         * @api {put} /app/:id update app
         * @apiGroup app
         */
        router.put('/:id', function (req, res) {

        });
    }
];

