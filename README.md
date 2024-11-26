# **이미지 품질 측정 웹사이트**  
#### **21101926 김소은**

---

## 🌟 **웹사이트 소개**  
이 웹사이트는 **BRISQUE 알고리즘**을 활용하여 이미지 품질을 분석하고, 다양한 이미지 편집 및 정보 제공 기능을 지원합니다.
### 📄 **페이지 설명**  


---

## 🛠️ **지원 기능**  
1. **이미지 품질 측정**  
   - 전체 이미지에 대한 품질 분석  
   - 선택한 특정 영역에 대한 품질 분석  
2. **이미지 메타데이터 제공**  
   - ISO, White Balance, F-stop, GPS 등 메타데이터 제공  
3. **이미지 편집 기능**  
   - 이미지 압축 및 파일 포맷 변경  
   - 해상도 측정 및 노이즈 제거  
4. **로컬로 이미지 다운로드**
   - 다운로드 시 압축하여 다운 가능
   - 
---

## 🚀 **주요 기능 사용 방법**  


---

## ⚙️ **환경 설정**  

### 📌 **프론트엔드 (Frontend) 환경 설정**  
- **React.js** 사용  
- `package.json`을 사용하여 패키지를 설치해야 합니다.
  
  ```bash
  npm install
  ```

### 📌 **백엔드 (Backend) 환경 설정**  
- **Spring Boot** 사용  
- `build.gradle`에 의존성 정의  
- 아래의 **`application.properties`** 파일 설정 필요  
  **위치:** `BE > src > main > resources > application.properties`  

#### 🔑 **application.properties**  
```application.properties
# MySQL 데이터베이스 연결
spring.application.name=<YOUR_DB_SCHEME>
spring.datasource.url=jdbc:mysql://<YOUR_DB_HOST>:3306/<YOUR_DB_NAME>
spring.datasource.username=<YOUR_DB_USER>
spring.datasource.password=<YOUR_DB_PASSWORD>
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
Spring.jpa.hibernate.format.sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
logging.level.org.hibernate.orm.jdbc.bind=TRACE
logging.level.org.springframework=INFO

# AWS S3 연결
cloud.aws.credentials.access-key=<YOUR_AWS_ACCESS_KEY>
cloud.aws.credentials.secret-key=<YOUR_AWS_SECRET_KEY>
cloud.aws.region.static=ap-northeast-2
cloud.aws.stack.auto=false

#security oauth -> kakao
oauth.kakao.client-id=<YOUR_KAKAO_CLIENT_ID>
oauth.kakao.client-secret=<YOUR_KAKAO_CLIENT_SECRET>
oauth.kakao.redirect-uri=http://localhost:3000/oauth/redirected/kakao
oauth.kakao.authorization-grant-type=authorization_code
oauth.kakao.scope=profile_nickname,profile_image,account_email
oauth.kakao.client-name=kakao
oauth.kakao.client-authentication-method=POST

#security oauth -> naver
oauth.naver.client-id=<YOUR_NAVER_CLIENT_ID>
oauth.naver.client-secret=<YOUR_NAVER_CLIENT_SECRET>
oauth.naver.redirect-uri=http://localhost:3000/oauth/redirected/naver
oauth.naver.scope=nickname,profile_image,email
oauth.naver.authorization-grant-type=authorization_code
oauth.naver.client-name=naver
oauth.naver.state=<YOUR_NAVER_STATE>

#bean
spring.main.allow-bean-definition-overriding=true

#file size
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=100MB
spring.servlet.multipart.enabled=true
```


### 📌 **기타 환경 설정**  
- **AWS S3 Bucket 설정**  
  1. AWS 계정을 생성한 후, S3 버킷을 만드세요.  
  2. 버킷 이름은 기본적으로 `imgcloud-iise`를 사용을 권장, 다른 이름으로 생성 시 코드 수정 필요합니다.  
  3. 버킷 안에 **`person`** 및 **`thing`** 폴더를 생성하세요.
 
- **AWS 권한 설정**
  1. IAM User 생성하여 aws.access.key, aws.secret.key 저장하기 (secret key의 경우 페이지 벗어나면 다시 확인 불가능하므로 꼭 저장해두기!)
  2. S3에 대한 권한 부여 필요 (본인의 보안 유지 필요성에 따라 다르게 설정 -> 로컬에서 테스트 용이라면 full access 및 외부 접근 허용 설정 해두기)

---

## ▶️ **실행 방법**  
### **프론트엔드 실행**  
```bash
npm run start
```

### **백엔드 실행**  
`ImgcloudApplication.java` 파일을 실행합니다.  

---

## 📂 **활용한 오픈 소스 및 기술 스택**  

### 🖥️ **Frontend**  
- **React.js**: UI 컴포넌트를 효율적으로 구성하기 위한 라이브러리  
- **Bootstrap**: 반응형 디자인을 지원하는 CSS 프레임워크  
- **Flaticon**: 다양한 아이콘 리소스를 제공하는 플랫폼  
- **browser-image-compression**: 브라우저 환경에서 이미지 압축을 수행하기 위한 라이브러리  
- **react-image-crop** & **react-cropper**: React에서 이미지 크롭 및 편집을 지원하는 라이브러리  

---

### 🛠️ **Backend**  
- **Spring Boot**: RESTful API와 서버 관리에 사용되는 Java 기반 프레임워크  
- **MySQL**: 데이터베이스 관리 및 저장소  
- **AWS SDK**: S3를 활용한 파일 업로드 및 저장 관리  
- **OpenCV**: 이미지 품질 분석 및 프로세싱 기능  
- **Apache Commons Math**: 수학 계산 및 통계 라이브러리  
- **Lombok**: 코드를 간결하게 작성하기 위한 Java 라이브러리  
- **Javacv-Platform**: OpenCV와 연동되는 Java 래퍼 라이브러리  

---

### 📁 **추가적인 라이브러리**
- **Retrofit**: HTTP 통신을 간편하게 처리할 수 있는 라이브러리  
- **Gson**: JSON 데이터 직렬화/역직렬화를 지원하는 라이브러리  
- **OkHttp**: HTTP 요청 및 응답을 처리하기 위한 라이브러리  
- **Iamport Rest Client**: 결제 처리를 위한 라이브러리  
- **JSZip**: ZIP 파일 생성 및 압축 해제 기능 제공  
- **FileSaver.js**: 파일 다운로드를 지원하는 브라우저 라이브러리  


---

## 🔄 **환경 설정의 복잡함으로 인해 평가가 어렵다면!!**   
- 로컬 환경에서 구동되는 시연 영상 보내드릴 수 있습니다.
- 직접 방문하여 제 노트북에서 실행됨을 보여드릴 수 있습니다.

