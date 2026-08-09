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
      isUserReading: false,
    };
  },
  methods: {
    moveScroll() {
      const el = this.$el;
      if (!this.isUserReading) {
        el.scrollTop = el.scrollHeight;
      }
    },
    handleUserScroll() {
      const el = this.$el;
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40;
      this.isUserReading = !nearBottom;
    },
  },
  mounted() {
    this.$el.addEventListener("scroll", this.handleUserScroll);
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
  beforeDestroy() {
    this.$el.removeEventListener("scroll", this.handleUserScroll);
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
