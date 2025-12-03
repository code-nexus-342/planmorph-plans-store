// import the client class
const { Client } = require("pg");

// Define the connection string or configuration object 
const client = new Client({
    PGHOST:'ep-spring-voice-ahz9vjb9-pooler.c-3.us-east-1.aws.neon.tech',
    PGDATABASE:'neondb',
    PGUSER:'neondb_owner',
    PGPASSWORD:'npg_Lb9KBS0mACjF',
    PGSSLMODE:'require',
    PGCHANNELBINDING:'require'
})


async function connectAndQuery() {
    try {
        // connect to the database
        await client.connect();
        console.log("Successfully connected to the database");
        

        // run a simple query 
        const res = await client.query('SELECT NOW()');
        console.log('Current time from DB:', res.rows[0].now);
        
    } catch (err) {
        console.log('Connection or query error:', err);
        
    } finally {
        // close the connection 
        await client.end();
        console.log('Connection Closed.');
        
    }
}