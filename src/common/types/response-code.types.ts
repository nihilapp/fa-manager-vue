export type ResponseCode = 'OK' // 200 - 요청 성공
  | 'CREATED' // 201 - 리소스 생성 성공
  | 'ACCEPTED' // 202 - 요청 수락됨 (비동기 처리)
  | 'NO_CONTENT' // 204 - 성공했으나 반환할 내용 없음
  | 'BAD_REQUEST' // 400 - 잘못된 요청
  | 'UNAUTHORIZED' // 401 - 인증 필요
  | 'FORBIDDEN' // 403 - 권한 없음
  | 'NOT_FOUND' // 404 - 리소스를 찾을 수 없음
  | 'METHOD_NOT_ALLOWED' // 405 - 허용되지 않은 HTTP 메서드
  | 'CONFLICT' // 409 - 리소스 충돌 (중복 등)
  | 'VALIDATION_ERROR' // 422 - 입력값 검증 실패
  | 'UNPROCESSABLE_ENTITY' // 422 - 처리할 수 없는 엔티티
  | 'INTERNAL_SERVER_ERROR' // 500 - 내부 서버 오류
  | 'BAD_GATEWAY' // 502 - 게이트웨이 오류
  | 'SERVICE_UNAVAILABLE' // 503 - 서비스 사용 불가
  | 'ERROR'; // 일반적인 에러 (구체적인 에러 코드를 사용할 수 없을 때)
