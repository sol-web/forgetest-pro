const forge = require('node-forge')

// 0. 송신자
let plaintext = 'hello world.111122'

let key = forge.random.getBytesSync(8) // AES-128 => 16, AES-192 => 24, AES-256 => 32
let iv1 = forge.random.getBytesSync(8) // 128-bit block size => 16
console.log('Plaintext: ' + plaintext)
console.log('Key: ' + forge.util.bytesToHex(key))
console.log('IV: ' + forge.util.bytesToHex(iv1))

// 1. 송신자 암호화
let cipher = forge.cipher.createCipher('DES-CBC', key)
cipher.start({ iv: iv1 })
cipher.update(forge.util.createBuffer(plaintext, 'utf8'))
cipher.finish()
let encrypted = cipher.output
console.log('Ciphertext: ' + encrypted.toHex())

// 송신자 --> 수신자 : { iv1, encrypted }
let sendMessage = {
  iv: iv1,
  ciphertext: encrypted,
}
let sendMessageString = JSON.stringify(sendMessage)
console.log(sendMessageString)
// key는 공개키암호화하여 전송

// 2. 수신자 복호화
let decipher = forge.cipher.createDecipher('DES-CBC', key)
decipher.start({ iv: iv1 })
decipher.update(encrypted)
let result = decipher.finish()
console.log('Result: ' + result)
console.log('Decrypted: ' + decipher.output)
