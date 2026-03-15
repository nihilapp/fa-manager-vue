export class RESPONSE_MESSAGE {
  // ========== ========== ========== ==========
  // 기본 메시지
  // ========== ========== ========== ==========

  static OK = '요청이 성공적으로 처리되었습니다.';
  static CREATED = '새로운 리소스가 생성되었습니다.';
  static NO_CONTENT = '처리 결과가 비어 있습니다.';
  static BAD_REQUEST = '잘못된 요청입니다. 입력값을 확인해 주세요.';
  static UNAUTHORIZED = '인증 정보가 없거나 유효하지 않습니다.';
  static FORBIDDEN = '해당 리소스에 접근할 권한이 없습니다.';
  static NOT_FOUND = '요청하신 리소스를 찾을 수 없습니다.';
  static CONFLICT = '중복된 데이터가 이미 존재합니다.';
  static INTERNAL_SERVER_ERROR = '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
  static BAD_GATEWAY = '게이트웨이 응답 오류가 발생했습니다.';
  static REQUIRED_FIELDS_MISSING = '필수 입력 정보가 누락되었습니다.';

  // ========== ========== ========== ==========
  // 서버 상태 메시지
  // ========== ========== ========== ==========

  static SERVER_IS_ALIVE = '서버가 정상적으로 작동 중입니다.';

  // ========== ========== ========== ==========
  // 사용자 관련 메시지
  // ========== ========== ========== ==========

  static GET_USER_LIST_SUCCESS = '사용자 목록 조회 성공';
  static GET_USER_DETAIL_SUCCESS = '사용자 상세 정보 조회 성공';
  static USER_NOT_FOUND = '해당 사용자를 찾을 수 없습니다.';
  static USERNAME_ALREADY_EXISTS = '이미 사용 중인 사용자 이름입니다.';
  static EMAIL_ALREADY_EXISTS = '이미 등록된 이메일 주소입니다.';
  static CREATE_USER_SUCCESS = '사용자 계정이 생성되었습니다.';
  static UPDATE_USER_SUCCESS = '사용자 정보가 성공적으로 수정되었습니다.';
  static UPDATE_USER_FAILURE = '사용자 정보를 수정할 수 없습니다.';
  static UPDATE_USER_FORBIDDEN = '해당 사용자를 수정할 권한이 없습니다.';
  static DELETE_USER_SUCCESS = '사용자 계정이 성공적으로 삭제되었습니다.';
  static DELETE_USER_FAILURE = '사용자를 삭제할 수 없습니다.';
  static DELETE_USER_FORBIDDEN = '해당 사용자를 삭제할 권한이 없습니다.';
  static REQUIRE_DISCORD_ID = '디스코드 사용자 ID가 누락되었습니다.';

  // ========== ========== ========== ==========
  // 캠페인 관련 메시지
  // ========== ========== ========== ==========

  static GET_CAMPAIGN_LIST_SUCCESS = '캠페인 목록 조회 성공';
  static GET_CAMPAIGN_DETAIL_SUCCESS = '캠페인 상세 정보 조회 성공';
  static CAMPAIGN_NOT_FOUND = '캠페인을 찾을 수 없습니다.';
  static CAMPAIGN_NAME_ALREADY_EXISTS = '이미 사용중인 캠페인 이름입니다.';
  static CREATE_CAMPAIGN_SUCCESS = '캠페인이 생성되었습니다.';
  static UPDATE_CAMPAIGN_SUCCESS = '캠페인 정보가 성공적으로 수정되었습니다.';
  static UPDATE_CAMPAIGN_FAILURE = '캠페인 정보를 수정할 수 없습니다.';
  static DELETE_CAMPAIGN_SUCCESS = '캠페인이 삭제되었습니다.';
  static DELETE_CAMPAIGN_FAILURE = '캠페인을 삭제할 수 없습니다.';
  static CAMPAIGN_STATUS_UPDATED = function (
    campaignId: string, oldStatus: string, newStatus: string
  ): string {
    return `캠페인 상태가 변경되었습니다. 캠페인 ID: ${campaignId}, [${oldStatus} => ${newStatus}]`;
  };

  static UPDATE_CAMPAIGN_STATUS_FAILURE = '캠페인 상태를 수정할 수 없습니다.';

  static PLAYER_REGISTERED = '플레이어가 캠페인에 등록되었습니다.';
  static PLAYER_DELETED = '플레이어가 캠페인에서 삭제되었습니다.';
  static CHARACTER_REGISTERED = '캐릭터가 캠페인에 등록되었습니다.';
  static CHARACTER_DELETED = '캐릭터가 캠페인에서 삭제되었습니다.';

  // ========== ========== ========== ==========
  // 캐릭터 관련 메시지
  // ========== ========== ========== ==========

  static GET_CHARACTER_LIST_SUCCESS = '캐릭터 목록 조회 성공';
  static GET_CHARACTER_DETAIL_SUCCESS = '캐릭터 상세 정보 조회 성공';
  static CHARACTER_NOT_FOUND = '캐릭터를 찾을 수 없습니다.';
  static CREATE_CHARACTER_SUCCESS = '캐릭터가 생성되었습니다.';
  static UPDATE_CHARACTER_SUCCESS = '캐릭터 정보가 성공적으로 수정되었습니다.';
  static UPDATE_CHARACTER_FAILURE = '캐릭터 정보를 수정할 수 없습니다.';
  static DELETE_CHARACTER_SUCCESS = '캐릭터가 삭제되었습니다.';
  static DELETE_CHARACTER_FAILURE = '캐릭터를 삭제할 수 없습니다.';

  static CHARACTER_STATUS_UPDATED = function (
    characterId: string, oldStatus: string, newStatus: string
  ): string {
    return `캐릭터 상태가 변경되었습니다. 캐릭터 ID: ${characterId}, [${oldStatus} => ${newStatus}]`;
  };

  static UPDATE_CHARACTER_STATUS_FAILURE = '캐릭터 상태를 수정할 수 없습니다.';
  static CHARACTER_WEALTH_UPDATED = '캐릭터 소지금이 변동되었습니다.';

  // ========== ========== ========== ==========
  // 세션 관련 메시지
  // ========== ========== ========== ==========

  static GET_SESSION_LIST_SUCCESS = '세션 목록 조회 성공';
  static GET_SESSION_DETAIL_SUCCESS = '세션 상세 정보 조회 성공';
  static SESSION_NOT_FOUND = '세션을 찾을 수 없습니다.';
  static CREATE_SESSION_SUCCESS = '세션이 생성되었습니다.';
  static UPDATE_SESSION_SUCCESS = '세션 정보가 성공적으로 수정되었습니다.';
  static UPDATE_SESSION_FAILURE = '세션 정보를 수정할 수 없습니다.';
  static DELETE_SESSION_SUCCESS = '세션이 삭제되었습니다.';
  static DELETE_SESSION_FAILURE = '세션을 삭제할 수 없습니다.';

  static SESSION_STATUS_UPDATED = function (
    sessionId: string, oldStatus: string, newStatus: string
  ): string {
    return `세션 상태가 변경되었습니다. 세션 ID: ${sessionId}, [${oldStatus} => ${newStatus}]`;
  };

  static UPDATE_SESSION_STATUS_FAILURE = '세션 상태를 수정할 수 없습니다.';

  // ========== ========== ========== ==========
  // 로그 관련 메시지
  // ========== ========== ========== ==========

  static GET_LOG_LIST_SUCCESS = '시스템 로그 이력 목록 조회 성공';
  static GET_LOG_DETAIL_SUCCESS = '시스템 로그 상세 정보 조회 성공';
  static LOG_NOT_FOUND = '해당 로그 이력을 찾을 수 없습니다.';
  static LOG_RESTORE_SUCCESS = '데이터가 과거 시점으로 성공적으로 복원되었습니다.';
  static LOG_RESTORE_FAILURE = '데이터 복원에 실패했습니다.';

  // ========== ========== ========== ==========
  // 문서 관련 메시지
  // ========== ========== ========== ==========

  static GET_DOC_LIST_SUCCESS = '세계관 문서 목록 조회 성공';
  static GET_DOC_DETAIL_SUCCESS = '세계관 문서 상세 정보 조회 성공';
  static DOC_NOT_FOUND = '세계관 문서를 찾을 수 없습니다.';
  static CREATE_DOC_SUCCESS = '세계관 문서가 생성되었습니다.';
  static UPDATE_DOC_SUCCESS = '세계관 문서가 성공적으로 수정되었습니다.';
  static UPDATE_DOC_FAILURE = '세계관 문서 정보를 수정할 수 없습니다.';
  static DELETE_DOC_SUCCESS = '세계관 문서가 삭제되었습니다.';
  static DELETE_DOC_FAILURE = '세계관 문서를 삭제할 수 없습니다.';

  static DOC_STATUS_UPDATED = function (
    docId: string, oldStatus: string, newStatus: string
  ): string {
    return `문서 상태가 변경되었습니다. 문서 ID: ${docId}, [${oldStatus} => ${newStatus}]`;
  };

  static UPDATE_DOC_STATUS_FAILURE = '문서 상태를 수정할 수 없습니다.';
}
