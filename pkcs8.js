var forge = require('node-forge')
var pki = forge.pki
var rsa = forge.pki.rsa

var keypair = rsa.generateKeyPair({ bits: 1024, e: 0x10001 })
var publicKey = keypair.publicKey
var privateKey = keypair.privateKey
var password = 'lkslkjdflkdjflkdhskhgkfj'

console.log('Public key: \n' + forge.pki.publicKeyToPem(publicKey))
console.log('Private key: \n' + forge.pki.privateKeyToPem(privateKey))

// 1. privateKey를 패스워드 암호화 저장
var pem = pki.encryptRsaPrivateKey(privateKey, password)
console.log('패스워드 암호화한 개인키: ' + pem)

// 2. 패스워드로 복호화한 개인키 복구
var privateKey1 = pki.decryptRsaPrivateKey(pem, password)
console.log(forge.pki.privateKeyToPem(privateKey1))
