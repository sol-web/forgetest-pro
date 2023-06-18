const forge = require('node-forge')
let message = 'Hello world - 헬로월드1'
let key = 'sdjkflkajflsdkajdjflkjdflkdsh1'
console.log('Message: ' + message)
console.log('Key: ' + key)

let hmac = forge.hmac.create()
hmac.start('md5', key)
hmac.update(message)
let result = hmac.digest().toHex()
console.log('HMAC-MD5: ' + result)

let hmac1 = forge.hmac.create()
hmac1.start('sha1', key)
hmac1.update(message)
let result1 = hmac1.digest().toHex()
console.log('HMAC-SHA1: ' + result1)

let hmac2 = forge.hmac.create()
hmac2.start('sha256', key)
hmac2.update(message)
let result2 = hmac2.digest().toHex()
console.log('HMAC-SHA256: ' + result2)

let hmac3 = forge.hmac.create()
hmac3.start('sha384', key)
hmac3.update(message)
let result3 = hmac3.digest().toHex()
console.log('HMAC-SHA384: ' + result3)

let hmac4 = forge.hmac.create()
hmac4.start('sha512', key)
hmac4.update(message)
let result4 = hmac4.digest().toHex()
console.log('HMAC-SHA512: ' + result4)
