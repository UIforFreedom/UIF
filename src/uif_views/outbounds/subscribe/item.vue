<template>
  <el-card v-loading="isLoading">
    <div slot="header" class="clearfix">
      <span style="cursor: pointer" v-if="isSimple" @click="toggleCollapse">
        {{ subscribe_item_info.tag }}
      </span>

      <span style="cursor: pointer" v-else @click="toggleCollapse">
        <i
          :class="isCollapsed ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
          style="margin-right: 5px"
        ></i>
        {{ subscribe_item_info.tag }}
        <el-divider direction="vertical"></el-divider>
        {{ subscribe_item_info.outbounds.length }}
        <el-divider direction="vertical"></el-divider>
        {{ LastUpdateTime() }}
      </span>

      <el-dropdown
        trigger="click"
        style="float: right; margin-left: 10px; padding: 3px 0; cursor: pointer"
      >
        <span class="el-dropdown-link">
          {{ $translator({ cn: "操作", en: "Actions" }) }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="Update" icon="el-icon-refresh-right">
            {{ $translator({ cn: "更新订阅", en: "Update" }) }}
          </el-dropdown-item>
          <el-dropdown-item
            @click.native="SpeedTest"
            icon="el-icon-odometer"
            v-if="!isSimple"
          >
            {{ $translator({ cn: "测全部延迟", en: "Test All Delay" }) }}
          </el-dropdown-item>
          <el-dropdown-item
            divided
            @click.native="ChangeAllNodeStatus(true)"
            v-if="!isSimple"
            icon="el-icon-sort-down"
          >
            {{ $translator({ cn: "全启用", en: "Enable All" }) }}
          </el-dropdown-item>
          <el-dropdown-item
            @click.native="ChangeAllNodeStatus(false)"
            v-if="!isSimple"
            icon="el-icon-sort-up"
          >
            {{ $translator({ cn: "全不启用", en: "Disable All" }) }}
          </el-dropdown-item>
          <el-dropdown-item
            divided
            @click.native="ShareMuti"
            v-if="!isSimple"
            icon="el-icon-share"
          >
            {{ $translator({ cn: "分享", en: "Share" }) }}
          </el-dropdown-item>

          <el-dropdown-item @click.native="Config" icon="el-icon-edit-outline">
            {{ $translator({ cn: "配置", en: "Config" }) }}
          </el-dropdown-item>

          <el-dropdown-item
            style="color: red"
            @click.native="Delete"
            divided
            icon="el-icon-delete"
          >
            {{ $translator({ cn: "删除", en: "Delete" }) }}
          </el-dropdown-item>

          <el-dropdown-item
            @click.native="openWebURL"
            icon="el-icon-top-right"
            v-if="hasOpenURL()"
          >
            {{ $translator({ cn: "打开官网", en: "OpenURL" }) }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-collapse-transition>
      <div v-show="!isCollapsed || isSimple">
        <div
          v-if="isSimple"
          style="
            height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <div>
            <el-switch
              v-model="subscribe_item_info.enabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="ChangeAllNodeStatus"
            >
            </el-switch>
            <el-divider direction="vertical"></el-divider>
            {{ subscribe_item_info["outbounds"].length }}
            <el-divider direction="vertical"></el-divider>
            <span style="color: grey">
              {{ LastUpdateTime() }}
            </span>
          </div>
          <div v-if="isShowExtra()">
            <div style="display: flex; justify-content: space-between">
              <div>{{ BuildExpireDate() }}</div>
              <div>{{ BuildTraffic() }}</div>
            </div>

            <el-progress :percentage="BuildPercent()"></el-progress>
          </div>
        </div>

        <out_table
          :outbound_list="subscribe_item_info.outbounds"
          :isSub="true"
          v-else
        />
      </div>
    </el-collapse-transition>
  </el-card>
</template>

<script>
import { formatTime, ParseTraffic } from "@/utils/index.js";
import { mapState, mapActions } from "vuex";
import detail from "./detail.vue";
import out_table from "@/uif_views/outbounds/my_servers/out_table.vue";
import uif_store from "@/store/uif/uif";
import moment from "moment";

export default {
  name: "subscribe_item",
  props: ["subscribe_item_info"],
  components: { detail, out_table },
  data() {
    return {
      show_detail: false,
      viewerText: "",
      isLoading: false,
      isCollapsed: false,
    };
  },
  mounted() {
    this.isCollapsed = this.subscribe_item_info["isCollapsed"];
  },
  computed: {
    ...mapState(["config", "uif"]),
    isSimple() {
      return this.uif.config.simplified.enabled;
    },
  },

  methods: {
    ...mapActions({
      SaveUIFConfig: "uif/SaveUIFConfig",
      ApplyCoreConfig: "uif/ApplyCoreConfig",
      UpdateSub: "uif/UpdateSub",
    }),
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
      this.subscribe_item_info["isCollapsed"] = this.isCollapsed;
      this.SaveUIFConfig();
    },
    BuildTraffic() {
      var extra = this.subscribe_item_info["extra"];
      return (
        ParseTraffic(
          extra["traffic"]["upload"] + extra["traffic"]["download"],
        ) +
        " / " +
        ParseTraffic(extra["traffic"]["total"])
      );
    },
    BuildExpireDate() {
      var expire = this.subscribe_item_info["extra"]["traffic"]["expire"];
      if (expire == 0) {
        return "-";
      }
      return moment.unix(expire).format("YYYY-MM-DD");
    },
    BuildPercent() {
      var extra = this.subscribe_item_info["extra"];
      if (this.isShowExtra()) {
        var p =
          (extra["traffic"]["upload"] + extra["traffic"]["download"]) /
          extra["traffic"]["total"];
        p = parseFloat(p) * 100;
        return parseInt(p);
      }
      return 0;
    },
    isShowExtra() {
      var extra = this.subscribe_item_info["extra"];
      if (
        extra != undefined &&
        extra != null &&
        extra["traffic"] != null &&
        extra["traffic"] != undefined &&
        extra["traffic"]["total"] != undefined &&
        extra["traffic"]["total"] != 0
      ) {
        return true;
      }
      return false;
    },
    hasOpenURL() {
      var extra = this.subscribe_item_info["extra"];
      if (
        extra != undefined &&
        extra != null &&
        extra["openWebURL"] != undefined &&
        extra["openWebURL"] != null &&
        extra["openWebURL"] != ""
      ) {
        return true;
      }
      return false;
    },
    LastUpdateTime() {
      return formatTime(this.subscribe_item_info.updateTime, "");
    },
    Config() {
      this.uif.subscribe.info = this.subscribe_item_info;
      this.uif.subscribe.isAdding = false;
      this.uif.subscribe.isOpenSub = true;
    },
    openWebURL() {
      window.open(this.subscribe_item_info["extra"]["openWebURL"], "_blank");
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
        if (this.isSimple && this.subscribe_item_info.enabled) {
          this.ChangeAllNodeStatus(true);
        } else {
          this.SaveUIFConfig();
        }
      }
      this.isLoading = false;
    },
    ShareMuti() {
      this.uif.share.isSingle = false;
      this.uif.share.info = this.subscribe_item_info;
      this.uif.share.isOpenShare = true;
    },
    SpeedTest() {
      uif_store.actions.TestNode(this.subscribe_item_info.outbounds);
    },
    ChangeAllNodeStatus(res) {
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
            message: $translator({ cn: "取消删除", en: "Delete aborted." }),
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
