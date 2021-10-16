<template>
  <main class="form-signup text-center centered">
    <div class="container">
      <div class="row g-5">
        <div class="col-md-8 col-lg-6 offset-md-2 offset-lg-3">
          <img
            class="mb-4"
            src="../assets/logo.png"
            alt=""
            width="72"
            height="57"
          />
          <h1 class="h3 mb-3 fw-normal">Please sign up</h1>
          <form @submit.prevent="onSubmit" novalidate class="has-validation">
            <div class="row g-3">
              <div class="col-sm-6">
                <div class="form-floating">
                  <custom-input
                    :isValid="form.isValid('firstName')"
                    :message="form.getMessage('firstName')"
                    :wasValidate="form.wasValidate('firstName')"
                    :value="form.getFieldValue('firstName')"
                    @custom-change="handleChange"
                    @custom-input="handleInput"
                    :disabled="disabled"
                    placeholder="First name"
                    id="firstName"
                    name="firstName"
                    type="text"
                  />
                  <label for="firstName" class="form-label">First name</label>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-floating">
                  <custom-input
                    :isValid="form.isValid('lastName')"
                    :message="form.getMessage('lastName')"
                    :wasValidate="form.wasValidate('lastName')"
                    :value="form.getFieldValue('lastName')"
                    @custom-change="handleChange"
                    @custom-input="handleInput"
                    :disabled="disabled"
                    placeholder="Last name"
                    id="lastName"
                    name="lastName"
                    type="text"
                  />
                  <label for="lastName" class="form-label">Last name</label>
                </div>
              </div>
              <div class="col-12">
                <div class="form-floating">
                  <custom-input
                    :isValid="form.isValid('email')"
                    :message="form.getMessage('email')"
                    :wasValidate="form.wasValidate('email')"
                    :value="form.getFieldValue('email')"
                    @custom-change="handleChange"
                    @custom-input="handleInput"
                    :disabled="disabled"
                    placeholder="name@example.com"
                    id="email"
                    name="email"
                    type="email"
                  />
                  <label for="email" class="form-label">Email</label>
                </div>
              </div>
              <div class="col-12">
                <div class="form-floating">
                  <custom-input
                    :isValid="form.isValid('password')"
                    :message="form.getMessage('password')"
                    :wasValidate="form.wasValidate('password')"
                    :value="form.getFieldValue('password')"
                    @custom-change="handleChange"
                    @custom-input="handleInput"
                    :disabled="disabled"
                    placeholder="Password"
                    id="password"
                    name="password"
                    type="password"
                  />
                  <label for="password" class="form-label">Password</label>
                </div>
              </div>
            </div>
            <hr class="my-4" />
            <button
              class="w-100 btn btn-lg btn-primary"
              type="submit"
              :disabled="disabled"
            >
              <span v-if="!disabled">Create</span>
              <div
                v-else
                class="d-flex align-items-center justify-content-center"
              >
                <strong v-if="redirection">Redirect...</strong>
                <strong v-else>Loading......</strong>
                <div
                  class="spinner-border spinner-border-sm ms-2"
                  role="status"
                  aria-hidden="true"
                ></div>
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
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
    { name: "firstName", rules: [[2, 8], "empty"] },
    { name: "lastName", rules: [[2, 8], "empty"] },
  ]);

  isSending = false;
  redirection = false;

  get disabled() {
    return this.isSending;
  }

  /**
   * handleChange
   */
  public handleChange(name: "password" | "email") {
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
        "/api/signup",
        JSON.stringify(this.form.getValues())
      );

      if (res.data.isOk) {
        this.redirection = true;
        setTimeout(() => {
          this.$router.push("dashboard");
        }, 2000);
      } else {
        this.isSending = false;
      }
      this.form.clear();
    }
  }
}
</script>

<style lang="scss" scoped>
.app {
  display: flex;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}
</style>