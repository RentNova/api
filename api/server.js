const jsonServer = require('json-server');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults({static: '/uploads'});
const routes = require("./routes.json")

server.use(cors());
server.use(bodyParser.json({ limit: '50mb' }));;

server.use(middlewares);
server.use(jsonServer.rewriter(routes));

server.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log('Email recibido:', email);
    console.log('Password recibido:', password);
  
    const users = router.db.get('accounts').value();
    const user = users.find(u => u.email === email && u.password === password);
  
    console.log('Usuario encontrado:', user);
    
    if (user) {
        const usersDetails = router.db.get('userdetails').value();
        const userDetail = usersDetails.find(u => u.id === user.userDetailsId);
        console.log(userDetail)
        res.json({ message: 'Login exitoso', user, userDetail });
    } else {
        res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  });


server.use(router);
const port = process.env.PORT || 3000;
server.listen(port, ()=>{
    console.log(`JSON Server is running on port ${port}`);
});