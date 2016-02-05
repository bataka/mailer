var foduler = require('foduler');
var Swig = require('swig');
var config = require('../config');

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(config.mandrillApiKey);

module.exports = foduler.module('mailer-service').as('ms')
    .factory('config', [
        function () {
            var config = {
                debug: false,
                swig: {
                    autoescape: true,
                    varControls: ['[{', '}]'],
                    cmtControls: ['[#', '$]'],
                    tagControls: ['[%', '%]'],
                    cache: 'memory'
                }
            };

            var o = {
                get: function () {
                    return config;
                },
                debug: function (debug) {
                    config.debug = debug;
                }
            };
            return o;
        }
    ])
    .factory('renderTpl', ['config',
        function (configure) {
            var swig = false;

            function tpl(html, locals) {
                if (swig === false) {
                    swig = new Swig.Swig(configure.get().swig);
                }
                return swig.render(html, {locals: JSON.parse(locals)});
            }

            return function (html, locals) {
                return tpl(html, locals);
            };
        }
    ])
    .factory('mailMgr', ['models:model',
        function (Model) {
            return {
                find: function () {
                    return Model.Mail
                        .findOne({
                            where: {status: Model.Mail.statusEnums.pending},
                            order: 'level'
                        });
                }
            }
        }
    ])
    .factory('tplMgr', ['models:model',
        function (Model) {
            return {
                find: function (name) {
                    return Model.Template
                        .findOne({
                            where: {name: name}
                        });
                }
            }
        }
    ])
    .factory('mandrillSender', ['$lodash',
        function (_) {

            function generateMsg(options) {
                var message = {
                    "subject": options.subject,
                    "from_email": "info@limesoft.mn",
                    "from_name": "LIME SOFT",
                    "to": [{"email": options.to}]
                };

                if (options.mode == 'plain')
                    message.text = options.html;
                else
                    message.html = options.html;

                return message;
            }

            return {
                send: function (options) {

                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {

                            mandrill_client.messages.send({
                                "message": generateMsg(options)
                            }, function (result) {

                                var r = result[0];

                                if (r.status == 'rejected')
                                    reject('REJECTED - ' + r.reject_reason);
                                else if (r.status == 'invalid')
                                    reject('INVALID EMAIL');
                                else
                                    resolve({status: 'sent'});

                            }, function (err) {
                                reject(err.name + ' - ' + err.message);
                            });

                            //resolve({status: 'sent'});
                        }, _.random(500, 2000));
                    })
                }
            }
        }
    ])
    .factory('sender', ['mailMgr', 'tplMgr', 'renderTpl', 'mandrillSender',
        function (mailMgr, tplMgr, renderTpl, mandrillSender) {

            var mail = {};

            return {
                getMail: function () {
                    return mail;
                },
                send: function () {
                    return mailMgr.find()
                        .then(function (m) {
                            if (m) {    //IF MAIL FOUND
                                mail = m;
                                var mailOptions = {
                                    to: m.to,
                                    subject: m.subject,
                                    mode: m.mode
                                };

                                if (m.template) {   //IF MAIL HAS A TEMPLATE
                                    return tplMgr
                                        .find(m.template)
                                        .then(function (tpl) {
                                            if (tpl) {  //IF TEMPLATE FOUND
                                                mailOptions.html = renderTpl(tpl.content, m.params);
                                                mailOptions.mode = tpl.type;
                                            } else  //IF TEMPLATE NOT FOUND
                                                mailOptions.html = m.params;

                                            return mandrillSender.send(mailOptions);
                                        })
                                } else {    //IF MAIL HAS NOT A TEMPLATE
                                    mailOptions.html = m.body;
                                    return mandrillSender.send(mailOptions);
                                }
                            } else {    //IF MAIL NOT FOUND
                                return {
                                    status: 'finished'
                                };
                            }
                        })
                        .catch(function (err) {
                            return {
                                status: 'failed',
                                errMsg: err || 'ERROR OCCURRED WHILE SENDING MAIL'
                            };
                        });
                }
            }
        }
    ])
    .factory('runner', ['models:model', 'sender',
        function (Model, sender) {

            var mail;

            function updateFailed(err) {
                return Model.Mail
                    .update(
                    {
                        status: Model.Mail.statusEnums.failed,
                        errorMessage: err
                    },
                    {where: {id: mail.id}})
                    .then(function () {
                        r.run();
                    })
            };

            var r = {
                run: function () {
                    sender.send()
                        .then(function (result) {
                            mail = sender.getMail();
                            if (result.status == 'sent') {
                                Model.Mail
                                    .update(
                                    {status: Model.Mail.statusEnums.sent},
                                    {where: {id: mail.id}})
                                    .then(function () {
                                        r.run();
                                    })
                            } else if (result.status == 'failed') {
                                updateFailed(result.errMsg);
                            } else if (result.status == 'finished') {
                                //stop
                            }
                        })
                        .catch(function (err) {
                            updateFailed(err || 'ERROR OCCURRED WHILE SENDING MAIL');
                        });
                }
            };

            return r;
        }
    ]);