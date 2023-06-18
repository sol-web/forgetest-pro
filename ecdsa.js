const forge = require('node-forge')
const ed25519 = forge.pki.ed25519

let plaintext =
  'RSA test 한글 테스트 要推出大做出了回应 ポリコットント 新品未開封品 ماذا تريد؟'

// 1. 송신자 키생성
let keyPair = ed25519.generateKeyPair()
// console.log(keyPair)
let publicKey = keyPair.publicKey
let privateKey = keyPair.privateKey
console.log('Public Key: ', publicKey)
console.log('Private Key: ', privateKey)

// 2. 송신자 서명생성 - 송신자 개인키 이용
let md1 = forge.md.sha256.create()
md1.update(plaintext, 'utf8')
let signature1 = ed25519.sign({
  md: md1,
  privateKey: privateKey,
})
console.log('Signature1: ', forge.util.bytesToHex(signature1))

// 송신자->수신자: <plaintext, signature>

// 3. 수신자 서명검증 - 송신자 공개키 이용
let md2 = forge.md.sha256.create()
md2.update(plaintext, 'utf8')
let result1 = ed25519.verify({
  md: md2,
  signature: signature1,
  publicKey: publicKey,
})
console.log('Result1: ', result1)

// 2. 송신자 서명생성 - 송신자 개인키 이용
let md3 = forge.md.sha256.create()
md3.update(plaintext, 'utf8')
let signature3 = ed25519.sign({
  md: md3,
  privateKey: privateKey,
})
console.log('Signature3: ', forge.util.bytesToHex(signature3))

// 송신자->수신자: <plaintext, signature>

// 3. 수신자 서명검증 - 송신자 공개키 이용
let md4 = forge.md.sha256.create()
md4.update(plaintext, 'utf8')
let result4 = ed25519.verify({
  md: md4,
  signature: signature3,
  publicKey: publicKey,
})
console.log('Result4: ', result4)
