var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3000");

describe('MAILER', function () {

    this.timeout(10000);

    it("send", function (done) {
        server
            .post('/service/1/send')
            .send({
                "level": 200,
                "mode": "template",
                "to": "gglbtk@gmail.com",
                "subject": "Hello",
                "body": "goods",
                "template": "tpl5",
                "params": {"name": "Jack"}
            })
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {

                res.body.should.have.property('transaction');
                done();
                //var id = res.body.transaction;
                //
                //console.log(id, 323232);
                //
                //setTimeout(done, 2000);
            });
    });

});