const button = document.getElementsByClassName('agregarAlCarrito')

button.addEventListener('click', async _ => {
  try {     
    const response = await fetch('yourUrl', {
      method: 'post',
      body: {
        // Your body
      }
    });
    console.log('Completed!', response);
  } catch(err) {
    console.error(`Error: ${err}`);
  }
});