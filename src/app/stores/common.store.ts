export const useCommonStore = defineStore('commonStore', () => {
  const userStore = useUserStore();
  const { isAdmin, } = storeToRefs(userStore);

  const navItems = ref<NavItem[]>([
    {
      label: '대시보드',
      link: '/dashboard',
      icon: iconName('tabler:layout-dashboard-filled'),
      isPublic: isAdmin.value,
      colspan: 2,
    },
    { label: '플레이어', link: '/players', icon: iconName('fa6-solid:user'), isPublic: true, colspan: 1, },
    { label: '캐릭터', link: '/characters', icon: iconName('fa6-solid:person'), isPublic: true, colspan: 1, },
    { label: '캠페인', link: '/campaigns', icon: iconName('fa6-solid:book'), isPublic: true, colspan: 1, },
    { label: '세션', link: '/sessions', icon: iconName('fa6-solid:calendar'), isPublic: true, colspan: 1, },
  ]);

  return {
    navItems,
  };
});
