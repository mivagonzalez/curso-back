const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;
const requester = supertest('http://localhost:5000');

describe('Carts Router', () => {
    let premiumUserCookie;
    let normalUserCookie;
    let addedCartId;
    const exampleProduct = {
        "title": "Kraemer",
        "description": "culpa qui est excepteur labore",
        "code": "1619121",
        "price": 324,
        "status": true,
        "stock": 128,
        "category": "zapatillas",
        "thumbnails": [
            "Kraemer-1619121.jpg"
        ],

    };

    before(async function() {
        const res1 = await requester
          .post('/api/v1/session/login')
          .send({ email: "gonza.mauricioivan@gmail.com", password: "mauricio123" })
        premiumUserCookie = res1.headers['set-cookie'];
        
        const res = await requester
          .post('/api/v1/session/login')
          .send({ email: "mauricioUser@gmail.com", password: "mauricio123" })

        normalUserCookie = res.headers['set-cookie'];
    });

    after(async function() {
        await requester
          .get('/api/v1/session/logout')
          .set('Cookie', normalUserCookie);
        
        await requester
          .get('/api/v1/session/logout')
          .set('Cookie', premiumUserCookie);
    });

    it('creates a new cart', async () => {
        const result = await requester.post('/api/v1/carts').set('Cookie', normalUserCookie);
        addedCartId = result.body.cart.cartId;

        expect(result.body.cart).to.exist;
        expect(result.body.cart.products).to.be.deep.equals([]);
    });

    it('adds product to the cart', async () => {
        const addProductResult = await requester.post('/api/v1/products').send(exampleProduct).set('Cookie', premiumUserCookie)
        const addedProduct = addProductResult.body.product;


        const result = await requester.post(`/api/v1/carts/${addedCartId}/product/${addedProduct.productId}`).set('Cookie', normalUserCookie)
        expect(result.body.products).to.exist;
        expect(result.body.products[0].productId).to.be.deep.equals(addedProduct.productId);
        expect(result.body.products[0].quantity).to.be.deep.equals(1);

    await requester.delete(`/api/v1/products/${addedProduct.productId}`).set('Cookie', premiumUserCookie)

    });

    it('getProductsByCart devuelve los prod del cart creado', async () => {
        const addProductResult = await requester.post('/api/v1/products').send(exampleProduct).set('Cookie', premiumUserCookie)
        const addedProduct = addProductResult.body.product;

        await requester.post(`/api/v1/carts/${addedCartId}/product/${addedProduct.productId}`).set('Cookie', normalUserCookie)
        const productsByCart = await requester.get(`/api/v1/carts/${addedCartId}`).set('Cookie', normalUserCookie)

        expect(productsByCart.body.products).to.exist;
        expect(productsByCart.body.products[0].productId).to.be.deep.equals(addedProduct.productId);
        expect(productsByCart.body.products[0].quantity).to.be.deep.equals(1);

        await requester.delete(`/api/v1/products/${addedProduct.productId}`).set('Cookie', premiumUserCookie)
    })
});
