<template>
  <main class="form-signin login">
    <form @submit.prevent="onSubmit" novalidate class="has-validation">
      <img
        class="mb-4"
        src="../assets/logo.png"
        alt=""
        width="72"
        height="57"
      />
      <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

      <div class="form-floating">
        <!-- email input --------------------------------------------------------------->
        <input
          type="email"
          v-bind:class="[
            'form-control',
            this.fields.email.needsValidation ? validationClass('email') : '',
          ]"
          id="floatingInput"
          placeholder="name@example.com"
          v-model="fields.email.value"
          @change="checkForm"
          :disabled="disabled"
        />
        <div
          class="invalid-feedback mt-0 mb-2"
          v-for="(error, key) in fields.email.messages"
          :key="key"
        >
          {{ error }}
        </div>
        <label for="floatingInput">Email address</label>
      </div>
      <div class="form-floating">
        <!-- password input ------------------------------------------------------------->
        <input
          type="password"
          id="floatingPassword"
          placeholder="Password"
          v-bind:class="[
            'form-control',
            this.fields.password.needsValidation
              ? validationClass('password')
              : '',
          ]"
          v-model="fields.password.value"
          @change="checkForm"
          :disabled="disabled"
        />
        <div
          class="invalid-feedback mt-0 mb-2"
          v-for="(error, key) in fields.password.messages"
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
          <strong v-if="isOk">Entering...</strong>
          <strong v-else>Loading......</strong>
          <div
            class="spinner-border spinner-border-sm ms-2"
            role="status"
            aria-hidden="true"
          ></div>
        </div>
      </button>
      <button type="button" class="btn btn-light text-muted w-100">
        Forgot Password?
      </button>
      <button
        type="button"
        class="btn btn-light mt-3 text-primary w-100"
        @click="$router.push('signup')"
      >
        New user? Sign up
      </button>
      <p class="mt-5 mb-3 text-muted">© 2021</p>
    </form>
  </main>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import axios from "axios";

interface IField {
  messages: Array<string>;
  needsValidation: boolean;
  value: string;
}
type Key = keyof Login["fields"];

@Options({
  components: {},
})
export default class Login extends Vue {
  fields = {
    email: {
      messages: [],
      needsValidation: false,
      value: "",
    } as IField,
    password: {
      messages: [],
      needsValidation: false,
      value: "",
    } as IField,
  };

  isOk: boolean = false;
  isSending: boolean = false;

  get disabled() {
    return this.isSending;
  }

  get validationClass() {
    return (key: Key) => ({
      "is-valid": this.fields[key].messages.length == 0,
      "is-invalid": this.fields[key].messages.length > 0,
    });
  }

  checkForm() {
    this.fields.email.messages = [];
    this.fields.email.needsValidation = true;
    this.fields.email.needsValidation = true;
    this.fields.password.messages = [];
    this.fields.password.needsValidation = true;

    if (this.fields.email.value === "") {
      this.fields.email.messages.push("input mail");
    } else if (!this.validEmail(this.fields.email.value)) {
      this.fields.email.messages.push("Input correct email");
    }
    if (this.fields.password.value === "") {
      this.fields.password.messages.push("input password");
    } else if (
      this.fields.password.value.length < 4 ||
      this.fields.password.value.length > 8
    ) {
      this.fields.password.messages.push("Min is 4 and max is 8");
    }
  }

  validEmail(email: string): boolean {
    var re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  isFormValid() {
    let key: Key;
    for (key in this.fields) {
      if (this.fields[key].messages.length > 0) return;
    }
    return true;
  }

  async onSubmit() {
    this.checkForm();
    if (this.isFormValid()) {
      this.isSending = true;
      let res = await axios.post<string, { data: { isOk: boolean } }>(
        "/api/login",
        JSON.stringify({
          email: this.fields.email.value,
          password: this.fields.password.value,
        })
      );
      this.isOk = res.data.isOk;

      if (res.data.isOk) {
        setTimeout(() => {
          this.$router.push("signup");
        }, 2000);
      } else {
        this.isSending = false;
      }
    }
  }
}
</script>

<style lang="scss" scope>
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
.btn-light.text-muted {
  font-size: 12px;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>