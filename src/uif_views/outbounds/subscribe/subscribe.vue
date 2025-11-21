<template>
  <div class="app-container">
    <div v-for="item in config.config.subscribe" :key="item['tag']">
      <subscribe_item :subscribe_item_info="item" />
    </div>

    <el-button
      icon="el-icon-circle-plus"
      type="primary"
      class="fab-subscribe"
      @click="AddNewSubcription"
    >
      {{ $translator({ cn: "添加订阅", en: "Add Subscription" }) }}
    </el-button>
  </div>
</template>

<script>
import subscribe_item from "./item.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "subscribe",
  props: [],
  components: { subscribe_item },
  data() {
    return {};
  },
  mounted() {
    this.GetUIFConfig();
  },
  computed: {
    ...mapState(["config", "uif"]),
  },

  methods: {
    ...mapActions({
      ApplyCoreConfig: "uif/ApplyCoreConfig",
      GetUIFConfig: "uif/GetUIFConfig",
      SaveUIFConfig: "uif/SaveUIFConfig",
      AddNewSubcription: "uif/AddNewSubcription",
    }),
  },
};
</script>

<style scoped>
.fab-subscribe {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1000;
  font-size: 16px;
  padding: 12px 18px;
  border-radius: 24px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
</style>
