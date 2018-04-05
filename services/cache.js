const mongoose = require('mongoose')
const redis = require('redis')
const util = require('util')
const redisURL = 'redis://127.0.0.1:6379'
const client = redis.createClient(redisURL)

client.get = util.promisify(client.get)

const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.exec = async function() {
	const key = JSON.stringify(
		Object.assign({}, this.getQuery(), {
			collection: this.mongooseCollection.name
		})
	)
	// Does value for 'key' exist?
	const cacheValue = await client.get(key)
	// Yes
	if (cacheValue) {
		console.log(cacheValue)
	}

	const result = await exec.apply(this, arguments)
	client.set(key, JSON.stringify(result))

	return result
}
