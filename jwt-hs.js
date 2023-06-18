const jwt = require('jsonwebtoken')

const jsonData = {
  name: 'bclee',
  id: '47934794385',
  sosok: 'jfhsfdgjhf',
  univ: 'joongbu',
}
const masterKey = 'fjhgdfkshlks;asdkjjsldkjfjlksd'

// 1. 토큰 발급
let token = jwt.sign(jsonData, masterKey, {
  algorithm: 'HS512', // HS256, HS384, HS512
  expiresIn: '1y', // 유효기간
  audience: 'joobgbu univ', // 청중, 토큰을 사용하는 대상
  issuer: 'jbu', // 발급자
  subject: 'bclee', // 사용자명
})
console.log('1.토큰발급: ' + token) // 브라우저에게 전송. 브라우저에 저장
let token1 = token + '1'

// 2. 토큰 검증
let result = jwt.verify(token, masterKey)
console.log('2. 토큰 검증: ' + result.name)

// 3. 에러 처리 포함한 토큰 검증
// try {
//   let result = jwt.verify(token1, masterKey)
//   console.log('3. 토큰 검증: ' + result.name)
// } catch (error) {
//   console.error(error)
// }

// 4. 페이로드 내용 보기
let decoded = jwt.decode(token)
console.log('4. 페이로드 보기: ' + decoded.name)
