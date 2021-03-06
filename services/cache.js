const mongoose = require('mongoose')
const redis = require('redis')
const util = require('util')
const redisURL = 'redis://127.0.0.1:6379'
const client = redis.createClient(redisURL)

client.get = util.promisify(client.get)

const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.cache = function() {
	this.useCache = true
	return this
}

mongoose.Query.prototype.exec = async function() {
	if (!this.useCache) {
		return exec.apply(this, arguments)
	}

	const key = JSON.stringify(
		Object.assign({}, this.getQuery(), {
			collection: this.mongooseCollection.name
		})
	)
	// Does value for 'key' exist?
	const cacheValue = await client.get(key)
	// Yes
	if (cacheValue) {
		console.log(`Cache Value: ${cacheValue}`)
		const doc = JSON.parse(cacheValue)
		return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(doc)
	}
	// ...No
	const result = await exec.apply(this, arguments)
	client.set(key, JSON.stringify(result), 'EX', 10)
	return result
}
