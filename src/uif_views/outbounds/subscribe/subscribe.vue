<template>
  <div class="app-container">
    <div v-for="item in config.config.subscribe" :key="item['tag']">
      <subscribe_item :subscribe_item_info="item" />
    </div>

    <el-dialog
      title="添加订阅"
      :visible.sync="uif.subscribe.isOpenSub"
      :fullscreen="true"
    >
      <add_subscribe_page />
    </el-dialog>

    <el-button
      icon="el-icon-circle-plus"
      style="width: 100%; font-size: 30px"
      @click="AddNew"
      >添加订阅</el-button
    >
  </div>
</template>

<script>
import subscribe_item from "./item.vue";
import add_subscribe_page from "./add.vue";
import { mapState, mapActions } from "vuex";
import { newSub } from "@/store/uif/config.js";

export default {
  name: "subscribe",
  props: [],
  components: { subscribe_item, add_subscribe_page },
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
    }),
    AddNew() {
      this.uif.subscribe.info = newSub();
      this.uif.subscribe.isAdding = true;
      this.uif.subscribe.isOpenSub = true;
    },
  },
};
</script>
