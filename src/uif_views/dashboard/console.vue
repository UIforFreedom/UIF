<template>
  <div class="console" v-html="showLog"></div>
</template>

<script>
import AnsiUp from "ansi_up";

export default {
  name: "console",
  props: ["content"],
  data() {
    return {
      ansi: new AnsiUp(),
      isFocus: false,
    };
  },
  methods: {
    moveScroll() {
      // auto-scroll to the bottom when the DOM is updated
      this.$el.scrollTop = this.$el.scrollHeight;
    },
  },
  mounted() {
    this.moveScroll();
  },
  computed: {
    showLog() {
      // Ensures we have some semblance of lines
      return this.ansi.ansi_to_html(this.content).replace(/\n/gm, "<br>");
    },
  },
  updated() {
    this.moveScroll();
  },
};
</script>

<style lang="scss" scoped>
.console {
  font-family: monospace;
  text-align: left;
  background-color: black;
  color: #fff;
  max-height: 400px;
  overflow-y: auto;
}
</style>
