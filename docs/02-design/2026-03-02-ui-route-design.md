# UI 라우트 설계 (UI Route Design)

## 1. 개요
API 엔드포인트(`server/api/*`)를 기반으로 Nuxt 3 환경에서의 UI 라우트 구조를 설계합니다.

## 2. API 기반 도출된 도메인
- Auth (인증)
- Users (사용자)
- Campaigns (캠페인)
- Campaign Members (캠페인 소속 멤버)
- Sessions (세션)
- Session Characters (세션 참여 캐릭터)
- Characters (캐릭터)
- Exp / Currency Logs (경험치/재화 로그)

## 3. 라우트 설계 (pages/ 디렉터리 구조)

| 라우트 경로 | 역할 | 연결되는 주 API | 접근 권한 |
| - | - | - | - |
| `/` | 랜딩 페이지 또는 대시보드 (내 캠페인 및 캐릭터 요약) | `GET /campaigns`, `GET /characters` | Public/Auth |
| `/sign-in` | 로그인 페이지 | `POST /auth/sign-in` | Public |
| `/sign-up` | 회원가입 페이지 | `POST /users` (index.post.ts) | Public |
| `/profile` | 사용자 프로필 및 계정 설정 | `GET /users/[id]`, `PATCH /users/[id]` | Auth |

### 캠페인 (Campaigns)
| 라우트 경로 | 역할 | 연결되는 주 API |
| - | - | - |
| `/campaigns` | 참여 중인 캠페인 목록 | `GET /campaigns` |
| `/campaigns/new` | 새 캠페인 생성 | `POST /campaigns` |
| `/campaigns/[id]` | 캠페인 상세 (정보, 멤버, 세션 목록) | `GET /campaigns/[id]` |
| `/campaigns/[id]/settings` | 캠페인 설정 변경 (GM용) | `PATCH /campaigns/[id]`, `DELETE /campaigns/[id]` |

### 세션 (Sessions)
| 라우트 경로 | 역할 | 연결되는 주 API |
| - | - | - |
| `/campaigns/[id]/sessions` | 세션 목록 | `GET /sessions?campaignId=[id]` |
| `/campaigns/[id]/sessions/new` | 새 세션 생성 | `POST /sessions` |
| `/campaigns/[id]/sessions/[sessionId]`| 세션 상세 (내용, 참여 캐릭터, 정산 내역) | `GET /sessions/[sessionId]` |

### 캐릭터 (Characters)
| 라우트 경로 | 역할 | 연결되는 주 API |
| - | - | - |
| `/characters` | 내 캐릭터 목록 | `GET /characters` |
| `/characters/new` | 새 캐릭터 생성 | `POST /characters` |
| `/characters/[id]` | 캐릭터 시트 상세 (스탯, 인벤토리, 로그 뷰) | `GET /characters/[id]` |
| `/characters/[id]/edit` | 캐릭터 정보 수정 | `PATCH /characters/[id]`, `DELETE /characters/[id]` |
| `/characters/[id]/logs` | 경험치/재화 획득 및 사용 로그 | `GET /exp-logs`, `GET /currency-logs` |

## 4. Nuxt 3 pages/ 폴더 구조 예상

```text
pages/
├── index.vue
├── sign-in.vue
├── sign-up.vue
├── profile.vue
├── campaigns/
│   ├── index.vue
│   ├── new.vue
│   └── [id]/
│       ├── index.vue
│       ├── settings.vue
│       └── sessions/
│           ├── index.vue
│           ├── new.vue
│           └── [sessionId].vue
├── characters/
    ├── index.vue
    ├── new.vue
    └── [id]/
        ├── index.vue
        ├── edit.vue
        └── logs.vue
```
