<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>域名/IP 分流设置</span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
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

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" v-if="false">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                域名优先会尽量避免发起DNS请求，延迟低但精度低<br />IP优先会使用DNS解析IP，延迟高但精度高
              </div>
              <el-form-item label="匹配策略">
                <el-select v-model="uif.route.matchType">
                  <el-option label="域名优先" value="type_1"></el-option>
                  <el-option label="IP优先" value="type_4"></el-option>
                </el-select>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">所使用DNS服务器</div>
              <el-form-item label="DNS服务器">
                <el-autocomplete
                  value-key="value"
                  v-model="uif.config.dnsAddress"
                  @select="Save()"
                  @change="Save()"
                  type="textarea"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入内容"
                ></el-autocomplete>
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
            <el-tag effect="dark" :type="TagColor(scope.row)">
              {{ scope.row.outbound }}
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
import { newDefaultRoute } from "@/store/uif/config.js";

export default {
  name: "routing_list",
  components: { routing_info },
  data() {
    return {
      dnsList: [
        "udp://8.8.8.8",
        "udp://114.114.114.114",
        "tls://1.1.1.1",
        "dhcp://auto",
        "https://dns.alidns.com/dns-query",
        "https://doh.pub/dns-query",
        "https://1.12.12.12/dns-query",
      ],
    };
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
    HandleDetail(index, row) {
      this.uif.route.all_list = this.config.config.routes;
      this.uif.route.index = index;
      this.uif.route.info = row;
      this.uif.route.isAdding = false;
      this.uif.route.isOpen = true;
    },
    TagColor(row) {
      if (row.outbound == "block") {
        return "warning";
      } else if (row.outbound == "freedom") {
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
        "process_name",
        "port",
      ];
      for (var item in itemList) {
        var temp = row[itemList[item]];
        if (temp.length == 0) {
          continue;
        }
        res.push({ key: i, abbr: itemList[item] + ": " + temp.join(", ") });
        i += 1;
      }
      return res;
    },
    querySearch(queryString, cb) {
      var res = [];
      for (var item in this.dnsList) {
        res.push({ value: this.dnsList[item] });
      }
      cb(res);
    },
  },
};
</script>
