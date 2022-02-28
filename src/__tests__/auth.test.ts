// import chai from "chai" 
import app from "../server.test"
import request from "supertest"
import assert from "assert"

describe("AUTH API", () => {
    const payload = {
        "first_name": "Sidul",
        "last_name": "Islam",
        "email": "rahaddiu@gmail.com",
        "password": "123456"
    }

    it("It should REGISTER a user", (done) => {
        request(app)
        .post("/register")
        .send(payload)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
            if (err) return done(err);
            assert(res.body.first_name, payload.first_name)
            assert(res.body.last_name, payload.last_name)
            assert(res.body.email, payload.email)
            return done();
        })
        
    })

    it("It should LOGIN a user", (done) => {
        request(app)
        .post("/login")
        .send({email: payload.email, password: payload.password})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err)
            assert(typeof(res.body.accessToken), "string")
            assert(typeof(res.body.refreshToken), "string")
            assert(typeof(res.body.expiresIn), "string")
            return done();
        })
    })


})