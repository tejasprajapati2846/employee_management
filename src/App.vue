<template>
  <router-view></router-view>
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      return localStorage.getItem("authToken");
    },
  },
  state: {
    firstName: "John",
    lastName: "Doe",
    favorites: [],
  },
  mutations: {},
  actions: {
    addToFavorites(context, payload) {
      context.commit("UPDATE_FAVORITES", payload);
    },
  },
  getters: {
    fullName: function (state) {
      return `${state.firstName} ${state.lastName}`;
    },
  },
};
</script>