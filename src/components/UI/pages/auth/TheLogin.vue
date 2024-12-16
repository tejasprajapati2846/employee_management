<template>
  <div id="layoutAuthentication">
    <div id="layoutAuthentication_content">
      <main>
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-5">
              <div class="card shadow-lg border-0 rounded-lg mt-5">
                <div class="card-header">
                  <h3 class="text-center font-weight-light my-4">Login</h3>
                </div>
                <div class="card-body">
                  <form @submit.prevent="login">
                    <div class="form-floating mb-3">
                      <input
                        class="form-control"
                        id="inputEmail"
                        type="email"
                        placeholder="name@example.com"
                        ref="email"
                        />
                      <label for="inputEmail">Email address</label>
                    </div>
                    <div class="form-floating mb-3">
                      <input
                        class="form-control"
                        id="inputPassword"
                        type="password"
                        placeholder="Password"
                        ref="password"
                    />
                      <label for="inputPassword">Password</label>
                    </div>
                    <div class="form-check mb-3">
                      <input
                        class="form-check-input"
                        id="inputRememberPassword"
                        type="checkbox"
                        value=""
                      />
                      <label
                        class="form-check-label"
                        for="inputRememberPassword"
                        >Remember Password</label
                      >
                    </div>
                    <div
                      class="d-flex align-items-center justify-content-between mt-4 mb-0"
                    >
                      <a class="small" href="password.html">Forgot Password?</a>
                      <button class="btn btn-primary">Login</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    <div id="layoutAuthentication_footer">
      <footer class="py-4 bg-light mt-auto">
        <div class="container-fluid px-4">
          <div class="d-flex align-items-center justify-content-between small">
            <div class="text-muted">Copyright &copy; Your Website 2023</div>
            <div>
              <a href="#">Privacy Policy</a>
              &middot;
              <a href="#">Terms &amp; Conditions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>

export default {
  methods: {
    async login() {
      try {
        const email = this.$refs.email.value;
        const password = this.$refs.password.value;
        const success = await this.$store.dispatch('loginCheck', {email,password});
        console.log(success);
        if (success) {
          this.$router.push("/dashboard");
        } else {
          this.$swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Incorrect Email or Password!",
            });
        }
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Incorrect Email or Password!",
        });
      }
    },
  },
};
// export default {
//   methods: {
//     submit(){
//       alert('data');
//         console.log(this.$refs.email.value)
//     },
//     login() {
//       axios
//         .post("http://127.0.0.1:8000/api/login", {
//           email: this.$refs.email.value,
//           password: this.$refs.password.value,
//         })
//         .then((response) => {
//           if(response.data.success) {
//             const token = response.data.data.token;
//             localStorage.setItem("authToken", token);
//             this.$router.push("/dashboard");
//           } else {
//             this.$swal.fire({
//               icon: "error",
//               title: "Oops...",
//               text: "Incorrect Email or Password!",
//             });
//           }
//           })
//         .catch((error) => {
//           console.warn(error);
//           this.$swal.fire({
//               icon: "error",
//               title: "Oops...",
//               text: "Incorrect Email or Password!",
//           });
//         });
//     },
//   },

  // methods: {
  //   submit() {
  //     this.$store.dispatch('login/submit');
  //   },
  //   login() {
  //     this.$store.dispatch('login/login');
  //   },
  // },
  // computed: {
  //   email: {
  //     get() {
  //       return this.$store.state.login.email;
  //     },
  //     set(value) {
  //       this.$store.commit('login/setEmail', value);
  //     },
  //   },
  //   password: {
  //     get() {
  //       return this.$store.state.login.password;
  //     },
  //     set(value) {
  //       this.$store.commit('login/setPassword', value);
  //     },
  //   },
  // }
// };
</script>