import type { ApiResponse, PageDataType } from '~/types/common.types';
import type { UserOutDto } from '~/types/dto.types';

export const useUserStore = defineStore('userStore', () => {
  // 사용자 목록
  const userInfoList = ref<UserOutDto[]>([]);

  // 사용자 총계
  const userInfoListCount = ref(0);

  // 단일 사용자 정보
  const userInfo = ref<UserOutDto | null>(null);

  const getUserList = async (
    callback?: (data: UserOutDto[], totalCnt: number) => void,
    errorCallback?: (error: ApiResponse<PageDataType<UserOutDto>>) => void
  ) => {
    await useGet<PageDataType<UserOutDto>>(
      '/users',
      undefined,
      (res) => {
        userInfoList.value = res?.data.list ?? [];
        userInfoListCount.value = res?.data.totalElements ?? 0;

        if (callback) {
          callback(res?.data.list ?? [], res?.data.totalElements ?? 0);
        }
      },
      (error) => {
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };

  return {
    userInfoList,
    userInfoListCount,
    userInfo,

    getUserList,
  };
});
