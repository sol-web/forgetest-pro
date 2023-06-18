const forge = require('node-forge')

const algo = 'AES-GCM'

// Modes: ECB, CBC, CFB, OFB, CTR, and GCM)
console.log('Algorithm-mode: ' + algo)

const plaintext =
  'Hello world Hello world 한글메시지 要推出大做出了回应 ポリコットント 新品未開封品 ماذا تريد؟'

const authData = 'jkhfkhglkdslgjdfhkfdhfgh'

var someBytes = forge.util.encodeUtf8(plaintext)
console.log('Plaintext: ' + plaintext) // generate a random key and IV
// Note: a key size of 16 bytes will use AES-128, 24 => AES-192, 32 => AES-256

var key = forge.random.getBytesSync(16) // 16, 24, 32
var iv = forge.random.getBytesSync(16) // 16
console.log('Key: ' + forge.util.bytesToHex(key))
console.log('IV: ' + forge.util.bytesToHex(iv))

// encrypt some bytes using GCM mode
var cipher = forge.cipher.createCipher(algo, key)
cipher.start({
  iv: iv, // should be a 12-byte binary-encoded string or byte buffer
  additionalData: authData, // optional
  tagLength: 128, // optional, defaults to 128 bits
})
cipher.update(forge.util.createBuffer(someBytes))
cipher.finish()
var encrypted = cipher.output
var tag = cipher.mode.tag
// outputs encrypted hex
console.log('Encrypted: ' + encrypted.toHex())
// outputs authentication tag
console.log('Tag: ' + tag.toHex()) // decrypt some bytes using GCM mode

var decipher = forge.cipher.createDecipher(algo, key)
decipher.start({
  iv: iv,
  additionalData: authData, // optional
  tagLength: 128, // optional, defaults to 128 bits
  tag: tag, // authentication tag from encryption
})
decipher.update(encrypted)
var pass = decipher.finish()
// pass is false if there was a failure (eg: authentication tag didn't match)
if (pass) {
  // outputs decrypted hex
  console.log('Deciphered: ' + decipher.output)
}
