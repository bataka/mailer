module.exports = ['mailer-base router', 'routerFactory',
    function (base, factory) {
        var router = factory('/template/:app', {
            base: base
        });

        /**
         * @apiGroup template
         * @api {get} /template/:app/ template list
         */
        router.get('/template/:app/', function (req, res) {

        });

        /**
         * @api {post} /template/:app/ template create
         * @apiGroup template
         *
         * @apiParam {string} name template name
         * @apiParam {string} template template content
         * @apiParam {string=html,plan} sendmode
         *
         * @apiSuccess {string} template generated new id
         */
        router.post('/', function (req, res) {

        });

        /**
         * @api {put} /template/:app/:template template update
         * @apiGroup template
         *
         * @apiUse OkSuccess
         */
        router.put('/template/:app/:id', function (req, res) {

        });

        /**
         * @api {delete} /template/:app/:template template delete
         * @apiGroup template
         * @apiParam (url) app application id
         * @apiParam (url) template template id
         *
         * @apiUse OkSuccess
         * @apiError result=no
         */
        router.delete('/template/:app/:id', function (req, res) {

        });
    }
];

