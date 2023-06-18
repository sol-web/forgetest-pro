const jwt = require('jsonwebtoken')
const forge = require('node-forge')

const pki = forge.pki
const rsa = forge.pki.rsa

// 1. 키쌍 생성
const keypair = rsa.generateKeyPair({ bits: 2048 })
const publicKey = keypair.publicKey
const privateKey = keypair.privateKey
const publicKeyPem = pki.publicKeyToPem(publicKey)
const privateKeyPem = pki.privateKeyToPem(privateKey)
console.log(publicKeyPem)
console.log(privateKeyPem)

// 2. 토큰 발급
const jsonData = {
  name: 'bclee',
  id: '47934794385',
  sosok: 'jfhsfdgjhf',
  univ: 'joongbu',
}
const option = {
  algorithm: 'PS512', // RS256, RS384, RS512, PS256, PS384, PS512
  expiresIn: '1y', // 유효기간
  audience: 'joobgbu univ', // 청중, 토큰을 사용하는 대상
  issuer: 'jbu', // 발급자
  subject: 'bclee', // 사용자명
}
let token = jwt.sign(jsonData, privateKeyPem, option)
console.log('1. 토큰 발급: ' + token)

// 3. 토큰 검증
jwt.verify(token, publicKeyPem, function (err, result) {
  if (err) {
    console.error(err)
  } else {
    console.log(result)
  }
})

// 4. 페이로드 출력
let decoded = jwt.decode(token)
console.log(decoded)
