# ⌨️ [Dechive](https://client-web-dechive.vercel.app/) 



<br/>

## 📆 프로젝트 기간

- 2023.04.10 - 2023.05.04

<br/>

## 🧱 아키택처


- 백엔드는 NestJs 서버를 구성.

- 대규모 서비스를 생각를 해서 MSA 방식을 채택.(독립적으로 개발과, 운용이 가능하고, 의존성이 낮아진다.)

- Nginx를 통해서 Api-GateWat를 만들어서 proxy_pass를 통해 MSA방식을 구축했다.

- 각각의 서버를 Docker-Container를 사용함으로써, 동일한 환경에서 작업할 수 있게 사용했다.

- Container 관리툴인 Kubernetes, ECS, Dokcer Swarm 중, Docker Swarm 를 채택했다.

- Kubernetes는 대규모 서비스에서 더 적합하고, 다루기가 어렵다, ECS(비용 문제)

- Dokcer Swarm은 소규모 서비스에 더 적합하고, CLI를 통해 간단하게 배포가 가능해 진다. -> Kubernetes 보다는 적은 기능을 가지고 있다.

- Github Action을 통해서 Image Build를 하고 VM SSH로 접속후 Docker Swarm Rolling 배포를 선택했다.

- Graphql, RestAPI 통신을 통해, 데이터의 효율성을 생각해 RestAPI <-> MongoDB(mongoose), Graphql <-> MySQL(TypeOrm)을 선택.

- Graphql은 원하는 정보만 받을 수 있기때문에 MySQL과 연결 해서 사용한다. -> 데이터의 전송량이 줄어들어 불필요한 데이터를 전송하지 않는다.

- RestAPI은 모든 정보를 다받기 때문에 데이터를 처리하는데 있어 빠른 MongoDB와 연결해서 사용했다.

- Redis를 통해 일회용성 데이터, 로그아웃시 토큰을 저장해 로그아웃 한 유저는 사용을 제한 하는 용도로 사용

<br/>

## 🏖 ERD

<img src="https://cdn.discordapp.com/attachments/1065225648563560500/1103718982038585404/4.png" width="1000"/>

<br/>

## 🛠 기술 스택

![TypeScript](https://img.shields.io/badge/typescript-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJs](https://img.shields.io/badge/nest.js-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Graphql](https://img.shields.io/badge/graphql-E10098.svg?style=for-the-badge&logo=graphql&logoColor=white)
<br>
![Eslint](https://img.shields.io/badge/Eslint-4B32C3?style=for-the-badge&logo=Eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=Prettier&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED.svg?style=for-the-badge&logo=Docker&logoColor=white)
<br>
![Mysql](https://img.shields.io/badge/MYSQL-4479A1?style=for-the-badge&logo=MYSQL&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![GoogleCloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
<br>


<br>

<br/>

## 🕹️ 주요 기능

1. 데스크 셋업을 공유하고 구성 장비를 소개
2. 지금 유튜브에서 유행인 데스크 셋업을 소개
3. 유저간 팔로워, 팔로위 기능을 제공



<br/>

## 📖 라이브러리

| 이름                 | 설명                     |
| :-----------------: | :--------------------- | 
| typeorm             | 
| axios               | 
| redis               | 
| bcrypt              | 해시 함수들은 무결성 검사를 위해 빠른 속도가 필요하지만, 해커가 DB를 탈취 했을때 빠른 속도로 비밀번호를 알아낼 수 있음. 패스워드 저장에서의 해시 함수의 문제점을 보완해서 나온것이 pbkfd2. 8글자 부터는 동일 시스템에서 bcrypt가 pbkfd2보다 4배 이상의 시간을 소모해야 비밀번호를 알아낼 수 있기 때문에 보안성을 위해 사용
| passport            | passport는 express 프레임워크 상에서 사용되는 인증 미들웨어 라이브러리. strategies로 알려져 있는 인증 메커니즘을 각 모듈로 패키지화해서 제공. 즉, 앱은 passport에서 지원하는 전략을 선택해 의존성 없이 독립적으로 이용 가능함
| nodemailer          | 이메일 인증을 위해서 이메일 전송에 필요한 네트워크 프로토콜인 SMTP(우편 전송 프로토콜)을 사용해야 함. Node.js SMTP기반으로 개발된 전용 모듈인 nodemailer는 사용법이 매우 간단하여 사용하게 됨
| eslint              | 코드를 분석해 문법적인 오류를 찾아주거나 프로젝트 내에서 일관된 코드 스타일을 유지하기 위해 사용. 프로젝트에는 Airbnb의 코딩 컨벤션을 적용.


<br/>

## ✍ 커밋 메세지 규칙

- Feat : 새로운 기능 추가
- Fix : 버그 수정
- Style : 코드 양식 변경
- Refactor : 코드 리팩토링
- Test : 테스트 코드 수정
- Docs : 문서 수정

<br/>

## 🔥 트러블 슈팅

<br/>

## 🧑‍💻 팀 구성
<table>
   <tr>
     <td colspan='2' align="center">
       <b>Backend</b>
     </td>
   </tr>
   <tr>
    <td align="center"><b><a href="https://github.com/sounwoo">sounwoo</a></b></td>
    <td align="center"><b><a href="https://github.com/KyuwonKwon ">KyuwonKwon</a></b></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/sounwoo"><img src="https://avatars.githubusercontent.com/u/105111888?v=4" width="80px" /></a>
    <td align="center"><a href="https://github.com/KyuwonKwon"><img src="https://avatars.githubusercontent.com/u/60686304?v=4" width="80px" /></a></td>
  </tr>
</table>

<table>
   <tr>
     <td colspan='4' align="center">
       <b>Frontend</b>
     </td>
   </tr>
   <tr>
    <td align="center"><b><a href="https://github.com/osdoonhyun">osdoonhyun</a></b></td>
    <td align="center"><b><a href="https://github.com/applepykim">applepykim</a></b></td>
    <td align="center"><b><a href="https://github.com/jinShine">jinShine</a></b></td>
    <td align="center"><b><a href="https://github.com/yrk721">yrk721</a></b></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/osdoonhyun"><img src="https://avatars.githubusercontent.com/u/87527736?v=4" width="80px" /></a></td>
    <td align="center"><a href="https://github.com/applepykim"><img src="https://avatars.githubusercontent.com/u/69972768?v=4" width="80px" /></a></td>
    <td align="center"><a href="https://github.com/jinShine"><img src="https://avatars.githubusercontent.com/u/18066329?v=4" width="80px" /></a>
    <td align="center"><a href="https://github.com/yrk721"><img src="https://avatars.githubusercontent.com/u/114637091?v=4" width="80px" /></a>
  </tr>
</table>
