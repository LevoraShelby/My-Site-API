import express from "express"
import pg, {ConnectionConfig, Query} from 'pg'
import dotenvx from "@dotenvx/dotenvx"
// TODO: Fix this. The "-f" option in dotenvx SHOULD be pointing to the correct environment.
// Need to figure out why it isn't.
dotenvx.config({path: `.env.local`})

const app = express()
const PostgresClient = pg.Client
const pgConfig: ConnectionConfig = {
	user: process.env["postgres.user"],
	password: process.env["postgres.password"],
	port: parseInt(process.env["postgres.port"]!,10),
	host: process.env["postgres.host"],
	database: process.env["postgres.database"]
}
const pgClient = new PostgresClient(pgConfig)
await pgClient.connect()

app.get('/writings/titles', async (_, res, next) => {
	const dbRes = await pgClient.query(`
		SELECT title FROM writing
		JOIN writing_access ON writing.writing_id=writing_access.writing_id
		WHERE access_level='public';`
	)
	const titles = dbRes.rows.map( (row) => row.title! )
	res.setHeader('Content-Type', 'application/json')
	res.send(JSON.stringify(titles))
})

app.get('/writings/:title', async (req, res) => {
	// pg handles sanitizations for us!
	// https://github.com/brianc/node-postgres/wiki/FAQ#8-does-node-postgres-handle-sql-injection
	const dbRes = await pgClient.query('SELECT text FROM writing WHERE title = $1', [req.params["title"]])
	if (dbRes.rows.length == 0) {
		res.status(404)
		res.send()
		return
	}
	// TODO: Add page breaks
	res.setHeader('Content-Type', 'text/plain')
	res.send(dbRes.rows[0].text)
})

app.listen(8080)
