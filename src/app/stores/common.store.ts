export const useCommonStore = defineStore('commonStore', () => {
  const userStore = useUserStore();
  const { isAdmin, } = storeToRefs(userStore);

  const navItems = ref<NavItem[]>([
    { label: '대시보드', link: '/dashboard', icon: '', isPublic: isAdmin.value, colspan: 2, },
    { label: '플레이어', link: '/players', icon: '', isPublic: true, colspan: 1, },
    { label: '캐릭터', link: '/characters', icon: '', isPublic: true, colspan: 1, },
    { label: '캠페인', link: '/campaigns', icon: '', isPublic: true, colspan: 1, },
    { label: '세션', link: '/sessions', icon: '', isPublic: true, colspan: 1, },
  ]);

  return {
    navItems,
  };
});
