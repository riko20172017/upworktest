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
                    :isValid="isValid('firstName')"
                    :message="getMessage('firstName')"
                    :wasValidate="wasValidate('firstName')"
                    :value="getFieldValue('firstName')"
                    @custom-change="handleChange"
                    @custom-input="handleInput"
                    :disabled="isSending"
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
                    :isValid="isValid('lastName')"
                    :message="getMessage('lastName')"
                    :wasValidate="wasValidate('lastName')"
                    :value="getFieldValue('lastName')"
                    @custom-change="handleChange"
                    @custom-input="handleInput"
                    :disabled="isSending"
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
                    :isValid="isValid('email')"
                    :message="getMessage('email')"
                    :wasValidate="wasValidate('email')"
                    :value="getFieldValue('email')"
                    @custom-change="handleChange"
                    @custom-input="handleInput"
                    :disabled="isSending"
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
                    :isValid="isValid('password')"
                    :message="getMessage('password')"
                    :wasValidate="wasValidate('password')"
                    :value="getFieldValue('password')"
                    @custom-change="handleChange"
                    @custom-input="handleInput"
                    :disabled="isSending"
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
              :disabled="isSending"
            >
              <span v-if="!isSending">Create</span>
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
import Input from "@/components/Form/Input.vue";
import { useStore } from "@/store";
import { computed, defineComponent, ref } from "vue";
import { ActionTypes } from "@/store/actions";
import useFromValidation from "@/composables/useFromValidation";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "SignUp",
  components: { "custom-input": Input },
  setup() {
    const store = useStore();
    const router = useRouter();
    const isAuthenticated = computed(() => store.getters.isAuthenticated);

    const {
      addServerErrors,
      getValues,
      isFormValid,
      validate,
      getFieldValue,
      changeValue,
      wasValidate,
      isValid,
      getMessage,
      handleChange,
      handleInput,
      clear,
    } = useFromValidation([
      { name: "email", rules: ["email", "empty"] },
      { name: "password", rules: [[4, 8], "empty"] },
      { name: "firstName", rules: [[2, 8], "empty"] },
      { name: "lastName", rules: [[2, 8], "empty"] },
    ]);

    const isSending = ref(false);
    const redirection = ref(false);

    async function onSubmit() {
      if (isFormValid()) {
        isSending.value = true;
        try {
          await store.dispatch(ActionTypes.Register, getValues());
          redirection.value = true;
          router.push("dashboard");
        } catch (errors: any) {
          addServerErrors(errors);
          isSending.value = false;
        }
      }
    }
    return {
      isAuthenticated,
      isSending,
      redirection,
      handleChange,
      handleInput,
      onSubmit,
      addServerErrors,
      getValues,
      isFormValid,
      validate,
      getFieldValue,
      changeValue,
      wasValidate,
      isValid,
      getMessage,
    };
  },
});
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