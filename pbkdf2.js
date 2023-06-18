const forge = require('node-forge')

let password = 'ghfkjhgkfdjshkdfjhgk'
let it = 1000000
let keySize = 32 // AES-128, AES-192, AES-256
let salt = forge.random.getBytesSync(16)
// 동기식 키생성
let derivedKey = forge.pkcs5.pbkdf2(password, salt, it, keySize)

console.log('password: ' + password)
console.log('salt: ' + forge.util.bytesToHex(salt))
console.log('key-sync: ' + forge.util.bytesToHex(derivedKey))

// 비동기식 키생성 함수
forge.pkcs5.pbkdf2(password, salt, it, 32, function (err, derivedKey) {
  if (derivedKey) console.log('key-async: ' + forge.util.bytesToHex(derivedKey))
})
