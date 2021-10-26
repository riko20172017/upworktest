<template>
  <div>
    <Header />

    <div class="container">
      <div style="height: 16px" class="mt-5">
        <div class="progress" v-show="deleting !== 0 || fetching">
          <div
            class="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            aria-valuenow="75"
            aria-valuemin="0"
            aria-valuemax="100"
            style="width: 100%"
          ></div>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">title</th>
            <th scope="col">content</th>
            <th scope="col">content</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="({ id, title, content }, key) in posts"
            :key="key"
            :class="[
              'td-d',
              {
                'deleted-post': deleted == id,
                'deleting-post': deleting == id,
              },
            ]"
          >
            <th scope="row">
              {{ id }}
            </th>
            <td>{{ title }}</td>
            <td>{{ content }}</td>
            <td style="width: 16.66%">
              <button
                type="button"
                class="btn btn-danger"
                @click="deletePost(id)"
                v-bind:disabled="deleting == id"
              >
                <div v-show="deleting == id" class="spinner-d pr-1">
                  <div
                    class="spinner-border spinner-border-sm text-light"
                    role="status"
                  >
                    <span class="visually-hidden"></span>
                  </div>
                </div>
                delete
              </button>
            </td>
          </tr>
          <tr>
            <th scope="row"></th>
            <td>
              <custom-input
                :isValid="isValid('title')"
                :message="getMessage('title')"
                :wasValidate="wasValidate('title')"
                :value="getFieldValue('title')"
                @custom-change="handleChange"
                @custom-input="handleInput"
                :disabled="adding"
                placeholder="title"
                id="title"
                name="title"
                type="text"
              />
            </td>
            <td>
              <custom-input
                :isValid="isValid('content')"
                :message="getMessage('content')"
                :wasValidate="wasValidate('content')"
                :value="getFieldValue('content')"
                @custom-change="handleChange"
                @custom-input="handleInput"
                :disabled="adding"
                placeholder="content"
                id="content"
                name="content"
                type="text"
              />
            </td>
            <td style="width: 16.66%">
              <button
                type="button"
                class="btn btn-primary"
                @click="addPost()"
                v-bind:disabled="adding"
              >
                <div v-show="adding" class="spinner-d pr-1">
                  <div
                    class="spinner-border spinner-border-sm text-light"
                    role="status"
                  >
                    <span class="visually-hidden"></span>
                  </div>
                </div>
                add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
//
import Input from "@/components/Form/Input.vue";
import { useStore } from "@/store";
import { computed, defineComponent, onMounted, ref } from "vue";
import { ActionTypes } from "@/store/actions";
import useFromValidation from "@/composables/useFromValidation";
import Header from "@/components/Header.vue";

export default defineComponent({
  name: "Dashboard",
  components: { "custom-input": Input, Header },
  setup() {
    const store = useStore();

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
      { name: "title", rules: ["empty"] },
      { name: "content", rules: ["empty"] },
    ]);
    const posts = computed(() => store.state.posts);

    const deleting = ref(0);
    const deleted = ref(0);
    const adding = ref(false);
    const fetching = ref(false);

    async function addPost() {
      if (isFormValid()) {
        adding.value = true;
        try {
          await store.dispatch(ActionTypes.CreatePost, {
            id: 0,
            title: getFieldValue("title"),
            content: getFieldValue("title"),
          });
          clear();
        } catch (errors: any) {
          addServerErrors(errors);
        }
        adding.value = false;
      }
    }

    async function deletePost(id: number) {
      deleting.value = id;
      try {
        await store.dispatch(ActionTypes.DeletePost, id);
        deleted.value = id;
      } catch (errors: any) {
        addServerErrors(errors);
      }
      deleting.value = 0;
    }

    async function getPosts() {
      fetching.value = true;
      try {
        await store.dispatch(ActionTypes.GetPosts);
      } catch (errors: any) {}
      fetching.value = false;
    }

    onMounted(() => getPosts());

    return {
      posts,
      fetching,
      adding,
      deleted,
      deleting,
      handleChange,
      handleInput,
      addPost,
      addServerErrors,
      getValues,
      isFormValid,
      validate,
      getFieldValue,
      changeValue,
      wasValidate,
      isValid,
      getMessage,
      deletePost,
    };
  },
});
</script>

<style lang="scss" scoped>
.td-d {
  background-color: white;
  opacity: 1;
  //   transition: 0.5s;
}
.deleted-post {
  transition: 0.5s;
  transform: translateY(-200px);
  opacity: 0;
}
.deleting-post {
  background-color: rgba(255, 0, 0, 0.219);
}
.btn.btn-danger,
.btn.btn-primary {
  width: 110px;
  .spinner-d {
    position: absolute;
  }
}
</style>