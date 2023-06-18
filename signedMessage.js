var forge = require('node-forge')
var fs = require('fs')
var pki = forge.pki
var userA = 'userA' // 사용자명 설정 (송신자 userA)
var userB = 'userB' // 사용자명 설정 (수신자 userB)

// 1. 송신자 A가 수신자 B에게 서명된 메시지 전송
// 1.1 송신자 A의 개인키 읽어옴
var userAPrivateKeyPem = fs.readFileSync('userAPrivateKey.pem', 'utf8')
var userAPrivateKey = pki.privateKeyFromPem(userAPrivateKeyPem)
// 1.2 송신자 A: 메시지와 전자서명 생성
var message = 'Hello world. 안녕하세요.'
var md = forge.md.sha1.create()
md.update(message, 'utf8')
var signature = userAPrivateKey.sign(md)
// 1.3 <메시지, 전자서명>을 수신자 B에게 전송
console.log('송신자 A측')
console.log('Message: ' + message)
console.log('Signature: ' + forge.util.bytesToHex(signature))

// 2. 수신자 B의 서명 검증
// 2.1 송신자 A로부터 <메시지, 전자서명>을 수신
console.log('수신자 B측')
// 2.2 송신자 A의 인증서 읽어옴
var userACertPem = fs.readFileSync('userACert.pem', 'utf8')
var userACert = pki.certificateFromPem(userACertPem)
// 2.3 인증기관의 인증서 읽어옴
var caCertPem = fs.readFileSync('rootCert.pem', 'utf8')
var caCert = pki.certificateFromPem(caCertPem)
// 2.4 송신자 A의 인증서 유효성 검증
var verified = caCert.verify(userACert)
console.log('송신자 A의 인증서 검증: ' + verified)
// 2.5 전자서명 검증
var userAPublicKey = userACert.publicKey
var md = forge.md.sha1.create()
md.update(message, 'utf8')
var verified = userAPublicKey.verify(md.digest().bytes(), signature)
console.log('서명의 유효성 검증: ' + verified)
