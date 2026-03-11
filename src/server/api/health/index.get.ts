export default defineEventHandler(async (event) => {
  /**
   * 1. 쿼리스트링 (GET)
   * 제네릭으로 타이핑 가능: getQuery<{ page: string }>(event)
   */
  // const query = getQuery(event);

  /**
   * 2. 패스파라미터 (Dynamic routes: [id].ts 등)
   * 제네릭으로 타이핑 불가능, 리턴되는 값이 Record<string, string> 이어서 타입 단언(as)을 쓰거나 스키마 검증(Zod 등)과 병행.
   * const id = getRouterParam(event, 'id'); 혹은 getRouterParams(event);
   */
  // const params = getRouterParams(event);

  /**
   * 3. 헤더
   */
  // const headers = getHeaders(event);

  /**
   * 4. 쿠키 (가져오기는 parseCookies, 가져오기 단건은 getCookie, 설정은 setCookie)
   */
  // const cookies = parseCookies(event);

  /**
   * 5. 요청 본문 (POST, PUT, PATCH 등)
   * readBody는 비동기 함수이므로 반드시 await를 붙여주어야 합니다. GET 요청에서는 사용하면 에러가 날 수 있으니 주의하세요.
   * 타이핑: await readBody<{ name: string }>(event)
   */
  // const body = await readBody(event);

  return createResponse(
    true,
    false,
    '서버가 정상적으로 동작 중입니다.',
    'OK'
  );
});
