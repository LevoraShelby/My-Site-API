import express from "express"
import pg, {ConnectionConfig} from 'pg'
import 'dotenv/config'

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
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(titles))
})

app.listen(8080)
