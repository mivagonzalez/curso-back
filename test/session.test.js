const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;
const requester = supertest('http://localhost:5000');

describe('Session Router', () => {
    const randommNumberForMail = Math.random() * 10 * Date.now();
    const userToCreate = {
        first_name: "Mauricio",
        last_name: "Gonzalez",
        email: `emailDeprueba-${randommNumberForMail}@gmail.com`,
        password: "passwordDePrueba",
        age:"20",
        address:"direccionDePrueba"
    }

    it('Registers a user', async () => {
        const result = await requester.post('/api/v1/session/register').send(userToCreate)
        const cookieResult = result.headers['set-cookie'][0];
        const cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1],
        }

        expect(cookieResult).to.be.ok;
        expect(cookie.name).to.be.ok.and.eql("connect.sid");
        expect(cookie.value).to.be.ok;

        await requester.post('/api/v1/session/logout').set('Cookie', cookieResult)
    })

    it('Logs in ', async () => {
        const result = await requester.post('/api/v1/session/login').send({ email: `emailDeprueba-${randommNumberForMail}@gmail.com`, password:"passwordDePrueba"})

        const cookieResult = result.headers['set-cookie'][0];
        const cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1],
        }
        expect(cookieResult).to.be.ok;
        expect(cookie.name).to.be.ok.and.eql("connect.sid");
        expect(cookie.value).to.be.ok;

        await requester.post('/api/v1/session/logout').set('Cookie', cookieResult)
    })

    it('Logs out ', async () => {
        const result = await requester.post('/api/v1/session/login').send({ email: `emailDeprueba-${randommNumberForMail}@gmail.com`, password:"passwordDePrueba"})
        const cookieResult = result.headers['set-cookie'][0];
        const logoutResult = await requester.get('/api/v1/session/logout').set('Cookie', cookieResult)
        
        const logoutCookieResult = logoutResult.headers['set-cookie'];
        
        expect(logoutCookieResult).to.be.deep.equals(undefined);
        expect(logoutResult.status).to.be.eql(302);

    })
    
    it('current returns current user data ', async () => {
        const result = await requester.post('/api/v1/session/login').send({ email: `emailDeprueba-${randommNumberForMail}@gmail.com`, password:"passwordDePrueba"})
        const cookieResult = result.headers['set-cookie'];
        const currentResult = await requester.get('/api/v1/session/current').set('Cookie', cookieResult)

        expect(currentResult.body.user.email).to.be.deep.equals(`emailDeprueba-${randommNumberForMail}@gmail.com`);
        expect(currentResult.body.user.first_name).to.be.deep.equals("Mauricio");
        expect(currentResult.body.user.last_name).to.be.deep.equals("Gonzalez");
        expect(currentResult.body.user.age).to.be.deep.equals(20);
        expect(currentResult.body.user.role).to.be.deep.equals("user");
        
        await requester.post('/api/v1/session/logout').set('Cookie', cookieResult)

    })
});
