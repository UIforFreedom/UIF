<template>
  <div class="app-container">
    <div v-for="item in config.config.subscribe" :key="item['tag']">
      <subscribe_item :subscribe_item_info="item" />
    </div>

    <el-button
      icon="el-icon-circle-plus"
      style="width: 100%; font-size: 30px"
      @click="AddNewSubcription"
      >{{ $translator({ cn: "添加订阅", en: "Add Subscription" }) }}</el-button
    >
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
