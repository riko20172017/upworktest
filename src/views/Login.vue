<template>
  <main class="text-center centered">
    <div class="form-signin">
      <div class="container">
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
            <label for="email">Email address</label>
          </div>
          <div class="form-floating">
            <!-- password input ------------------------------------------------------------->
            <custom-input
              :isValid="isValid('password')"
              :message="getMessage('password')"
              :wasValidate="wasValidate('password')"
              :value="getFieldValue('password')"
              @custom-change="handleChange"
              @custom-input="handleInput"
              :disabled="isSending"
              placeholder="password"
              id="password"
              name="password"
              type="password"
            />
            <label for="password">Password</label>
          </div>
          <div class="mb-3"></div>
          <button
            class="w-100 btn btn-lg btn-primary"
            type="submit"
            :disabled="isSending"
          >
            <span v-if="!isSending">Sign in</span>
            <div
              v-else
              class="d-flex align-items-center justify-content-center"
            >
              <strong v-if="redirection">Entering...</strong>
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
  name: "Login",
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
    } = useFromValidation([
      { name: "email", rules: ["email", "empty"] },
      { name: "password", rules: [[4, 8], "empty"] },
    ]);

    let isSending = ref(false);
    let redirection = ref(false);

    async function onSubmit() {
      if (isFormValid()) {
        isSending.value = true;
        try {
          await store.dispatch(ActionTypes.LogIn, {
            email: getFieldValue("email"),
            password: getFieldValue("password"),
          });
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