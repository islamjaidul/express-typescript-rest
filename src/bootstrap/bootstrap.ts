import express, {Application, Request, Response, NextFunction} from "express"
const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

export { app, Application, Request, Response, NextFunction }