<template>
  <div class="app-container">
    <div v-if="uif.config.simplified.enabled">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>
            {{ $translator({ cn: "订阅管理", en: "Subscriptions" }) }}
            <el-divider direction="vertical"></el-divider>
            {{ config.config.subscribe.length }}
          </span>

          <el-button
            style="float: right; margin-left: 10px; padding: 3px 0"
            type="text"
            icon="el-icon-circle-plus-outline"
            @click="AddNewSubcription"
          >
            {{ $translator({ cn: "添加", en: "Add" }) }}
          </el-button>
        </div>

        <el-empty
          :description="$translator({ cn: '没有订阅，请添加', en: 'None' })"
          v-if="config.config.subscribe.length == 0"
        ></el-empty>
        <el-row :gutter="5" v-else>
          <el-col
            v-for="item in config.config.subscribe"
            style="margin-top: 5px"
            :key="item.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <subscribe_item :subscribe_item_info="item" />
          </el-col>
        </el-row>
      </el-card>
    </div>

    <div>
      <div style="display: flex; justify-content: space-between">
        <el-checkbox-group
          v-model="uif.config.simplified.sortOpts"
          size="mini"
          @change="onSort()"
        >
          <el-checkbox-button
            :label="$translator({ cn: '按延迟排序', en: 'Sort By Delay' })"
            key="delay"
          ></el-checkbox-button>
          <el-checkbox-button
            :label="
              $translator({ cn: '过滤不可用', en: 'Only Show Available' })
            "
            key="available"
          ></el-checkbox-button>
        </el-checkbox-group>
      </div>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>
            {{ $translator({ cn: "节点选择", en: "All Nodes" }) }}
            <el-divider direction="vertical"></el-divider>
            {{ uif.clashProxies.show.length }}
          </span>

          <el-button
            style="float: right; margin-left: 10px; padding: 3px 0"
            type="text"
            icon="el-icon-refresh"
            @click="updateAllDalay"
          >
            {{ $translator({ cn: "测全部延迟", en: "Test All Delay" }) }}
          </el-button>
        </div>

        <el-empty
          :description="$translator({ cn: '没有可用节点', en: 'None' })"
          v-if="
            uif.clashProxies.show.length == 0 &&
            uif.config.clash.enabled &&
            uif.connection.coreStatus == 0 &&
            uif.connection.isConnected
          "
        ></el-empty>

        <el-empty
          :description="
            $translator({
              cn: 'Clash API 未启用（路由 -> 数据）',
              en: 'Clash API is Not Enabled (Route -> Status)',
            })
          "
          v-if="
            !uif.config.clash.enabled &&
            uif.connection.coreStatus == 0 &&
            uif.connection.isConnected
          "
        ></el-empty>

        <el-empty
          :description="
            $translator({
              cn: '内核未运行，请到主页查看更多信息',
              en: 'Core Is Not Running, Check More Info In Home Page.',
            })
          "
          v-if="uif.connection.coreStatus == 1 || !uif.connection.isConnected"
        ></el-empty>

        <el-row :gutter="5" v-else>
          <el-col
            v-for="item in uif.clashProxies.show"
            style="margin-top: 5px"
            :key="item.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <simple_out_card :node="item" />
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { newDefaultHttpOut } from "@/store/uif/config.js";
import { mapActions, mapState } from "vuex";
import simple_out_card from "./out_card.vue";
import subscribe_item from "../../outbounds/subscribe/item.vue";
import uif_store from "@/store/uif/uif";

export default {
  name: "simple_out",
  components: { simple_out_card, subscribe_item },
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
      SaveUIFConfig: "uif/SaveUIFConfig",
      AddNewSubcription: "uif/AddNewSubcription",
      SortClashProxyNode: "uif/SortClashProxyNode",
    }),
    hasTLS(item) {
      if (
        "transport" in item &&
        "tls" in item["transport"] &&
        item["transport"]["tls"]["enabled"]
      ) {
        return true;
      }

      return false;
    },
    parseDelay(item) {
      if ("history" in item && item["history"].length != 0) {
        return item["history"][0]["delay"];
      }
      return "";
    },
    onSort() {
      this.SaveUIFConfig();
      this.SortClashProxyNode();
    },
    updateAllDalay() {
      uif_store.actions.UpdateClashGroupDelay(this.uif.config.urlTest.testURL);
    },
    BuildAvailableNodes() {
      var all_out = [];
      for (var item in this.config.config.outbounds) {
        item = this.config.config.outbounds[item];
        if (item["enabled"]) {
          all_out.push(item);
        }
      }

      for (var i in this.config.config.subscribe) {
        i = this.config.config.subscribe[i];
        for (var j in i["outbounds"]) {
          j = i["outbounds"][j];
          if (j["enabled"]) {
            all_out.push(j);
          }
        }
      }
      console.log(all_out);
      if (all_out.length > 1) {
        return [
          { tag: "自动优选", delay: "10", protocol: "autoSelete" },
        ].concat(all_out);
      }
      return all_out;
    },
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
