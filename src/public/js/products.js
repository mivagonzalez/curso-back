
const addProductToCart = async (productId, cartId) => {
  debugger
  try {
    await fetch(`/api/v1/carts/`+cartId+"/product/"+productId, {
      method: "POST"
    });
  
    alert("Producto agregado al carrito")
    var value = parseInt(document.getElementById("cartCount").textContent) + 1 ;
    document.getElementById("cartCount").textContent = value;
  } catch (error) {
    alert(error)
  }
}

const viewCart = async (cartId) => {
  debugger
  // hacer fetch a la API
  window.location.href = `carts/${cartId}`;

  // enviar notificacion al cliente
  //TODO: (por hacer):
  // encapsular en un try catch en caso de que no se haya podido agregar el producto al carrito
}