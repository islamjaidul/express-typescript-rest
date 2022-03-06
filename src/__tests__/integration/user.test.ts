import request from "supertest"
import app from "../../server.test"
import assert from "assert"
import { signJwt } from "@shared/utils/jwt.utils"

const payload = {
    "first_name": "Jidul",
    "last_name": "Islam",
    "email": "jaidul26@gmail.com",
    "password": "123456"
}


describe("USER API", () => {
    const accessToken = signJwt(payload)

    it("it should return 422 for VALIDATION ERROR of user endpoint", (done) => {
        request(app)
        .post("/register")
        .expect("Content-Type", /json/)
        .expect(422)
        .end((err, res) => {
            if (err) return done(err)
            assert(typeof(res.body), "object")
            return done()
        })
    })

    it("It should return 401 for TOKEN MISSING for user endpoint", (done) => {
        request(app)
        .get("/users")
        .expect(401)
        .end((err, res) => {
            if (err) return done(err)
            assert(res.body.message, "Token is missing")
            return done()
        })
    })
    
    it("It should return 403 for UNAUTHORIZED for user endpoint", (done) => {
        request(app)
        .get("/users")
        .set('Authorization', `Bearer abcdhjkahdjhajsdfhjadsfhjh`) // wrong bearer token
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
            if (err) return done(err)
            return done()
        })
    })

    it("It should return 200 for CORRECT BEARER TOKEN for user endpoint", (done) => {
        request(app)
        .get("/users")
        .set('Authorization', `Bearer ${accessToken}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err)
            return done()
        })
    })
})