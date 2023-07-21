const purchaseProducts = async (cartId) => {
  try {
    const result = await fetch(`/api/v1/carts/${cartId}/purchase`, {
      method: "POST"
    });
    const data = await result.json(); // Parse the JSON data
    if(result && result.status == 200) {
      const ticketId = data.ticket._id
      alert("Productos Adquiridos")
      window.location.href = `/ticket/${ticketId}`;
    }
    else {
      alert(`No se pudieron adquirir los productos. Error: ${data.message}`)
    }
  } catch (error) {
    alert(error)
  }
}