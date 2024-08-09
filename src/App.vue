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

    <el-dialog
      v-if="uif.loginSessionInfo.isOpen"
      :visible.sync="uif.loginSessionInfo.isOpen"
      title="API"
      :fullscreen="true"
    >
      <api_item_info />
    </el-dialog>
  </div>
</template>

<script>
import out_item_info from "@/uif_views/outbounds/my_servers/out_item_info.vue";
import share from "@/uif_views/share/share.vue";
import api_item_info from "@/uif_views/dashboard/api_item_info.vue";
import { mapState } from "vuex";

export default {
  name: "App",
  components: { out_item_info, share, api_item_info },
  computed: {
    ...mapState(["config", "uif"]),
  },
  methods: {
    BuildTitle() {
      var res = "";
      if (this.uif.pannel.isAdding) {
        if (this.uif.config.lang == "cn") {
          res += "添加";
        } else {
          res += "Add ";
        }
      } else {
        if (this.uif.config.lang == "cn") {
          res += "修改";
        } else {
          res += "Config ";
        }
      }
      if (this.uif.pannel.isClient) {
        if (this.uif.config.lang == "cn") {
          res += "出口";
        } else {
          res += "Outbound";
        }
      } else {
        if (this.uif.config.lang == "cn") {
          res += "入口";
        } else {
          res += "Inbound";
        }
      }
      return res;
    },
    BuildShareTitle() {
      if (this.uif.share.isSingle) {
        if (this.uif.config.lang == "cn") {
          return "分享单个出口";
        } else {
          return "Share Single Outbound";
        }
      } else {
        if (this.uif.config.lang == "cn") {
          return "分享订阅";
        } else {
          return "Share Subscription";
        }
      }
    },
  },
};
</script>
