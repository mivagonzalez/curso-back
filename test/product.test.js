const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;
const requester = supertest('http://localhost:5000');

describe('Products Router', () => {
    let cookie;
    let addedProductId;
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

    before(function() {
        return requester
          .post('/api/v1/session/login')
          .send({ email: "gonza.mauricioivan@gmail.com", password: "mauricio123" })
          .expect(302)
          .then(res => {
            // Save the cookie to use it later to maintain the session
            cookie = res.headers['set-cookie'];
          });
    });

    it('get products devuelve null, por que no hay productos', async () => {
        const result = await requester.get('/api/v1/products').set('Cookie', cookie)
        expect(result.body.payload).to.be.equals(null)
    });

    it('adds product to db', async () => {
        const result = await requester.post('/api/v1/products').send(exampleProduct).set('Cookie', cookie)
        addedProductId = result.body.product.productId;

        const expectedProduct = {
            ...exampleProduct,
            _id: result.body.product._id,
            productId: result.body.product.productId,
            owner: "gonza.mauricioivan@gmail.com",
            __v: 0
        }

        expect(result.body.product).to.exist;
        expect(result.body.product).to.be.deep.equal(expectedProduct);
        expect(result.body.ok).to.be.true;
    });

    it('get products devuelve el producto agregado', async () => {

        const result = await requester.get('/api/v1/products').set('Cookie', cookie)
        const productFromDb = result.body.payload[0];

        const expectedProduct = {
            ...exampleProduct,
            _id: productFromDb._id,
            productId: productFromDb.productId,
            owner: "gonza.mauricioivan@gmail.com",
            __v: 0,
            id: productFromDb._id
        }
        expect(productFromDb).to.exist;
        expect(productFromDb).to.be.deep.equal(expectedProduct)
    });

    it('updates product ', async () => {
        const result = await requester.put(`/api/v1/products/${addedProductId}`).send({category: "remeras"}).set('Cookie', cookie)
        expect(result.body.ok).to.be.true;
        expect(result.body.message).to.be.equals('product updated');
       
        const products = await requester.get('/api/v1/products').set('Cookie', cookie)
        const updatedProduct = products.body.payload[0];
        expect(updatedProduct).to.exist;
        const expectedProduct = {
            ...exampleProduct,
            _id: updatedProduct._id,
            productId: updatedProduct.productId,
            owner: "gonza.mauricioivan@gmail.com",
            __v: 0,
            category: "remeras",
            id: updatedProduct._id
        }
        expect(updatedProduct).to.be.deep.equal(expectedProduct);
        expect(result.body.ok).to.be.true;
    });


    it('deletes product to db', async () => {
        const result = await requester.delete(`/api/v1/products/${addedProductId}`).set('Cookie', cookie)
        expect(result.body.deletedProducts).to.exist;
        expect(result.body.deletedProducts.deletedCount).to.be.deep.equal(1);
    });
    
});
