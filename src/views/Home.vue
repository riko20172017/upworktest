<template>
  <div class="home">
    <Header />
    <div class="container mt-5">
      <h1 class="text-start">Upwork testing</h1>
      
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Header from "@/components/Header.vue"; // @ is an alias to /src

@Options({
  components: {
    Header,
  },
})
export default class Home extends Vue {}
</script>
