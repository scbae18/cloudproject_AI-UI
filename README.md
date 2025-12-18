# UI&AI — AI 기반 UI 자동 평가 플랫폼 (Frontend Demo)

UI&AI는 **UI 디자인 이미지를 업로드하면 히트맵(시선/클릭 집중)과 개선 피드백을 자동으로 제공하는 UI 평가 플랫폼**입니다.
이 레포는 **프론트엔드 데모**로, 실제 서비스 흐름을 최대한 현실적으로 재현했습니다.

* 업로드 → 템플릿 선택 → 평가 실행 → 결과 확인 → 피드백 저장

---

## 주요 기능

### 1) 랜딩

* 서비스 소개 / 기능 요약 / 샘플 결과 카드

### 2) 로그인/회원가입 (데모)

* 로그인 / 회원가입 플로우 제공
* 세션은 localStorage에 저장

### 3) 프로젝트

* My Projects: 내 프로젝트 요약/상태
* All Projects: 전체 프로젝트 리스트 (진행중/평가완료 표시)

### 4) 업로드 & 평가 실행

* 프로젝트 생성
* UI 이미지 업로드 (PNG/JPG)
* 평가 기준 템플릿 선택 또는 생성
* Drag & Drop 업로드
* 평가 실행 시 **로딩 모달(약 3초)** 표시 후 결과 화면 이동

### 5) 결과 화면 (메인 기능)

* KPI(Clarity / Hierarchy / Readability) 점수
* AI 피드백 카드 요약
* 더미 히트맵 오버레이
* Next Steps 체크리스트
* 요약 복사 / 피드백 저장

### 6) My Page

* 프로필
* 저장한 피드백 목록
* 템플릿 요약

### 7) Settings

* 라이트/다크 모드
* Reduce Motion
* 로컬 데이터 Export(JSON)
* 로컬 데이터 초기화(Reset)

---

## 기술 스택

* React (CRA)
* React Router
* Custom CSS (`global.css`)
* mockApi + localStorage (데모 데이터 레이어)

---

## 프로젝트 구조

src/

* pages/

  * Landing.jsx
  * Auth.jsx
  * MyProjects.jsx
  * AllProjects.jsx
  * Upload.jsx
  * Result.jsx
  * MyPage.jsx
  * Settings.jsx
  * NotFound.jsx
* components/

  * TopNav.jsx
  * Card.jsx
  * PrimaryButton.jsx
  * LoadingModal.jsx
* lib/

  * mockApi.js
  * storage.js
* data/

  * mockDb.js
* styles/

  * global.css

---

## 데이터 저장 방식 (중요)

* 서버/DB 없음
* 모든 데이터는 localStorage에 저장
* `mockApi.js`가 “백엔드처럼” 동작
* Reset Local Data를 누르면 로컬 데이터가 초기화됩니다.

---

## 실행 방법

1. 설치

* `npm install`

2. 실행

* `npm start`

---

## 사용 흐름 (권장)

1. 시작하기 → 로그인
2. Upload에서 프로젝트 생성
3. UI 이미지 업로드
4. 템플릿 선택(또는 새 템플릿 생성)
5. AI 평가 실행 → 로딩 모달 → 결과 확인
6. 피드백 저장 → My Page에서 확인

---

## 참고

* 결과 화면의 히트맵/점수/피드백은 현재 더미 데이터 기반이며, 실제 AI/서버 연동 시 `mockApi.js`의 `runEvaluation()`을 API 호출로 교체하면 됩니다.

---

원하면 내가 **“레포에 바로 어울리게”**

* 배지(React, License 등)
* 스크린샷 섹션(이미지 경로 자리)
* API 교체 가이드(어느 함수 바꾸면 되는지)
  까지 붙여서 더 완성형으로도 다시 써줄게.
