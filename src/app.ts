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

app.get('/short-stories/titles', async (req, res) => {
	const dbRes = await pgClient.query(`
		select title from short_story
		join story_availability on short_story.story_id=story_availability.story_id
		where access_level='public';`
	)
	const titles = dbRes.rows.map( (row) => row.title! )
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(titles))
})

app.listen(8080)
