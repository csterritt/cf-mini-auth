import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { csrf } from 'hono/csrf'
import { secureHeaders } from 'hono/secure-headers'
import { bodyLimit } from 'hono/body-limit'

import { renderer } from './renderer'
import { buildHome } from './routes/buildHome'
import { buildPrivate } from './routes/buildPrivate'
import { buildCount } from './routes/buildCount'
import { handleIncrement } from './routes/handleIncrement'
import { build404 } from './routes/build404'
import { HTML_STATUS, PATHS } from './constants'
import { Bindings } from './local-types'
import { buildSignIn } from './routes/auth/buildSignIn'
import { handleStartOtp } from './routes/auth/handleStartOtp'
import { handleFinishOtp } from './routes/auth/handleFinishOtp'
import { buildAwaitCode } from './routes/auth/buildAwaitCode'
import { handleCancelSignIn } from './routes/auth/handleCancelSignIn'
import { handleSignOut } from './routes/auth/handleSignOut'
import { provideSession } from './middleware/provide-session'
import { handleResendCode } from './routes/auth/handleResendCode'
import { handleSetClock } from './routes/auth/handleSetClock' // PRODUCTION:REMOVE
import { handleResetClock } from './routes/auth/handleResetClock' // PRODUCTION:REMOVE
import { handleSetDbFailures } from './routes/handleSetDbFailures' // PRODUCTION:REMOVE

const app = new Hono<{ Bindings: Bindings }>()

app.use(secureHeaders({ referrerPolicy: 'strict-origin-when-cross-origin' }))
app.use(
  '*',
  csrf({
    origin: (origin) => {
      // return /https:\/\/cf-mini.example.com$/.test(origin)  // PRODUCTION:UNCOMMENT
      return /http:\/\/localhost(:\d+)?$/.test(origin) // PRODUCTION:REMOVE
    },
  })
)
app.use(
  bodyLimit({
    // maxSize: 4 * 1024, // 4kb // PRODUCTION:UNCOMMENT
    maxSize: 1024, // 50kb // PRODUCTION:REMOVE
    onError: (c) => {
      console.log('Body limit exceeded')
      return c.text('overflow :(', HTML_STATUS.CONTENT_TOO_LARGE)
    },
  })
)

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
handleResendCode(app)
handleCancelSignIn(app)
handleSignOut(app)

handleSetClock(app) // PRODUCTION:REMOVE
handleResetClock(app) // PRODUCTION:REMOVE
handleSetDbFailures(app) // PRODUCTION:REMOVE

// this MUST be the last route declared!
build404(app)

console.log('Registered paths:')
Object.values(PATHS).forEach((path) => console.log(path))

export default app
