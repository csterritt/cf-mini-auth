import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'

import { renderer } from './renderer'
import { buildHome } from './routes/buildHome'
import { buildPrivate } from './routes/buildPrivate'
import { buildCount } from './routes/buildCount'
import { handleIncrement } from './routes/handleIncrement'
import { build404 } from './routes/build404'
import { PATHS } from './constants'
import { Bindings } from './local-types'
import { buildSignIn } from './routes/auth/buildSignIn'
import { handleStartOtp } from './routes/auth/handleStartOtp'
import { handleFinishOtp } from './routes/auth/handleFinishOtp'
import { buildAwaitCode } from './routes/auth/buildAwaitCode'
import { handleCancelSignIn } from './routes/auth/handleCancelSignIn'
import { handleSignOut } from './routes/auth/handleSignOut'
import { provideSession } from './middleware/provide-session'

const app = new Hono<{ Bindings: Bindings }>()

app.use(secureHeaders())
app.use(logger())
app.use(renderer)
app.use(provideSession)

buildHome(app)
buildPrivate(app)
buildCount(app)
handleIncrement(app)
buildSignIn(app)
handleStartOtp(app)
buildAwaitCode(app)
handleFinishOtp(app)
handleCancelSignIn(app)
handleSignOut(app)

// this MUST be the last route declared!
build404(app)

console.log('Registered paths:')
Object.values(PATHS).forEach((path) => console.log(path))

export default app
