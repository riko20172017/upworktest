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
              to="about"
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
                  >About {{ isAuthenticated }}</a
                >
              </li>
            </router-link>
            <li><a href="#" class="nav-link px-2 text-white">Pricing</a></li>
            <li><a href="#" class="nav-link px-2 text-white">FAQs</a></li>
            <li><a href="#" class="nav-link px-2 text-white">About</a></li>
          </ul>
          <div class="text-end">
            <button type="button" class="btn btn-outline-light me-2">
              Login
            </button>
            <button type="button" class="btn btn-warning">Sign-up</button>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "@/store";

export default defineComponent({
  name: "Header",
  setup() {
    const store = useStore();
    return {
      isAuthenticated: computed(() => store.getters.isAuthenticated),
    };
  }
});
</script>

<style scoped lang="sass">
.logo
  width: 25px
.active
  color: grey
</style>
