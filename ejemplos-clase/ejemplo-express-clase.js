import Express from 'express';
import Users from '../src/entities/product-manager/__tests__/users.json' assert { type: 'json' };
const PORT = 5000;
const app = Express();
const generos = ["masculino", "femenino"];
app.listen(PORT, () => {
    console.log(`A;PI RUNNING ON PORT: ${PORT}`);
});
app.use(Express.json());
app.use(Express.urlencoded({ extended: true}));

app.get('/', (request, response) => {
    response.send("HOLA ESTUDIANTES");
});

app.get('/saludo', (request, response) => {
    response.send("HOLA ESTOY USANDO EXPRESS");
});

app.get('/alive', (request, response) => {
    response.json({ message: "HOLA ESTOY USANDO EXPRESS"});
    // response.send("HOLA ESTOY USANDO EXPRESS");
});

app.get('/bienvenido/:nombre/:edad/:apellido', (request, response) => {
    const { nombre, edad, apellido } = request.params;
    response.json({ ok: true, message: `HOLA ${nombre} ${apellido} ESTAS USANDO EXPRESS Y TENES ${edad} AÑOS` });
});

app.get('/usuarios', (req, res) => {
    return res.json({
        ok: true,
        message: `lista de usuarios`,
        usuarios: Users.usuarios
    })
});

app.get('/usuario/:userId', (req, res) => {
    console.log("query parameters", req.query);
    const userId = req.params.userId;
    const usuario = Users.usuarios.find((user) => {
        return user.id === Number(userId);
    })
    if(isNaN(userId)) {
        return res.status(400).json({
            ok: true,
            message: "El id es incorrecto",
            queryParams: req.query,
        })    
    }
    return res.json({
        ok: true,
        message: `lista de usuarios`,
        queryParams: req.query,
        usuario
    })
});

app.get('/usuario', (req, res) => {
    console.log("query parameters", req.query);
    const { sexo } = req.query;
    
    const userId = req.params.userId;
    if(!sexo || !generos.includes((!sexo ? "": sexo).toLowerCase()) ) {
        return res.json({
            ok: true,
            message: "el genero introducido no existe",
            queryParams: req.query
        })
    }
    const filteredList = Users.usuarios.filter(u => u.sexo === sexo.toLocaleLowerCase());

    return res.json({
        ok: true,
        message: `lista de usuarios`,
        queryParams: req.query,
        users: filteredList
    })
});

app.post("/usuario", (req,res) => {
    const body =  req.body;
    console.log("fule index asdafdasfsad", req.body);
    const lastId = Users.usuarios[Users.usuarios.length -1].id;
    const newUser = {id: lastId + 1, ...body}
    
    res.json({
        ok: true,
        message: "usuario correcto",
        usuario: newUser
    })
});
