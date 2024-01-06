<template>
  <div id="app">
    <router-view />

    <el-dialog
      v-if="uif.pannel.isOpen"
      :title="BuildTitle()"
      :visible.sync="uif.pannel.isOpen"
      :fullscreen="true"
    >
      <out_item_info />
    </el-dialog>

    <el-dialog
      v-if="uif.share.isOpenShare"
      :title="BuildShareTitle()"
      :visible.sync="uif.share.isOpenShare"
      :fullscreen="true"
    >
      <share />
    </el-dialog>
  </div>
</template>

<script>
import out_item_info from "@/uif_views/outbounds/my_servers/out_item_info.vue";
import share from "@/uif_views/share/share.vue";
import { mapState } from "vuex";

export default {
  name: "App",
  components: { out_item_info, share },
  computed: {
    ...mapState(["config", "uif"]),
  },
  methods: {
    BuildTitle() {
      var res = "";
      if (this.uif.pannel.isAdding) {
        res += "添加";
      } else {
        res += "修改";
      }
      if (this.uif.pannel.isClient) {
        res += "出口";
      } else {
        res += "入口";
      }
      return res;
    },
    BuildShareTitle() {
      if (this.uif.share.isSingle) {
        return "分享单个出口";
      } else {
        return "分享订阅";
      }
    },
  },
};
</script>
