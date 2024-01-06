<template>
  <div class="app-container"></div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "subscribe",
  props: [],
  components: {},
  data() {
    return { dialogVisible: false };
  },
  mounted() {},
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
