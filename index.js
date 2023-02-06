import startApi, { initializeProducts } from "./src/server/rest-api.js";

// funcion creada solo para que el corrector teste el funcionamiento
initializeProducts();


startApi();