# **이미지 품질 측정 웹사이트**  
#### **21101926 김소은**

---

## 🌟 **웹사이트 소개**  
이 웹사이트는 **BRISQUE 알고리즘**을 활용하여 이미지 품질을 분석하고, 다양한 이미지 편집 및 정보 제공 기능을 지원합니다.
### 📄 **페이지 설명**

---

#### 🌟 **메인 페이지와 이미지 업로드 페이지**

<table align="center">
  <tr>
    <td align="center">
      <img src="image/mainPage.png" alt="main page" width="400"/>
      <br/><b>메인 페이지</b>
    </td>
    <td align="center">
      <img src="image/ImageUploadPage.png" alt="image upload page" width="400"/>
      <br/><b>이미지 업로드 페이지</b>
    </td>
  </tr>
</table>

---

#### ✂️ **이미지 크롭 페이지와 스토리지 페이지**

<table align="center">
  <tr>
    <td align="center">
      <img src="image/cropPage.png" alt="crop page" width="400"/>
      <br/><b>이미지 크롭 페이지</b>
    </td>
    <td align="center">
      <img src="image/StoragePage.png" alt="storage page" width="400"/>
      <br/><b>스토리지 페이지</b>
    </td>
  </tr>
</table>

---

#### 🔍 **상세 페이지와 기능 설명 페이지**

<table align="center">
  <tr>
    <td align="center">
      <img src="image/detailPage.png" alt="detail page" width="400"/>
      <br/><b>상세 페이지</b>
    </td>
    <td align="center">
      <img src="image/functionExplain.png" alt="function explain page" width="400"/>
      <br/><b>기능 사용법 설명 페이지</b>
    </td>
  </tr>
</table>


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
   
---

## ✨ **점수 측정 예시**

<table align="center" style="border-collapse: collapse; width: 100%;">
  <tr>
    <td style="text-align: center; width: 40%;">
      <img src="image/scores.jpg" alt="점수 측정 예시" width="300" style="border-radius: 10px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);"/>
    </td>
    <td style="vertical-align: middle; padding-left: 20px; text-align: left; font-size: 16px; line-height: 1.6;">
      <p>
        위 이미지는 <b>imgCloud</b>를 이용하여 측정한 품질 점수를 보여주고 있습니다.  
        <b>BRISQUE 알고리즘</b>을 사용하여 인간의 눈으로 보기에 가장 잘 나왔다고 판단되는 사진에 높은 점수를 부여합니다.
      </p>
    </td>
  </tr>
</table>

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
- 아래의 **`application.properties`** 파일 설정 필요  
  **위치:** `backend > src > main > resources > application.properties`  

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
 
- **OAuth를 위한 Naver, Kakao 인증 설정**
  1. https://developers.kakao.com/ 에서 Kakao 설정 가능
  2. https://developers.naver.com/main/ 에서 Naver 설정 가능 

---

## ▶️ **실행 방법**  
### **프론트엔드 실행**  
```bash
npm run start
```

### **백엔드 실행**  
`ImgcloudApplication.java` 파일을 실행합니다.  

---

## 📂 **활용한 오픈 소스, 라이브러리 및 기술 스택**  

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

#### 🔍 OpenCV (Open Source Computer Vision Library)</span>

OpenCV는 컴퓨터 비전과 이미지 처리 기능을 제공하는 오픈 소스 라이브러리입니다.  
이미지 품질 분석, 얼굴 인식, 객체 추적 등 다양한 기능을 지원하며, **BRISQUE 알고리즘**을 통해 이미지 품질 평가를 수행합니다.  
Spring Boot와 OpenCV를 연동하여 강력한 이미지 프로세싱 기능을 구현합니다.

#### 📊 **Apache Commons Math**  
Apache Commons Math는 Java 애플리케이션에서 수학적 계산과 통계 처리를 지원하는 강력한 라이브러리입니다.  
특히, 이미지 품질 분석의 통계적 처리와 모델링에 필요한 수학적 연산을 간단하게 수행할 수 있습니다.

---

### 📁 **추가적인 주요 라이브러리**
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

