<template>
  <main class="form-signin signup">
    <form @submit.prevent="checkForm" novalidate class="has-validation">
      <img
        class="mb-4"
        src="../assets/logo.png"
        alt=""
        width="72"
        height="57"
      />
      <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

      <div class="form-floating">
        <input
          type="email"
          v-bind:class="[
            'form-control',
            this.isActive ? validationClass('email') : '',
          ]"
          id="floatingInput"
          placeholder="name@example.com"
          v-model="email"
          @change="checkForm"
          :disabled="disabled"
        />
        <div
          class="invalid-feedback mt-0 mb-2"
          v-for="(error, key) in errors.email"
          :key="key"
        >
          {{ error }}
        </div>
        <label for="floatingInput">Email address</label>
      </div>
      <div class="form-floating">
        <input
          type="text"
          id="floatingPassword"
          placeholder="Password"
          v-bind:class="[
            'form-control',
            this.isActive ? validationClass('password') : '',
          ]"
          v-model="password"
          @change="checkForm"
          :disabled="disabled"
        />
        <div
          class="invalid-feedback mt-0 mb-2"
          v-for="(error, key) in errors.password"
          :key="key"
        >
          {{ error }}
        </div>
        <label for="floatingPassword">Password</label>
      </div>
      <div class="mb-3"></div>
      <button
        class="w-100 btn btn-lg btn-primary"
        type="submit"
        :disabled="disabled"
      >
        <span v-if="!disabled">Sign in</span>
        <div v-else class="d-flex align-items-center justify-content-center">
          <strong>Loading...</strong>
          <div
            class="spinner-border spinner-border-sm ms-2"
            role="status"
            aria-hidden="true"
          ></div>
        </div>
      </button>
      <button type="button" class="btn btn-light text-muted w-100">Forgot Password?</button>
      <button type="button" class="btn btn-light mt-3 text-primary w-100" @click="$router.push('signup')">New user? Sign up</button>
      <p class="mt-5 mb-3 text-muted">© 2021</p>
    </form>
  </main>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import axios from "axios";

@Options({
  components: {},
})
export default class Signup extends Vue {
  email: string = "";
  password: string = "";
  isOk: boolean = false;
  isSending: boolean = false;
  isActive: boolean = false;
  errors: {
    [email: string]: Array<string>;
    password: Array<string>;
  } = { email: [], password: [] };

  get disabled() {
    return this.isSending;
  }

  get validationClass() {
    return (field: string) => ({
      "is-valid": this.errors[field].length == 0,
      "is-invalid": this.errors[field].length > 0,
    });
  }

  checkForm() {
    this.errors = { email: [], password: [] };
    this.isActive = true;

    if (this.email === "") {
      this.errors.email.push("input mail");
    } else if (!this.validEmail(this.email)) {
      this.errors.email.push("Input correct email");
    }
    if (this.password === "") {
      this.errors.password.push("input password");
    } else if (this.password.length < 4 || this.password.length > 8) {
      this.errors.password.push("Min is 4 and max is 8");
    }
  }

  validEmail(email: string): boolean {
    var re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  async onSubmit() {
    this.isSending = true;
    let res = await axios.post<string, { data: { isOk: boolean } }>(
      "/api/login",
      JSON.stringify({ email: this.email, password: this.password })
    );
    this.isOk = res.data.isOk;
    this.isSending = false;
  }
}
</script>

<style lang="scss" scoped>
html,
body,
.app {
  height: 100%;
}
.app {
  text-align: center !important;
  display: flex;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.btn-light.text-muted{
  font-size: 12px;
}
</style>