<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span style="cursor: pointer">
          {{ $translator({ cn: "自定义出站", en: "My Outbound" }) }}
          <el-divider direction="vertical"></el-divider>
          {{ config.config.outbounds.length }}
        </span>
        <el-button
          style="float: right; margin-left: 10px; padding: 3px 0"
          type="text"
          icon="el-icon-circle-plus-outline"
          @click="AddNew()"
        >
          {{ $translator({ cn: "添加", en: "Add" }) }}
        </el-button>
      </div>

      <out_table :outbound_list="config.config.outbounds" :isSub="false" />
    </el-card>
  </div>
</template>

<script>
import out_table from "./out_table.vue";
import { newDefaultHttpOut } from "@/store/uif/config.js";
import { mapActions, mapState } from "vuex";

export default {
  name: "my_servers_item_short",
  components: { out_table },
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
      GetUIFConfig: "uif/GetUIFConfig",
    }),
    AddNew() {
      this.uif.pannel.all_list = this.config.config.outbounds;
      this.uif.pannel.info = newDefaultHttpOut();
      this.uif.pannel.isAdding = true;
      this.uif.pannel.isClient = true;
      this.uif.pannel.isShowingJson = false;
      this.uif.pannel.isOpen = true;
    },
  },
};
</script>

<style>
.type_tag {
  min-width: 60px;
  text-align: center;
}
</style>
