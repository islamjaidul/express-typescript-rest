import 'dotenv/config'
import log from './logger/index'
import {connect} from './db/connect'
import route from './route'
import { app, Request, Response, NextFunction } from './bootstrap/bootstrap'

const port = process.env.PORT as string
const host = process.env.HOST as string

app.listen(port, () => {
    log.info(`Server is running in http://${host}:${port} port`)
    connect()
    route(app)
})