<template>
  <input
    type="email"
    :class="[
      'form-control',
      !wasValidate ? '' : isValid ? 'is-valid' : 'is-invalid',
    ]"
    id="floatingInput"
    placeholder="name@example.com"
    :value="value"
    v-on:change="$emit('custom-change', $event.target.name)"
    v-on:input="
      $emit('custom-input', {
        value: $event.target.value,
        name: $event.target.name,
      })
    "
    :name="name"
  />

  <div class="invalid-feedback mt-0">
    {{ message }}
  </div>
</template>

<script lang="ts">
import { Options, prop, Vue } from "vue-class-component";

class Props {
  isValid: boolean = prop({
    required: true,
  });
  wasValidate: boolean = prop({
    required: true,
  });
  message: string = prop({
    required: true,
  });
  value: string = prop({
    required: true,
  });
  name: string = prop({
    required: true,
  });
  disabled: boolean = prop({
    required: true,
  });
  id: string = prop({
    required: true,
  });
  placeholder: string = prop({
    required: true,
  });
}

@Options({ emits: ["custom-change", "custom-input"] })
export default class Input extends Vue.with(Props) {}
</script>
