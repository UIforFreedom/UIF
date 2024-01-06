<template>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "tcp",
  props: ["transport"],
  components: {},
  data() {
    return {};
  },
  mounted() {
  },
  computed: {
    ...mapState(["v2ray"]),
  },
  beforeDestroy() {
  },
  methods: {
    ...mapActions({
      ConnectV2ray: "v2ray/ConnectV2ray",
    }),
  },
};
</script>
