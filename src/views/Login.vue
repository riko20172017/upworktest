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
          :isValid="form.isValid('email')"
          :message="form.getMessage('email')"
          :wasValidate="form.wasValidate('email')"
          :value="email"
          @custom-change="handleChange"
          @custom-input="handleInput"
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
          :isValid="form.isValid('password')"
          :message="form.getMessage('password')"
          :wasValidate="form.wasValidate('password')"
          :value="password"
          @custom-change="handleChange"
          @custom-input="handleInput"
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
      <button type="button" class="btn btn-light text-muted w-100 mt-1">
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

  form = new Validation([
    { name: "email", rules: ["email", "empty"] },
    { name: "password", rules: [[4, 8], "empty"] },
  ]);

  isSending: boolean = false;

  get disabled() {
    return this.isSending;
  }

  get email() {
    return this.form.getFieldValue("email");
  }

  get password() {
    return this.form.getFieldValue("password");
  }
  /**
   * handleChange
   */
  handleChange(name: "password" | "email") {
    this.form.validate(name);
  }

  /**
   * handleInnput
   */
  public handleInput(target: { name: "password" | "email"; value: string }) {
    this.form.changeValue(target.name, target.value);
  }

  async onSubmit() {
    this.form.validateAll();
    if (this.form.isFormValid()) {
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
      this.form.clear()
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