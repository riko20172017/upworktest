<template>
  <div>
    <header class="p-3 bg-dark text-white">
      <div class="container">
        <div
          class="
            d-flex
            flex-wrap
            align-items-center
            justify-content-center justify-content-lg-start
          "
        >
          <a
            href="/"
            class="
              d-flex
              align-items-center
              mb-2 mb-lg-0
              text-white text-decoration-none
            "
          >
            <img
              alt="Vue logo"
              class="img-fluid logo"
              src="../assets/logo.png"
            />
          </a>

          <ul
            class="
              nav
              col-12 col-lg-auto
              me-lg-auto
              mb-2
              justify-content-center
              mb-md-0
            "
          >
            <router-link to="/" custom v-slot="{ href, navigate, isActive }">
              <li>
                <a
                  :href="href"
                  @click="navigate"
                  :class="[
                    'nav-link px-2 text-white',
                    isActive && 'text-white-50',
                  ]"
                  >Home</a
                >
              </li>
            </router-link>

            <router-link
              to="dashboard"
              custom
              v-slot="{ href, navigate, isActive }"
            >
              <li>
                <a
                  :href="href"
                  @click="navigate"
                  :class="[
                    'nav-link px-2 text-white',
                    isActive && 'text-white-50',
                  ]"
                  >Dashboard</a
                >
              </li>
            </router-link>
          </ul>
          <div class="text-end" v-if="isAuthenticated">
            <button type="button" class="btn btn-warning" @click="logOut">
              Exit
            </button>
          </div>
          <div class="text-end" v-else>
            <router-link to="login" custom v-slot="{ href, navigate }">
              <a
                type="button"
                class="btn btn-outline-light me-2"
                :href="href"
                @click="navigate"
              >
                Login
              </a>
            </router-link>
            <router-link to="signup" custom v-slot="{ href, navigate }">
              <a
                type="button"
                class="btn btn-warning"
                :href="href"
                @click="navigate"
              >
                Signup
              </a>
            </router-link>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "@/store";
import { ActionTypes } from "@/store/actions";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Header",
  setup() {
    const store = useStore();
    const router = useRouter();
    return {
      isAuthenticated: computed(() => store.getters.isAuthenticated),
      logOut: () => {
        store.dispatch(ActionTypes.LogOut);
        router.push("login");
      },
    };
  },
});
</script>

<style scoped lang="sass">
.logo
  width: 25px
.active
  color: grey
</style>
