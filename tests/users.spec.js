//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

// Test the /GET users
 describe('/GET users', () => {
    it('it should GET paged users', (done) => {
        chai.request(app)
            .get('/users')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('result');
                res.body.result.should.be.a('array');
                res.body.should.have.property('page');
                Number(res.body.page).should.eq(1);
                res.body.should.have.property('size');
                Number(res.body.size).should.eq(10);
                done();
            });
    });
});


describe('/GET users?page=2&size=3', () => {
    it('it should GET paged users, page=2, size=3', (done) => {
        chai.request(app)
            .get('/users?page=2&size=3')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                Number(res.body.page).should.eq(2);
                Number(res.body.size).should.eq(3);
                done();
            });
    });
});

describe('/GET users?page=3&size=7', () => {
    it('it should GET paged users, page=3, size=7, startId=15', (done) => {
        chai.request(app)
            .get('/users?page=3&size=7')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                Number(res.body.page).should.eq(3);
                Number(res.body.size).should.eq(7);
                Number(res.body.result[0].id).should.eq(15);
                done();
            });
    });
});

describe('/GET users?page=5&size=23', () => {
    it('it should GET paged users, page=5, size=23, startId=', (done) => {
        chai.request(app)
            .get('/users?page=5&size=23')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                Number(res.body.page).should.eq(5);
                Number(res.body.size).should.eq(23);
                const startId = (5 - 1) * 23 + 1;
                Number(res.body.result[0].id).should.eq(startId);
                done();
            });
    });
});


describe('/GET users?page=3&size=7', () => {
    it('it should GET paged users, page=13290, size=1, startId=', (done) => {
        chai.request(app)
            .get('/users?page=13290&size=1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                Number(res.body.page).should.eq(13290);
                Number(res.body.size).should.eq(1);
                Number(res.body.result[0].id).should.eq(13290);
                done();
            });
    });
});

describe('/GET users?page=0&size=10', () => {
    it('it should GET paged users, page=0, size=10', (done) => {
        chai.request(app)
            .get('/users?page=0&size=10')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                Number(res.body.page).should.eq(1);
                Number(res.body.size).should.eq(10);
                Number(res.body.result[0].id).should.eq(1);
                done();
            });
    });
});

describe('/GET users?page=-100&size=10', () => {
    it('it should GET paged users, page=-100, size=10', (done) => {
        chai.request(app)
            .get('/users?page=-100&size=10')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                Number(res.body.page).should.eq(1);
                Number(res.body.size).should.eq(10);
                Number(res.body.result[0].id).should.eq(1);
                done();
            });
    });
});
