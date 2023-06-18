const forge = require('node-forge')
const rsa = forge.pki.rsa

let plaintext =
  'RSA test 한글 테스트 要推出大做出了回应 ポリコットント 新品未開封品 ماذا تريد؟'
let plaintextUtf8 = forge.util.encodeUtf8(plaintext)

// 1. 키생성
let keyPair = rsa.generateKeyPair({ bits: 2048 })
console.log('Key pair: ', keyPair)
let publicKey = keyPair.publicKey
let privateKey = keyPair.privateKey
// console.log('Public key: ', publicKey)
// console.log('Private key: ', privateKey)
console.log('Public key: \n', forge.pki.publicKeyToPem(publicKey))
console.log('Private key: \n', forge.pki.privateKeyToPem(privateKey))
// console.log('p=' + privateKey.p)
// console.log('q=' + privateKey.q)
// console.log('n=p*q=' + publicKey.n)
// console.log('e=' + publicKey.e)
// console.log('d=' + privateKey.d)

// 2. RSA 암호화
let encrypted = publicKey.encrypt(plaintextUtf8, 'RSA-OAEP', {
  md: forge.md.sha512.create(),
  mgf1: {
    md: forge.md.sha1.create(),
  },
})
console.log('암호문: ' + forge.util.bytesToHex(encrypted))

// 3. 복호화
let decrypted = privateKey.decrypt(encrypted, 'RSA-OAEP', {
  md: forge.md.sha512.create(),
  mgf1: {
    md: forge.md.sha1.create(),
  },
})
console.log('복호화 평문: ' + forge.util.decodeUtf8(decrypted))
