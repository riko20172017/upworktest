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
                @click="deletePost(id, key)"
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
                :isValid="form.isValid('title')"
                :message="form.getMessage('title')"
                :wasValidate="form.wasValidate('title')"
                :value="form.getFieldValue('title')"
                @custom-change="handleChange"
                @custom-input="handleInput"
                :disabled="disabled"
                placeholder="title"
                id="title"
                name="title"
                type="text"
              />
            </td>
            <td>
              <custom-input
                :isValid="form.isValid('content')"
                :message="form.getMessage('content')"
                :wasValidate="form.wasValidate('content')"
                :value="form.getFieldValue('content')"
                @custom-change="handleChange"
                @custom-input="handleInput"
                :disabled="disabled"
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
import { Options, Vue } from "vue-class-component";
import Header from "@/components/Header.vue";
import axios from "axios";
import { Validation } from "@/utils/vaildation";
import Input from "@/components/Form/Input.vue";

interface IDataRequest<T> {
  post: T;
}

interface IPost {
  id: number;
  title: string;
  content: string;
}

@Options({
  components: {
    Header,
    "custom-input": Input,
  },
})
export default class Dashboard extends Vue {
  posts: Array<IPost> = [];
  deleting = 0;
  deleted = 0;
  adding = false;
  fetching = false;

  form = new Validation([
    { name: "title", rules: ["empty"] },
    { name: "content", rules: ["empty"] },
  ]);

  isSending: boolean = false;

  get disabled() {
    return this.isSending;
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
  public handleInput(target: { name: "title" | "content"; value: string }) {
    this.form.changeValue(target.name, target.value);
  }

  async deletePost(id: number, index: number) {
    this.deleting = id;
    try {
      let res = await axios.delete("/api/post", { data: { id } });
      if (res.data.id == id) {
        this.deleted = id;
        setTimeout(() => this.posts.splice(index, 1), 200);
      }
    } catch (error) {
      console.log(error);
    }
    this.deleting = 0;
  }

  async getPosts() {
    this.fetching = true;
    let res = await axios.get<string, { data: { posts: Array<IPost> } }>(
      "/api/posts"
    );
    this.posts = res.data.posts;
    this.fetching = false;
  }

  async addPost() {
    this.form.validateAll();
    if (this.form.isFormValid()) {
      this.adding = true;
      try {
        let res = await axios.put<
          string,
          { data: { isOk: boolean; post: IPost } }
        >("/api/post", JSON.stringify(this.form.getValues()));
        if (res.data.isOk) {
          this.posts.push(res.data.post);
          this.form.clear();
        }
      } catch (error) {
        console.log(error);
      }
      this.adding = false;
    }
  }

  mounted() {
    this.getPosts();
  }
}
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
.btn.btn-danger, .btn.btn-primary {
  width: 110px;
  .spinner-d {
    position: absolute;
  }
}
</style>