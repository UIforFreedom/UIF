<template>
  <div class="app-container">
    <el-row :gutter="5">
      <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
        <div
          id="CPU"
          style="
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
          "
        />
      </el-col>

      <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
        <div
          id="Memory"
          style="
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
          "
        />
      </el-col>
    </el-row>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Clash API</span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                开启 Clash API 统计<br />影响性能，非必要不开启
              </div>
              <el-form-item label="开启">
                <el-switch
                  v-model="uif.config.clash.enabled"
                  v-on:change="Save()"
                >
                </el-switch>
              </el-form-item>
            </el-tooltip>
          </el-col>
        </el-row>

        <el-row :gutter="5" v-if="uif.config.clash.enabled">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="监听地址">
              <el-select v-model="uif.config.clash.apiIP" v-on:change="Save()">
                <el-option
                  :label="
                    Translator({ cn: '公网(0.0.0.0)', en: 'Public(0.0.0.0)' })
                  "
                  value="0.0.0.0"
                ></el-option>
                <el-option
                  :label="
                    Translator({
                      cn: '本地(127.0.0.1)',
                      en: 'Locol(127.0.0.1)',
                    })
                  "
                  value="127.0.0.1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item :label="Translator({ cn: '端口', en: 'Port' })">
              <el-input
                v-model.number="uif.config.clash.apiPort"
                :placeholder="Translator({ cn: '必填', en: 'Required' })"
                v-on:change="Save()"
                type="number"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="接口密码">
              <el-input
                placeholder="选填"
                v-model="uif.config.clash.apiKey"
                v-on:change="Save()"
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
import * as echarts from "echarts";
import { mapActions, mapState } from "vuex";
import { ParseTraffic } from "@/utils/index.js";

export default {
  name: "routing_list",
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapState(["config", "uif"]),
    memory_chart() {
      return;
    },
  },
  watch: {
    "uif.connection.system_info": {
      handler(newValue) {
        this.UpdateChart(
          "Memory",
          this.uif.connection.system_info.memory.used,
          this.uif.connection.system_info.memory.available,
        );

        var cpu_usage = this.uif.connection.system_info.cpu_usage[0];
        this.UpdateChart("CPU", cpu_usage, 100 - cpu_usage);
      },
    },
  },
  mounted() {
    this.GetUIFConfig();

    this.UpdateChart(
      "Memory",
      this.uif.connection.system_info.memory.used,
      this.uif.connection.system_info.memory.available,
    );
    this.UpdateChart(
      "CPU",
      this.uif.connection.system_info.memory.used,
      this.uif.connection.system_info.memory.available,
    );
  },
  created() {},
  methods: {
    ...mapActions({
      GetUIFConfig: "uif/GetUIFConfig",
      ApplyCoreConfig: "uif/ApplyCoreConfig",
      SaveUIFConfig: "uif/SaveUIFConfig",
    }),
    Translator(i) {
      return i[this.uif.config.lang];
    },
    Save() {
      this.uif.config.clash.apiAddress =
        "http://" +
        this.uif.config.clash.apiIP +
        ":" +
        this.uif.config.clash.apiPort;

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
    UpdateChart(name, value1, value2) {
      var chart = echarts.init(document.getElementById(name));
      chart.setOption({
        title: {
          text: name,
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "Type",
            type: "pie",
            radius: "50%",
            data: [
              {
                value: value1,
                name: "已用",
              },
              {
                value: value2,
                name: "未用",
              },
            ],
            label: {
              normal: {
                formatter: "{d}%",
              },
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
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
