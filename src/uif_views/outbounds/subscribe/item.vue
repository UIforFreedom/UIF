<template>
  <el-card v-loading="isLoading">
    <div slot="header" class="clearfix">
      <span style="cursor: pointer">
        {{ subscribe_item_info.tag }}
        <el-divider direction="vertical"></el-divider>
        {{ subscribe_item_info.outbounds.length }}
        <el-divider direction="vertical"></el-divider>
        {{ LastUpdateTime() }} 更新过</span
      >
      <el-dropdown
        trigger="click"
        style="float: right; margin-left: 10px; padding: 3px 0; cursor: pointer"
      >
        <span class="el-dropdown-link">
          操作<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="Update"> 更新订阅 </el-dropdown-item>
          <el-dropdown-item @click.native="SpeedTest">
            测全部延迟
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="EnableAll(true)">
            全启用
          </el-dropdown-item>
          <el-dropdown-item @click.native="EnableAll(false)">
            全不启用
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="ShareMuti">
            分享
          </el-dropdown-item>

          <el-dropdown-item @click.native="Config">配置</el-dropdown-item>

          <el-dropdown-item style="color: red" @click.native="Delete" divided>
            删除
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <out_table :outbound_list="subscribe_item_info.outbounds" :isSub="true" />
  </el-card>
</template>

<script>
import { formatTime } from "@/utils/index.js";
import { mapState, mapActions } from "vuex";
import detail from "./detail.vue";
import out_table from "@/uif_views/outbounds/my_servers/out_table.vue";
import uif_store from "@/store/uif/uif";

export default {
  name: "subscribe_item",
  props: ["subscribe_item_info"],
  components: { detail, out_table },
  data() {
    return { show_detail: false, viewerText: "", isLoading: false };
  },
  mounted() {},
  computed: {
    ...mapState(["config", "uif"]),
  },

  methods: {
    ...mapActions({
      SaveUIFConfig: "uif/SaveUIFConfig",
      ApplyCoreConfig: "uif/ApplyCoreConfig",
      UpdateSub: "uif/UpdateSub",
    }),
    LastUpdateTime() {
      return formatTime(this.subscribe_item_info.updateTime, "");
    },
    Config() {
      this.uif.subscribe.info = this.subscribe_item_info;
      this.uif.subscribe.isAdding = false;
      this.uif.subscribe.isOpenSub = true;
    },
    async Update() {
      this.uif.subscribe.info = this.subscribe_item_info;
      this.isLoading = true;
      var res = await this.UpdateSub();
      console.log(res);
      if (res) {
        this.$message({
          type: "success",
          message: "更新成功！",
        });
        this.SaveUIFConfig();
      }
      this.isLoading = false;
    },
    ShareMuti() {
      this.uif.share.isSingle = false;
      this.uif.share.info = this.subscribe_item_info;
      this.uif.share.isOpenShare = true;
    },
    SpeedTest() {
      for (var item in this.subscribe_item_info.outbounds) {
        let row = this.subscribe_item_info.outbounds[item];
        uif_store.actions.Ping(row);
      }
    },
    EnableAll(res) {
      for (var item in this.subscribe_item_info.outbounds) {
        let row = this.subscribe_item_info.outbounds[item];
        if (row.transport.address.includes("127.0.0.1")) {
          continue;
        }
        row.enabled = res;
      }
      this.SaveUIFConfig();
      this.ApplyCoreConfig();
    },
    Delete() {
      this.$confirm("真的要删除该订阅?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var i = 0;
          for (var item in this.config.config.subscribe) {
            item = this.config.config.subscribe[item];
            if (item == this.subscribe_item_info) {
              this.config.config.subscribe.splice(i, 1);
              break;
            }
            i += 1;
          }
          this.SaveUIFConfig();
          this.ApplyCoreConfig();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除",
          });
        });
    },
  },
};
</script>

<style>
.el-table .success-row {
  background: oldlace;
}
</style>
