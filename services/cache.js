const mongoose = require('mongoose')
const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.exec = function() {
	console.log('About to run QUERY')
	console.log(this.getQuery())

	return exec.apply(this, arguments)
}
