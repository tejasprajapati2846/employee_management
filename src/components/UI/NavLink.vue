<template>
  <router-link class="nav-link" :to="href">{{ text }}</router-link>
</template>

<script>
export default {
  props: ["href", "text"],
};
</script>
