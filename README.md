# ⌨️ [Dechive](https://client-web-dechive.vercel.app/) 
 데스크 셋업에 관심이 있는 사람들의 정보를 공유하고 다른 인테리어, 몰랐던 장비들을 알게 되는 계기를 만들어 줄 수 있는 커뮤니티를 만드는 프로젝트입니다.
 <br/>
 사용자들은 자신의 책상 사진을 소개하고 구성한 장비들을 구입한 곳을 공유하고,
 팔로우와 팔로위 기능으로 사용자들을 연결하고 게시물에 좋아요를 남겨 취향에 맞는 셋업에 쉽게 접근할 수 있습니다.


<br/>

## 📆 프로젝트 기간

- 2023.04.10 - 2023.05.04

<br/>

## 🧱 아키택처
<p align="center" style="color:gray">
<img src="https://cdn.discordapp.com/attachments/1103877631629344821/1103922738629967912/8701efb5ec86ec85.png" />
</p>

- Node.js에서 Express 프레임 워크를 기반으로 IoC와 같은 기능을 포함하며 모듈, 컨트롤러, 서비스 등 기본적인 구조를 갖춘 Nest.js를 통해 개발 속도를 향상시키고 typescript를 통해 안정적인 개발이 가능.

- 각각의 서버를 동일한 환경에서 작업할 수 있게 Docker-Container를 사용.

- Graphql 통신을 통해 REST API의 over,under-vetching을 피하고 하나의 엔드 포인트로 다양한 데이터들 중 필요한 정보만 요청 가능.

- Redis를 통해 로그아웃시 토큰을 저장해 유저의 토큰을 만료시키고, 유튜브 API를 통해 받아온 데스크셋업 정보를 일정 기간에 한번 씩 초기화 할 수 있도록 사용.

- GCP의 내부의 SQL 데이터베이스를 통해 안정적인 데이터 보관과 백엔드와의 통신을 지향

<br/>

## 🏖 ERD

<p align="center" style="color:gray">
<img src="https://cdn.discordapp.com/attachments/1103877631629344821/1103877674901962833/4.png" width="800"/>
</p>
<br/>

## 🛠 기술 스택

### Environment
![Vscode](https://img.shields.io/badge/visualstudiocode-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)
![Git](https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white)
![Github](https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white)
<br>
![Eslint](https://img.shields.io/badge/Eslint-4B32C3?style=for-the-badge&logo=Eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=Prettier&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED.svg?style=for-the-badge&logo=Docker&logoColor=white)
<br>

### Developement
![TypeScript](https://img.shields.io/badge/typescript-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJs](https://img.shields.io/badge/nest.js-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Graphql](https://img.shields.io/badge/graphql-E10098.svg?style=for-the-badge&logo=graphql&logoColor=white)
<br>
![Mysql](https://img.shields.io/badge/MYSQL-4479A1?style=for-the-badge&logo=MYSQL&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![GoogleCloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
<br>


<br>

<br/>

## 🕹️ 주요 기능

1. 데스크 셋업을 공유하고 구성 장비를 소개
2. 이미지 업로드와 게시물, 댓글, 대댓글 기능제공 
3. 지금 유튜브에서 유행인 데스크 셋업을 소개
4. 유저간 팔로워, 팔로위 기능을 통해 본인취향의 셋업에 손쉽게 접근


<br/>

## 📖 라이브러리

| 이름                 | 설명                     |
| :-----------------: | :--------------------- | 
| typeorm             | Nest.js와 함께 사용하며 점유율이 가장 높고 데이터 매퍼 패턴을 지원하며 유지보수가 용이한 TypeORM을 사용 
| axios               | Fetch API와는 달리 요청및 응답객체를 직접작성하지 않고 매서드와 속성을 제공하여 코드가 간결해지고, Promise 처리과정에서 에러를 catch블록으로 던져주기에 자동으로 에러를 다룰수 있으므로 axios를 사용
| redis               | 클라이언트에서 동일한 요청이 계속 올때 서버에서 직접 데이터를 찾으면 상당히 비효율적이고 데이터의 크기에 따라 응답속도가 느려짐. 이때 요청결과를 미리 저장해 두었다가, 동일한 데이터 요청이 오면 바로 전달할 수 있도록 redis를 사용
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
