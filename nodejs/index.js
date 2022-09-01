const express = require('express');
// const randomNames = require('random-name');
const Chance = require('chance');
const app = express();
const mysql = require('mysql2/promise');

const port = "8000";


const sqlInsert = `insert into people(name) values(?)`;
const sqlSelect = `select * from people`;


const createMysqlConnection = async ()=> {
    const connection = mysql.createConnection({ 
        host: 'db',
        user: 'root',
        password: 'root',
        database: 'nodedb'
    });

    return connection;
}
const criaRegistroNoBanco = async () => {

    const connection = await createMysqlConnection();

    sqlCreateTable = `CREATE TABLE IF NOT EXISTS people(id int not null auto_increment, name varchar(255), primary key (id))`;
    await connection.query(sqlCreateTable);

    const chance = new Chance();
    const name = chance.name({nationality: 'it'});
    
    await connection.query(sqlInsert, [name] );

    connection.end();

}

app.get("/", async (req, res) => { 


    const connection = await createMysqlConnection();

    const [people] = await connection.query(sqlSelect);

    
    const peopleNames = people.reduce((prev, current) => {
        return `${prev} <p> - ${current["name"]} <p>`;
    }, "");

    connection.end();
    
    res.send(`
    <h1>Full Cycle Rocks!</h1>

    ${peopleNames}
    `)
});

criaRegistroNoBanco();

app.listen(port, ()=> {
    console.log(`Express is Running on ${port}`);
})


