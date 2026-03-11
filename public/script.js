import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
const PORT = 3000;

//config do mysql

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'agendamento'
};

// config do express/node
app.use(express.json());
app.use(express.static('public'));


//rota para lidar com um novo agendamento
app.post('/salvar/agendamento', async (req, res) => {

    //conexão com mysql
    let connection;
    try {
        
        connection = await mysql.createConnection(dbConfig);
        console.log('Conectado ao banco de dados MySQL');

        const insertQuery= !`
        
            INSERT INTO agendamentos (nome, telefone, dia, hora)
            VALUES (?, ?, ?, ?);
        `;

        //variavel de result do banco
        const [result] = await connection.execute(insertQuery, [nome, telefone, dia, hora]);


        console.log(`Agendamento salvo com sucesso, ID: ${result.insertId}`);

        const mensagem = `Olá ${nome}, seu agendamento para o dia ${dia} às ${hora} foi salvo com sucesso!`;

        res.status(200).send({ message: mensagem });

    } 
    //catch para erros
    catch (err) {
        console.error('Erro ao processar agendamento:', err);

        res.status(500).send({ message: 'Erro interno ao salvar agendamento' });
    }finally {
        if (connection) {
            await connection.end();
        }   
    }
})