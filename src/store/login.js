import axios from "axios";

export default {
  state: {
    authToken: localStorage.getItem("authToken") || null,
    name: localStorage.getItem("name") || null,
  },
  mutations: {
    SET_AUTH_TOKEN(state, token) {
      localStorage.setItem("authToken", token);
    },
    SET_USER_INFO(state,  name ) {
      console.log(name);
      localStorage.setItem("name",name);
    },
  },
  actions: {
    async loginCheck({ commit }, { email, password }) {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/login", {
          email,
          password,
        });
        if (response.data.success) {
          const { token, name } = response.data.data;
          console.log(name);
          commit("SET_AUTH_TOKEN", token);
          commit("SET_USER_INFO", name );
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.authToken,
    getName:  (state) => {
      return `${state.name}`;
    },
    authToken : (state) => {
      return `${state.authToken}`;
    }
  },
};
