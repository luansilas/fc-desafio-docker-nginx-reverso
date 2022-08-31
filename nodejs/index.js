const express = require('express');
// const randomNames = require('random-name');
const Chance = require('chance');
const app = express();
const mysql = require('mysql2/promise');

const port = "8000";


const sqlInsert = `insert into people(name) values(?)`;
const sqlSelect = `select * from people`;

app.get("/", async (req, res) => { 
        
    const connection = await mysql.createConnection({ 
        host: 'db',
        user: 'root',
        password: 'root',
        database: 'nodedb'
    });
    const chance = new Chance();
    const name = chance.name({nationality: 'it'});
    
    await connection.query(sqlInsert, [name] );

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

app.listen(port, ()=> {
    console.log(`Express is Running on ${port}`);
})


