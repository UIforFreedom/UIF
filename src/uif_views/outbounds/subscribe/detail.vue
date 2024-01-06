<template>
  <div>
    <vue-markdown :source="viewerText" :html="false"></vue-markdown>
  </div>
</template>

<script>
import v2ray_module from "@/v2ray";
import { mapState, mapActions } from "vuex";
import VueMarkdown from "vue-markdown";

export default {
  name: "subscribe_item_detail",
  props: ["viewerText"],
  components: { VueMarkdown },
  data() {
    return {};
  },
  computed: {
    ...mapState(["v2ray"]),
  },

  methods: {
    ...mapActions({
      ConnectV2ray: "v2ray/ConnectV2ray",
      CloseV2ray: "v2ray/CloseV2ray",
    }),
  },
};
</script>

<style></style>
