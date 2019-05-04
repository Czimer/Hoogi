const crypto = require('crypto')
var algorithm = 'aes256';
var key = 'password';

module.exports = {
	encrypt(text) {
		const cipher = crypto.createCipher(algorithm, key)
		return cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
	}
}