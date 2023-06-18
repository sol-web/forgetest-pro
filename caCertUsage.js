const fs = require('fs')
const { pki } = require('node-forge')

// 비동기식 읽어오기
// fs.readFile('rootCert.pem', 'utf8', function (err, data) {
//   if (err) {
//     return console.log(err)
//   }
//   console.log(data)
//   let caCert = pki.certificateFromPem(data)
//   let publicKey = caCert.publicKey
//   console.log(publicKey)
// })

// 동기식 읽어오기
let caCertPem = fs.readFileSync('rootCert.pem', 'utf8')
console.log(caCertPem)
let caCert = pki.certificateFromPem(caCertPem)
let publicKey = caCert.publicKey

let privateKeyPem = fs.readFileSync('rootPrivateKey.pem', 'utf8')
let privateKey = pki.privateKeyFromPem(privateKeyPem)

let publicKeyPem = fs.readFileSync('rootPublicKey.pem', 'utf8')
let publicKey1 = pki.publicKeyFromPem(publicKeyPem)

// 개인키에서 공개키 추출하기
let publicKey2 = pki.setRsaPublicKey(privateKey.n, privateKey.e)
console.log(publicKey2)
