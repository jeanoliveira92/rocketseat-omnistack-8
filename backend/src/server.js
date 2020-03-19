const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes.js');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
    const { user } = socket.handshake.query;
    connectedUsers[user] = socket.id;
});

// CONEXÃO COM O BANCO DE DADOS
mongoose.connect("mongodb+srv://rocketseat:rocketseat@clusterx-nlrev.mongodb.net/oministack8?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
})

// INDICAR AO SERVIDOR O USO DO JSON 
app.use(express.json());
// HABILITA O ACESSO EXTERNO A API
app.use(cors());
// ADICIONANDO AS ROTAS AO SERVIDOR
app.use(routes);
// PORTA DE ACESSO A API
server.listen(3333);