<template>
  <router-link class="nav-link" :to="href">
    <div class="sb-nav-link-icon">
      <i :class="icon"></i>
    </div>
    {{ text }}
  </router-link>
</template>

<script>
export default {
  props: ["icon", "href", "text"],
};
</script>