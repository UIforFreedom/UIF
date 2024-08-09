<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>域名/IP 分流设置</span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                当你发起一个网络请求<br />UIF 会识别这个请求的类型<br />然后根据这个设置决定是否需要走代理
              </div>
              <el-form-item label="分流策略">
                <el-select v-model="uif.config.routeType" @change="Save()">
                  <el-option
                    label="国内直连，国外代理"
                    value="route"
                  ></el-option>
                  <el-option label="全部代理" value="proxy"></el-option>
                  <el-option label="全部直连" value="freedom"></el-option>
                </el-select>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">所使用DNS服务器</div>
              <el-form-item label="本地 DNS">
                <el-autocomplete
                  value-key="value"
                  v-model="uif.config.dnsAddress"
                  @select="Save()"
                  @change="Save()"
                  type="textarea"
                  :fetch-suggestions="queryLocalDNSList"
                  placeholder="请输入内容"
                ></el-autocomplete>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">所使用DNS服务器</div>
              <el-form-item label="远程 DNS">
                <el-autocomplete
                  value-key="value"
                  v-model="uif.config.remoteDNSAddress"
                  @select="Save()"
                  @change="Save()"
                  type="textarea"
                  :fetch-suggestions="queryRemoteDNSList"
                  placeholder="请输入内容"
                ></el-autocomplete>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                {{
                  Translator({
                    cn: "本机IP归属地，提高分流精度",
                    en: "Local IP Address. May improve route rule acurative.",
                  })
                }}
              </div>
              <el-form-item
                :label="Translator({ cn: '本地子网', en: 'Subnet' })"
              >
                <el-autocomplete
                  value-key="value"
                  v-model="uif.config.subnet.client"
                  @select="Save()"
                  @change="Save()"
                  :fetch-suggestions="querySubnet"
                  placeholder="选填"
                >
                  <template slot-scope="{ item }">
                    <span class="addr">{{ item.label }}</span>
                  </template>
                </el-autocomplete>
              </el-form-item>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>自定义 域名/IP 策略</span>
        <el-button
          style="float: right; margin-left: 10px; padding: 3px 0"
          type="text"
          v-on:click="Add()"
          >添加</el-button
        >
      </div>

      <el-table
        :data="config.config.routes"
        stripe
        style="width: 100%; height: 100%"
      >
        <el-table-column label="名称" sortable align="center" prop="tag">
        </el-table-column>

        <el-table-column label="出口" width="200" sortable align="center">
          <template slot-scope="scope">
            <el-tag effect="dark" :type="OutTagColor(scope.row)">
              {{ ShowOutboud(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="domains"
          label="规则"
          min-width="400"
          sortable
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              effect="plain"
              type="info"
              disable-transitions
              v-for="item in RulesAbbr(scope.row)"
              :key="item.key"
            >
              {{ item.abbr }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="info"
              @click="HandleDetail(scope.$index, scope.row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <routing_info />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import routing_info from "./route_info.vue";
import { newDefaultRoute, FindOutByID } from "@/store/uif/config.js";
import { DeepCopy } from "@/utils";

export default {
  name: "routing_list",
  components: { routing_info },
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
    querySubnet(_, cb) {
      cb(this.uif.subNetList);
    },
    Translator(i) {
      return i[this.uif.config.lang];
    },
    Add() {
      this.uif.route.all_list = this.config.config.routes;
      this.uif.route.info = newDefaultRoute();
      this.uif.route.isAdding = true;
      this.uif.route.isOpen = true;
    },
    Save() {
      this.SaveUIFConfig();
      this.ApplyCoreConfig();
    },
    ShowOutboud(row) {
      if ("id" in row) {
        var id = row["id"][row["id"].length - 1];
        var out = FindOutByID(id);
        if (out != null) {
          var res = out["core_tag"];
          if (res == "") {
            res = out["tag"];
          }
          return res;
        }
        return id;
      }
      return row["outbound"];
    },
    HandleDetail(index, row) {
      this.uif.route.all_list = this.config.config.routes;
      this.uif.route.index = index;
      this.uif.route.info = DeepCopy(row);
      this.uif.route.isAdding = false;
      this.uif.route.isOpen = true;
    },
    OutTagColor(row) {
      var out = this.ShowOutboud(row);
      if (out == "block") {
        return "warning";
      } else if (out == "freedom") {
        return "success";
      }
    },
    RulesAbbr(row) {
      var res = [];
      var i = 0;
      var itemList = [
        "domain",
        "domain_suffix",
        "domain_keyword",
        "domain_regex",
        "ip_cidr",
        "geosite",
        "geoip",
        "protocol",
        "network",
        "process_name",
        "port",
      ];
      for (var item in itemList) {
        if (!(item in itemList)) {
          continue;
        }
        var temp = row[itemList[item]];
        if (temp.length == 0) {
          continue;
        }
        res.push({ key: i, abbr: itemList[item] + ": " + temp.join(", ") });
        i += 1;
      }
      return res;
    },
    queryLocalDNSList(_, cb) {
      cb(this.uif.dnsServer.localDNSList);
    },
    queryRemoteDNSList(_, cb) {
      cb(this.uif.dnsServer.remoteDNSList);
    },
  },
};
</script>
