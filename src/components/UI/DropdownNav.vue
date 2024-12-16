<template>
  <router-link
    class="nav-link collapsed"
    to="#"
    data-bs-toggle="collapse"
    :data-bs-target="`#${id}`"
    :aria-expanded="expanded"
    :aria-controls="id"
  >
    <div class="sb-nav-link-icon"><i class="fas fa-columns"></i></div>
    {{ text }}
    <div class="sb-sidenav-collapse-arrow">
      <i :class="icon"></i>
    </div>
  </router-link>
  <div
    class="collapse"
    :id="id"
    :aria-labelledby="id"
    data-bs-parent="#sidenavAccordion"
  >
    <nav class="sb-sidenav-menu-nested nav">
      <nav-link href="/list" text="List"></nav-link>
      <nav-link href="/old-employee" text="Old Employee"></nav-link>
    </nav>
  </div>
</template>

<script>
import NavLink from "./NavLink.vue";
export default {
  components: { NavLink },
  props: ["id", "expanded", "text", "icon"],
};
</script>
