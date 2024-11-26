# BRISQUE 알고리즘을 이용한 이미지 품질 측정 웹사이트
#### 21101926 김소은

## 웹사이트 소개 
### 아키텍쳐 

### 기능 설명 
### 시현

## 환경 설정 
### FE 환경 설정 
React.js 환경 
package.json 활용하여 패키지 설치 필요 


### BE 환경 설정 
Spring Boot 환경 
build.gradle 활용하여 패키지 설치 필요 

application.properties 생성 필요 
위치 : BE > src > main > resources > application.properties 
1. MySQL 데이터베이스와 연결 설정 필요
2. AWS S3와 연결 필요 - IAM User accessKey, secrestKey
3. Oauth2 인증을 위한 naver, kakao 설정 필요


### 기타 환경 설정 
AWS 계정 생성 후 S3 bucket 생성(imgcloud-iise 다른 이름으로 생성할 시 코드 수정 필요) > person, thing 이라는 두 가지 하위 폴더 생성 필요 


## 활용한 오픈 소스 
### 대표적 오픈 소스 : openCV, Spring boot, React (이외에 사용한 모든 소스는 build.gradle, package.json에 기술되어 있음)  
