<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          {{
            $translator({
              cn: "DNS 设置",
              en: "DNS Settings",
            })
          }}
        </span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                {{
                  $translator({
                    cn: "直连所用的DNS",
                    en: "DNS used by Direct",
                  })
                }}
              </div>
              <el-form-item
                :label="$translator({ cn: '本地 DNS', en: 'Local DNS' })"
              >
                <el-autocomplete
                  value-key="value"
                  v-model="uif.config.dnsAddress"
                  @select="SaveAndApply()"
                  @change="SaveAndApply()"
                  type="textarea"
                  :fetch-suggestions="queryLocalDNSList"
                  :placeholder="$translator({ cn: '必填', en: 'Required' })"
                ></el-autocomplete>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                {{
                  $translator({
                    cn: "被代理所用的DNS",
                    en: "DNS used by Proxy",
                  })
                }}
              </div>
              <el-form-item
                :label="$translator({ cn: '远程 DNS', en: 'Remote DNS' })"
              >
                <el-autocomplete
                  value-key="value"
                  v-model="uif.config.remoteDNSAddress"
                  @select="SaveAndApply()"
                  @change="SaveAndApply()"
                  type="textarea"
                  :fetch-suggestions="queryRemoteDNSList"
                  :placeholder="$translator({ cn: '必填', en: 'Required' })"
                ></el-autocomplete>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                {{
                  $translator({
                    cn: "根据域名的实际 IP 来分流，大大提高分流精度",
                    en: "Use its IP of domain to improve route acurative.",
                  })
                }}
              </div>
              <el-form-item
                :label="$translator({ cn: '精确分流', en: 'IP Rules' })"
              >
                <el-select
                  v-model="uif.config.subnet.ip_mode_local"
                  @change="SaveAndApply()"
                >
                  <el-option
                    :label="
                      $translator({
                        cn: '本地 DNS（可能会泄露）',
                        en: 'Local DNS(May Leak)',
                      })
                    "
                    value="local"
                  ></el-option>
                  <el-option
                    :label="
                      $translator({
                        cn: '带 ECS 的远程 DNS',
                        en: 'Remote DNS with ECS',
                      })
                    "
                    value="remote_without_ecs"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          {{
            $translator({
              cn: "路由设置",
              en: "Default Rules",
            })
          }}
        </span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                当你发起一个网络请求<br />UIF 会识别这个请求的类型<br />然后根据这个设置决定是否需要走代理
              </div>
              <el-form-item
                :label="$translator({ cn: '分流策略', en: 'Type' })"
              >
                <el-select
                  v-model="uif.config.routeType"
                  @change="SaveAndApply()"
                >
                  <el-option
                    :label="
                      $translator({ cn: '国内直连，国外代理', en: 'Rule' })
                    "
                    value="route"
                  ></el-option>
                  <el-option
                    :label="$translator({ cn: '全部代理', en: 'Proxy' })"
                    value="proxy"
                  ></el-option>
                  <el-option
                    :label="$translator({ cn: '全部直连', en: 'Direct' })"
                    value="freedom"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                {{
                  $translator({
                    cn: "优先使用哪种 IP",
                    en: "IPv4 or IPv6",
                  })
                }}
              </div>
              <el-form-item
                :label="$translator({ cn: 'IP 策略', en: 'IP Type' })"
              >
                <el-select v-model="uif.config.ipType" @change="SaveAndApply()">
                  <!-- <el-option -->
                  <!--   :label=" -->
                  <!--     $translator({ -->
                  <!--       cn: '只用 IPv4', -->
                  <!--       en: 'Only IPv4', -->
                  <!--     }) -->
                  <!--   " -->
                  <!--   value="ipv4_only" -->
                  <!-- ></el-option> -->

                  <el-option
                    :label="
                      $translator({
                        cn: 'IPv4 优先',
                        en: 'Prefer IPv4',
                      })
                    "
                    value="prefer_ipv4"
                  ></el-option>

                  <el-option
                    :label="
                      $translator({
                        cn: 'IPv6 优先',
                        en: 'Prefer IPv6',
                      })
                    "
                    value="prefer_ipv6"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                {{
                  $translator({
                    cn: "用 Adguard 规则屏蔽广告",
                    en: "Use Adguard Rule to block ads",
                  })
                }}
              </div>
              <el-form-item
                :label="$translator({ cn: 'Adguard', en: 'Adguard' })"
              >
                <el-switch
                  v-on:change="SaveAndApply()"
                  v-model="uif.config.useAdguardRule"
                >
                </el-switch>
              </el-form-item>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          {{
            $translator({
              cn: "自定义分流",
              en: "Custom Rules",
            })
          }}
        </span>
        <el-button
          style="float: right; margin-left: 10px; padding: 3px 0"
          type="text"
          icon="el-icon-circle-plus-outline"
          v-on:click="Add()"
        >
          {{ $translator({ cn: "添加", en: "Add" }) }}
        </el-button>
      </div>

      <el-table
        :data="config.config.routes"
        stripe
        style="width: 100%; height: 100%"
      >
        <el-table-column
          :label="$translator({ cn: '名称', en: 'Name' })"
          sortable
          align="center"
          prop="tag"
        >
        </el-table-column>

        <el-table-column
          :label="$translator({ cn: '出口', en: 'Outbound' })"
          width="200"
          sortable
          align="center"
        >
          <template slot-scope="scope">
            <el-tag effect="dark" :type="OutTagColor(scope.row)">
              {{ ShowOutboud(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="domains"
          :label="$translator({ cn: '规则', en: 'Rule' })"
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

        <el-table-column
          :label="$translator({ cn: '操作', en: 'Action' })"
          align="center"
        >
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
import {
  newDefaultRoute,
  FindOutByID,
  FindInByID,
} from "@/store/uif/config.js";
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
    Add() {
      this.uif.route.all_list = this.config.config.routes;
      this.uif.route.info = newDefaultRoute();
      this.uif.route.isAdding = true;
      this.uif.route.isOpen = true;
    },
    SaveAndApply() {
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
        "source_ip_cidr",
        "auth_user",
        "domain_suffix",
        "domain_keyword",
        "domain_regex",
        "ip_cidr",
        "geosite",
        "geoip",
        "protocol",
        "network",
        "inbound",
        "process_name",
        "port",
      ];
      for (var item in itemList) {
        item = itemList[item];
        if (!(item in row)) {
          continue;
        }
        var temp = row[item];
        if (temp.length == 0) {
          continue;
        }
        var show = temp.join(", ");
        if (item == "inbound") {
          show = [];
          for (var item2 in temp) {
            var t = FindInByID(temp[item2]);
            if (t != null) {
              show.push(t["tag"]);
            }
          }
        }
        res.push({ key: i, abbr: item + ": " + show });
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
