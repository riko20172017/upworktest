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
        <custom-input
          :isValid="v.isValid('email')"
          :messages="v.getMessages('email')"
          :wasValidate="v.wasValidate('email')"
          :value="email"
          v-on:custom-change="handleChange"
          :disabled="disabled"
          placeholder="email"
          id="email"
          name="email"
        />
        <label for="email">Email address</label>
      </div>
      <div class="form-floating">
        <!-- password input ------------------------------------------------------------->
        <custom-input
          :isValid="v.isValid('password')"
          :messages="v.getMessages('password')"
          :wasValidate="v.wasValidate('password')"
          :value="password"
          v-on:custom-change="handleChange"
          :disabled="disabled"
          placeholder="password"
          id="password"
          name="password"
        />
        <label for="password">Password</label>
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
import { Validation } from "@/utils/vaildation";
import Input from "@/components/Form/Input.vue";

@Options({
  components: { "custom-input": Input },
})
export default class Login extends Vue {
  email = "";
  password = "";
  v = new Validation();
  isSending: boolean = false;

  get disabled() {
    return this.isSending;
  }
  /**
   * handleChange
   */
  handleChange(target: { name: "password" | "email"; value: string }) {
    this[target.name] = target.value;
    this.v.validate(target.name, target.value);
  }

  mounted() {
    this.v.add("email", ["empty", "email"]);
    this.v.add("password", ["empty", [4, 8]]);
  }

  async onSubmit() {
    this.isSending = true;
    let res = await axios.post<string, { data: { isOk: boolean } }>(
      "/api/login",
      JSON.stringify({
        email: this.email,
        password: this.password,
      })
    );

    if (res.data.isOk) {
      setTimeout(() => {
        this.$router.push("dashboard");
      }, 2000);
    } else {
      this.isSending = false;
    }
  }
}
</script>

<style lang="scss" >
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