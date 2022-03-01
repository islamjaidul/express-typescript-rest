import mongoose from "mongoose"
import log from '../logger/index'

function connect() {
    const dbUri = process.env.DB_URI_TEST as string

    return mongoose
    .connect(dbUri)
    .then(() => {
        log.info("Test Database connected")
    })
    .catch((error) => {
        log.error("db error", error)
        process.exit(1)
    })
}

export {connect}