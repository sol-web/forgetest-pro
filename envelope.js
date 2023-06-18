const forge = require('node-forge')
const fs = require('fs')
const pki = forge.pki

const userA = 'userA' // 송신자
const userB = 'userB' // 수신자

// 1. 송신자가 전자봉투 생성

// 1.1 송신자 A의 개인키를 읽어옴
const userAPrivateKeyPem = fs.readFileSync('userAPrivateKey.pem', 'utf8')
const userAPrivateKey = pki.privateKeyFromPem(userAPrivateKeyPem)

// 1.2 수신자 B의 인증서를 읽어옴
const userBCertPem = fs.readFileSync('userBCert.pem', 'utf8')
const userBCert = pki.certificateFromPem(userBCertPem)
const userBPublicKey = userBCert.publicKey

// 1.3 인증기관의 인증서 읽어옴
const caCertPem = fs.readFileSync('rootCert.pem', 'utf8')
const caCert = pki.certificateFromPem(caCertPem)

// 1.4 수신자 B의 인증서의 유효성 검증
let verifiedB = caCert.verify(userBCert)
console.log('1.4 수신자 B의 인증서 유효성 검증: ', verifiedB)

// 1.5 송신자 A가 메시지에 대한 전자서명 생성
let message = 'Hello world. 안녕하세요...'
let md = forge.md.sha1.create()
md.update(message, 'utf8')
let signature = userAPrivateKey.sign(md)
let signatureHex = forge.util.bytesToHex(signature)
let signedMessageObject = {
  msg: message,
  sigHex: signatureHex,
}
let signedMessageString = JSON.stringify(signedMessageObject)
console.log('1.5 signedMessageString: ', signedMessageString)

// 1.6 송신자 A가 세션키로 signedMessageString을 암호화
let keySize = 32
let ivSize = 16
let key = forge.random.getBytesSync(keySize)
let iv = forge.random.getBytesSync(ivSize)

let someBytes = forge.util.encodeUtf8(signedMessageString)
let cipher = forge.cipher.createCipher('AES-CBC', key)
cipher.start({ iv: iv })
cipher.update(forge.util.createBuffer(someBytes))
cipher.finish()
let encrypted = cipher.output
let encryptedHex = forge.util.bytesToHex(encrypted)
console.log('1.6 암호문 encryptedHex: ', encryptedHex)

// 1.7 세션키를 수신자 B의 공개키로 암호화
let keyObject = {
  key: forge.util.bytesToHex(key),
  iv: forge.util.bytesToHex(iv),
}
let keyString = JSON.stringify(keyObject)
console.log('1.7 keyString: ', keyString)
let encryptedSessionKey = userBPublicKey.encrypt(keyString, 'RSA-OAEP') // ****
let encryptedSessionKeyHex = forge.util.bytesToHex(encryptedSessionKey)
console.log('1.7 encryptedSessionKeyHex: ', encryptedSessionKeyHex)

// 송신자가 수신자에게 전송: <encryptedHex, encryptedSessionKeyHex>
// encryptedHex: 세션키로 암호화한 서명된 메시지
// encryptedSessionKeyHex: 수신자의 공개키로 암호화한 세션키

// 2. 수신자 B가 전자봉투 열기

// 2.1 수신자 B의 개인키 읽어옴
const userBPrivateKeyPem = fs.readFileSync('userBPrivateKey.pem', 'utf8')
const userBPrivateKey = pki.privateKeyFromPem(userBPrivateKeyPem)

// 2.2 송신자 A의 인증서 읽어옴
const userACertPem = fs.readFileSync('userACert.pem', 'utf8')
const userACert = pki.certificateFromPem(userACertPem)

// 2.3 인증기관의 인증서 읽어옴
const caCertPem1 = fs.readFileSync('rootCert.pem', 'utf8')
const caCert1 = pki.certificateFromPem(caCertPem1)

// 2.4 송신자 A의 인증서 유효성 검증
let verifiedA = caCert1.verify(userACert)
console.log('2.4 송신자 A의 인증서 검증: ' + verifiedA)

// 2.5 세션키를 복구
let encryptedSessionKey1 = forge.util.hexToBytes(encryptedSessionKeyHex)
let decryptedkeyString = userBPrivateKey.decrypt(
  encryptedSessionKey1,
  'RSA-OAEP'
)
let keyString1 = decryptedkeyString
let keyObject1 = JSON.parse(keyString1)
let key1 = forge.util.hexToBytes(keyObject1.key)
let iv1 = forge.util.hexToBytes(keyObject1.iv)

// 2.6 세션키로 메시지 복호화
let encrypted1 = forge.util.hexToBytes(encryptedHex)
let decipher = forge.cipher.createDecipher('AES-CBC', key1)
decipher.start({ iv: iv1 })
decipher.update(forge.util.createBuffer(encrypted1))
let result = decipher.finish()
console.log('2.6 result: ', result)
let messageString1 = decipher.output
console.log('messageString1: ', messageString1.toString())
let messageObject1 = JSON.parse(messageString1.toString())
let message1 = messageObject1.msg
let signatureHex1 = messageObject1.sigHex
let signature1 = forge.util.hexToBytes(signatureHex1)

// 2.7 전자서명 검증
let userAPublicKey = userACert.publicKey
let md1 = forge.md.sha1.create()
md1.update(message1, 'utf8')
let verified = userAPublicKey.verify(md1.digest().bytes(), signature1)
console.log('2.7 서명의 유효성 검증: ', verified)
