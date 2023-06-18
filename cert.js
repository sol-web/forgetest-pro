// 인증기관이 사용자에게 인증서를 발급

const forge = require('node-forge')
const fs = require('fs')
const pki = forge.pki
const rsa = forge.pki.rsa
const user = 'userC'

// 1. 인증기관 설정: CA인증서와 개인키를 파일에서 읽어오기
const caCertPem = fs.readFileSync('rootCert.pem', 'utf8')
const caPrivateKeyPem = fs.readFileSync('rootprivateKey.pem', 'utf8')
const caCert = pki.certificateFromPem(caCertPem)
const caPrivateKey = pki.privateKeyFromPem(caPrivateKeyPem)
let resultCert = caCert.verify(caCert)
console.log('CA 인증서의 유효성 검증: ' + resultCert)

// 2. 사용자의 RSA 키쌍 생성
const keyPair = rsa.generateKeyPair(2048)
const privateKey = keyPair.privateKey
const publicKey = keyPair.publicKey

// 3. 사용자의 개인키를 파일로 저장
const privateKeyPem = pki.privateKeyToPem(privateKey)
fs.writeFileSync(user + 'PrivateKey.pem', privateKeyPem)

// 4. 사용자 인증서 객체 생성
const cert = pki.createCertificate()

// 5. 사용자 필드 정보 입력
cert.publicKey = publicKey
cert.serialNumber = '10001'
cert.validity.notBefore = new Date()
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 2)

// 사용자 정보
let attrs = [
  {
    name: 'commonName', // 사용자명
    shortName: 'CN',
    value: 'byoungcheon lee',
  },
  {
    name: 'countryName', // 국가명
    shortName: 'C',
    value: 'KR',
  },
  {
    name: 'stateOrProvinceName', // 주, 지역
    shortName: 'ST',
    value: 'Gyeonggi-do',
  },
  {
    name: 'localityName', // 도시명
    shortName: 'L',
    value: 'Goyang-si',
  },
  {
    name: 'organizationName', // 기관명
    shortName: 'O',
    value: 'Joongbu univ',
  },
  {
    name: 'organizationalUnitName', // 부서명
    shortName: 'OU',
    value: 'Information Security',
  },
]
cert.setSubject(attrs)

// 6. 발급자(인증기관) 정보 입력
let caAttrs = [
  {
    name: 'commonName', // 사용자명
    shortName: 'CN',
    value: caCert.subject.getField('CN').value,
  },
  {
    name: 'countryName', // 국가명
    shortName: 'C',
    value: caCert.subject.getField('C').value,
  },
  {
    name: 'stateOrProvinceName', // 주, 지역
    shortName: 'ST',
    value: caCert.subject.getField('ST').value,
  },
  {
    name: 'localityName', // 도시명
    shortName: 'L',
    value: caCert.subject.getField('L').value,
  },
  {
    name: 'organizationName', // 기관명
    shortName: 'O',
    value: caCert.subject.getField('O').value,
  },
  {
    name: 'organizationalUnitName', // 부서명
    shortName: 'OU',
    value: caCert.subject.getField('OU').value,
  },
]

cert.setIssuer(caAttrs)

// 7. 확장영역 정보
let exts = [
  {
    name: 'basicConstraints',
    cA: false, // 인증기관의 인증서임을 나타냄
  },
  {
    name: 'keyUsage', // 키용도 설정
    keyCertSign: true,
    digitalSignature: true,
    nonRepudiation: true,
    keyEncipherment: true,
    dataEncipherment: true,
  },
  {
    name: 'extKeyUsage', // 확장 키용도 설정
    serverAuth: true,
    clientAuth: true,
    codeSigning: true,
    emailProtection: true,
    timeStamping: true,
  },
  {
    name: 'nsCertType', // 인증서 타입
    client: true,
    server: true,
    email: true,
    objsign: true,
    sslCA: true,
    emailCA: true,
    objCA: true,
  },
  {
    name: 'subjectAltName', // 주체 별도 정보
    altNames: [
      {
        type: 6, // URI
        value: 'http://example.org/webid#me',
      },
      {
        type: 7, // IP
        ip: '127.0.0.1',
      },
    ],
  },
  {
    // 주체 키 식별자
    name: 'subjectKeyIdentifier',
  },
]
cert.setExtensions(exts)

// 8. 사용자의 인증서 객체를 CA의 개인키로 서명
cert.sign(caPrivateKey)

// 9. 사용자 인증서 객체를 PEM 형식으로 출력
let certPem = pki.certificateToPem(cert)
console.log('사용자 인증서: ' + certPem)

// 10. 사용자 인증서의 유효성 검증: 인증기관의 인증서를 이용
let resultUser = caCert.verify(cert)
console.log('사용자 인증서 유효성: ', resultUser)

// 11. 사용자 인증서를 파일로 저장하기
fs.writeFileSync(user + 'Cert.pem', pki.certificateToPem(cert))
console.log('사용자 인증서가 저장되었습니다: ' + user + 'Cert.pem')
