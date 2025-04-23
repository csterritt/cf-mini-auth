import { Hono } from 'hono'
import { renderer } from './renderer'
import { buildHome } from './routes/buildHome'
import { buildPrivate } from './routes/buildPrivate'

const app = new Hono()

app.use(renderer)

buildHome(app)
buildPrivate(app)

export default app
