<template>
  <div>
    <vue-markdown :source="viewerText" :html="false"></vue-markdown>
  </div>
</template>

<script>
import VueMarkdown from "vue-markdown";

export default {
  name: "subscribe_item_detail",
  props: ["viewerText"],
  components: { VueMarkdown },
  data() {
    return {};
  },
  computed: {},

  methods: {},
};
</script>

<style></style>
