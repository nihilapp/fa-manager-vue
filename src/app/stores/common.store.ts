import axios from 'axios';

export const useCommonStore = defineStore('commonStore', () => {
  const exampleData = ref<{ id: number; userId: number; title: string; body: string }[]>([]);

  const getExampleData = async () => {
    await axios.get('https://jsonplaceholder.typicode.com/posts')
      .then((res) => {
        exampleData.value = res.data;
      });
  };

  return {
    exampleData,

    getExampleData,
  };
});
