const socket = io();

var btn = document.getElementById('submit');
btn.addEventListener('click', onClick);

function onClick(event) {
    event.preventDefault()
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    const price = document.getElementById("price");
    const stock = document.getElementById("stock");
    const status = document.getElementById("status");
    const thumbnails = document.getElementById("thumbnails");
    const code = document.getElementById("code");
    const category = document.getElementById("category");

    const product = {
        title: title.value,
        description: description.value,
        price: price.value,
        status: status.value,
        thumbnails: thumbnails.value,
        code: code.value,
        stock: stock.value,
        thumbnails: thumbnails.value,
        category: category.value
    }

    socket.emit("addNewProduct", product);

    title.value = "";
    description.value = "";
    price.value = "";
    stock.value = "";
    status.value = "";
    thumbnails.value = "";
    code.value = "";
    category.value = "";
}

socket.on("productAdded", ({added, error, product}) => {
    if(added === true) {

        const { title, description, code, price, status, stock, category, thumbnails } = product;
        debugger

        const newProd = document.createElement('li');
        newProd.innerHTML = '<li><h2>' + title + '</h2><p>Description: ' + description + '</p><p>Price: ' + code + '</p><p>Code: ' + code + '</p><p>Stock: ' + stock + '</p><p>Price: ' + price + '</p><p>Status: ' + status + '</p><p>Category: ' + category + '</p><p>Thumbnails: ' + thumbnails + '</p></li>';
        const productsList = document.getElementById("productsList").append(newProd)
    }else {
        alert('Error, producto no agregado. Descripcion del error: ', error)
    }
})