<script setup lang='ts'>
const navItems = [
  { label: '', link: '', icon: '' },
];
</script>

<template>
  <header>
    <h1>logo</h1>
    <nav>
      <ul>
        <li v-for='item in navItems' :key='item.link'>
          <NuxtLink :to='item.link'>
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>

</style>
