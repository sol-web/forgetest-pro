const forge = require('node-forge')
const rsa = forge.pki.rsa

// 1. RSA 키생성 - 수신자
let keyPair = rsa.generateKeyPair({ bits: 2048 })
let publicKey = keyPair.publicKey
let privateKey = keyPair.privateKey
console.log('Public key: \n', forge.pki.publicKeyToPem(publicKey))
console.log('Private key: \n', forge.pki.privateKeyToPem(privateKey))

// 2. 송신자 키 캡슐화
var kdf1 = new forge.kem.kdf1(forge.md.sha1.create()) // 키생성
var kem = forge.kem.rsa.create(kdf1)
let result = kem.encrypt(publicKey, 32)
// result.encapsulation: 수신자의 공개키로 암호화한 대칭키
// result.key: 대칭키

// 3. 송신자 대칭키 암호화
var iv = forge.random.getBytesSync(12)
var plaintext = 'hello world! 한글메시지'
var someBytes = forge.util.encodeUtf8(plaintext)
var cipher = forge.cipher.createCipher('AES-GCM', result.key)
cipher.start({ iv: iv })
cipher.update(forge.util.createBuffer(someBytes))
cipher.finish()
var encrypted = cipher.output.getBytes()
var tag = cipher.mode.tag.getBytes()

console.log('Plaintext: ' + someBytes)
console.log('Key: ' + forge.util.bytesToHex(result.key))
console.log()
console.log('Ciphertext: ' + forge.util.bytesToHex(encrypted))
console.log('IV: ' + forge.util.bytesToHex(iv))
console.log('Tag: ' + forge.util.bytesToHex(tag))
console.log('Encapsulation: ' + forge.util.bytesToHex(result.encapsulation))
console.log('<Ciphertext, IV, Tag, Encapsulation>을 수신자에게 전송')
console.log()

// 4. 수신자의 키 복구
var kdf1 = new forge.kem.kdf1(forge.md.sha1.create())
var kem = forge.kem.rsa.create(kdf1)
// 캡슐화된 키로부터 개인키로 복호화하여 대칭키 복구
var key = kem.decrypt(privateKey, result.encapsulation, 32)
console.log('Key: ' + forge.util.bytesToHex(key))

// 5. 수신자 대칭키 복호화
var decipher = forge.cipher.createDecipher('AES-GCM', key)
decipher.start({ iv: iv, tag: tag })
decipher.update(forge.util.createBuffer(encrypted))
var pass = decipher.finish()
// pass is false if there was a failure (eg: authentication tag didn't match)
if (pass) {
  // outputs 'hello world!'
  console.log(
    'Deciphered: ' + forge.util.decodeUtf8(decipher.output.getBytes())
  )
}
