import mongoose from "mongoose"
import log from '@shared/logger/index'

function connect() {
    const dbUri = process.env.DB_URI as string

    return mongoose
    .connect(dbUri)
    .then(() => {
        log.info("Database connected")
    })
    .catch((error) => {
        log.error("db error", error)
        process.exit(1)
    })
}

export {connect}