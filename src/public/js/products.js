const addProductToCart = async (productId, cartId) => {
  debugger
  // hacer fetch a la API
  await fetch("/api/v1/carts/"+cartId+"/product/"+productId, {
    method: "POST"
  });

  // enviar notificacion al cliente
  alert("Producto agregado al carrito")

  //TODO: (por hacer):
  // encapsular en un try catch en caso de que no se haya podido agregar el producto al carrito
}