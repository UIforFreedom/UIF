<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Profiles 配置</span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="4">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                开启 Clash API 统计<br />会消耗一定的性能
              </div>
              <el-form-item label="开启">
                <el-switch
                  v-model="uif.config.clash.enabled"
                  v-on:change="SaveUIFConfig()"
                >
                </el-switch>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="接口地址">
              <el-input
                placeholder="开启必填"
                v-model="uif.config.clash.apiAddress"
                v-on:change="SaveUIFConfig()"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="接口密码">
              <el-input
                placeholder="留空为UIF密码"
                v-model="uif.config.clash.apiKey"
                v-on:change="SaveUIFConfig()"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          活动链接
          <el-divider direction="vertical"></el-divider>
          {{ InitConnection().connections.length }}
          <el-divider direction="vertical"></el-divider>
          总流量： {{ BuildTotal(InitConnection().uploadTotal) }} /
          {{ BuildTotal(InitConnection().downloadTotal) }}
          <el-divider direction="vertical"></el-divider>
          内存：{{ BuildTotal(InitConnection().memory) }}
        </span>
      </div>

      <el-table
        :data="uif.clashConnection.connections"
        stripe
        style="width: 100%; height: 100%"
        :max-height="500"
      >
        <el-table-column label="入站" sortable align="center" min-width="200">
          <template slot-scope="scope">
            {{ BuildInbound(scope.row) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="domains"
          label="信息"
          min-width="200"
          sortable
          align="center"
        >
          <template slot-scope="scope">
            {{ BuildInfo(scope.row) }}
          </template>
        </el-table-column>

        <el-table-column
          label="上传/下载"
          sortable
          align="center"
          min-width="100"
        >
          <template slot-scope="scope">
            {{ BuildTraffic(scope.row) }}
          </template>
        </el-table-column>

        <el-table-column label="路由" sortable align="center" min-width="320">
          <template slot-scope="scope">
            {{ BuildOutboud(scope.row) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { ParseTraffic } from "@/utils/index.js";
import axios from "axios";

export default {
  name: "routing_list",
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapState(["config", "uif"]),
  },
  mounted() {
    this.GetUIFConfig();
  },
  created() {},
  methods: {
    ...mapActions({
      GetUIFConfig: "uif/GetUIFConfig",
      ApplyCoreConfig: "uif/ApplyCoreConfig",
      SaveUIFConfig: "uif/SaveUIFConfig",
    }),
    Save() {
      this.SaveUIFConfig();
      this.ApplyCoreConfig();
    },
    HandleDetail(index, row) {},
    BuildTraffic(row) {
      return (
        ParseTraffic(row["upload"]) + " / " + ParseTraffic(row["download"])
      );
    },
    BuildOutboud(row) {
      var chains = row["chains"];
      var res = row["rule"];
      res += " => " + chains[0];
      return res;
    },
    BuildTotal(value) {
      if (value == undefined) {
        return "";
      }
      return ParseTraffic(value);
    },
    InitConnection() {
      if ("connections" in this.uif.clashConnection) {
        return this.uif.clashConnection;
      }
      return { connections: [], downloadTotal: 0, uploadTotal: 0, memory: 0 };
    },
    BuildInbound(row) {
      return row["metadata"]["type"];
    },
    BuildInfo(row) {
      var metadata = row["metadata"];
      var res = "";
      var host = metadata["host"];
      if (host != "" && host != undefined) {
        res += host;
      } else {
        var destinationIP = metadata["destinationIP"];
        if (destinationIP != "" && destinationIP != undefined) {
          res += destinationIP;
        }
      }
      var destinationPort = metadata["destinationPort"];
      if (destinationPort != "" && destinationPort != undefined) {
        res += ":" + destinationPort;
      }
      return res;
    },
  },
};
</script>

<style>
.group-card .el-card__header {
  padding: 8px 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
/* <el-card> */
/*   <div slot="header" class="clearfix"> */
/*     <span>分组</span> */
/*   </div> */
/*   <el-row :gutter="5" class="group-card"> */
/*     <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="4"> */
/*       <el-card class="box-card"> */
/*         <div slot="header" class="clearfix"> */
/*           <span>分组</span> */
/*         </div> */
/*         sdfasdf */
/*       </el-card> */
/*     </el-col> */
/*   </el-row> */
/* </el-card> */
</style>
