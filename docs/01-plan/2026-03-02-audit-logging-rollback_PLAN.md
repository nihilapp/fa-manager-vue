# [Plan] Admin-Only Audit Logging & Rollback System

- **ID**: 2026-03-02-audit-logging-rollback
- **Date**: 2026-03-02
- **Author**: Gemini CLI (bkit)
- **Status**: Completed (100%)

## 1. Goal
- 모든 주요 테이블의 데이터 변경 이력을 추적하는 중앙 감사 로그 시스템 구축 완료.
- **어드민(ADMIN)** 전용 복구(Rollback) 기능을 통해 시스템 안정성 확보 완료.
- 유저 권한 시스템(`ADMIN` vs `USER`)을 통한 접근 제어 구현 완료.

## 2. Scope
- **User Role Management**: `users` 테이블 권한 필드 추가 및 RBAC 구현 완료.
- **Audit Logging**: 모든 테이블의 INSERT, UPDATE, DELETE 기록 완료.
- **Admin Features**: 감사 로그 목록 조회 및 데이터 롤백 기능 구축 완료.

## 3. Implementation Status & Remaining Tables

### ✅ Completed
- [x] `audit_logs` 테이블 신설 및 마이그레이션.
- [x] 어드민 권한 검증 및 감사 로그 생성 유틸리티.
- [x] 어드민 전용 로그 조회(목록/상세) 및 롤백 API.
- [x] **`users` 테이블 통합 완료.**
- [x] **`campaigns` 테이블 통합 완료.**
- [x] **`campaign_members` 테이블 통합 완료.**
- [x] **`characters` 테이블 통합 완료.**
- [x] **`sessions` 테이블 통합 완료.**
- [x] **`session_characters` 테이블 통합 완료.**
- [x] **`exp_logs` 테이블 통합 완료.**
- [x] **`currency_logs` 테이블 통합 완료.**

## 4. Technical Strategy (Final)
- 모든 CUD API에서 `createAuditLog`를 호출하여 이전/이후 데이터를 JSON 스냅샷으로 기록.
- 롤백 시 `action`별(INSERT/UPDATE/DELETE) 역작업을 수행하여 데이터 복구.

## 5. Key Tasks (Current Status)
1. [x] `users` 테이블에 `role` 컬럼 추가 및 기존 데이터 마이그레이션.
2. [x] `audit_logs` 테이블 스키마 정의 및 DB 반영.
3. [x] 어드민 여부를 판별하는 `checkAdmin` 서버 유틸리티 구현.
4. [x] 모든 도메인 엔드포인트에 감사 로그 로직 통합.
5. [x] 어드민 전용 로그 조회 및 롤백 API 구현.
