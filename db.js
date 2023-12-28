import { MongoClient, ServerApiVersion } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const client = new MongoClient(process.env.MONGO, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

/**
 * MongoDB Connection class.
 * @constructor
 */
export default class Mongo {
    constructor() {
        const f = async () => {
            try {
                await client.connect()
                this.c = await client.db("test")
                await this.c.command({ping: 1})
                console.log("MongoDB connection active")
            } catch (err) {
                console.log("MongoDB connection FAILURE:")
                console.log(err)
                process.exit(1)
            }
        }
        f().then(r => {})
    }

    /**
     * Get documents from a certain collection
     * @param {string} col - Target collection
     * @param {Object} filter - Only get documents that match this filter
     * @returns {Promise} - Results of the GET Request
     */
    get(col,filter) {
        return new Promise(async (res, rej) => {
            try {
                const collection = await this.c.collection(col)
                res(await collection.find(filter).toArray())
            } catch (err) {
                rej(err)
            }
        })

    }

    /**
     * Post documents to a certain collection
     * @param {string} col - Target collection
     * @param {Array} data - Array of documents as objects
     * @returns {Promise} Document inserted
     */
    async post(col,data) {
        return new Promise(async (res, rej) => {
            try {
                const collection = await this.c.collection(col)
                let result = await collection.insertMany(data)
                res()
            } catch (err) {
                rej(err)
            }
        })
    }

    /**
     * Edit a document
     * @param col - Target collection
     * @param filter - Which document to edit
     * @param query - PATCH query as per the docs
     * @returns {Promise} Document after edits
     */
    async patch(col, filter, query) {
        return new Promise(async (res, rej) => {
            try {
                const collection = await this.c.collection(col)
                res(await collection.updateOne(filter, query))
            } catch (err) {
                rej(err)
            }
        })
    }

    /**
     * Delete documents
     * @param col
     * @param filter
     * @returns {Promise<void>}
     */
    async delete(col, filter) {
        const collection = await this.c.collection(col)
        await collection.deleteMany(filter)
    }
}