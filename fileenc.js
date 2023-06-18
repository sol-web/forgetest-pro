const forge = require('node-forge')
const fs = require('fs')
var inputFile = 'input.txt'
var encryptedFile = inputFile + '.enc'
var decryptedFile = encryptedFile + '.txt' // 송신측
var input = fs.readFileSync(inputFile, { encoding: 'binary' })
console.log('AES-128-CBC')
var keySize = 16 // 16 => AES-128, 24 => AES-192, 32 => AES-256
var numIterations = 100
var salt = forge.random.getBytesSync(8)
// 패스워드 기반 암호화
var key = forge.pkcs5.pbkdf2('password', salt, numIterations, keySize)
var iv = forge.random.getBytesSync(keySize)
console.log('- Key: ' + forge.util.bytesToHex(key))
console.log('- iv: ' + forge.util.bytesToHex(iv))
var cipher = forge.cipher.createCipher('AES-CTR', key)
cipher.start({ iv: iv })
cipher.update(forge.util.createBuffer(input, 'binary'))
cipher.finish()
var encrypted = cipher.output
var output = forge.util.createBuffer()
// if using a salt, prepend this to the output:
if (salt !== null) {
  output.putBytes('Salted__') // (add to match openssl tool output)
  output.putBytes(salt)
}
output.putBuffer(cipher.output)
fs.writeFileSync(encryptedFile, output.getBytes(), { encoding: 'binary' })
console.log('Ciphertext is saved in ' + encryptedFile)

// 수신측
var input = fs.readFileSync(encryptedFile, { encoding: 'binary' })
var keySize = 16 // 16 => AES-128, 24 => AES-192, 32 => AES-256
var numIterations = 100 // parse salt from input
input = forge.util.createBuffer(input, 'binary')
// skip "Salted__" (if known to be present)
input.getBytes('Salted__'.length)
// read 8-byte salt
var salt = input.getBytes(8)
var key = forge.pkcs5.pbkdf2('password', salt, numIterations, keySize)
var decipher = forge.cipher.createDecipher('AES-CTR', key)
decipher.start({ iv: iv })
decipher.update(input)
var result = decipher.finish() // check 'result' for true/false
if (result) {
  fs.writeFileSync(decryptedFile, decipher.output.getBytes(), {
    encoding: 'binary',
  })
  console.log('Decrypted text is saved in ' + decryptedFile)
} else {
  console.log('file decryption error!!!')
}
