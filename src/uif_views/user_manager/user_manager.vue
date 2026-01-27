<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          服务器
          <el-divider direction="vertical"></el-divider>
          {{ BuildTotalOnline() }}/{{ uif.user_manager.nodesList.length }}
          <el-divider direction="vertical"></el-divider>
          {{ BuildTotal(false) }}
          <el-divider direction="vertical"></el-divider>
          {{ BuildTotal(true) }}
        </span>

        <el-button
          style="float: right; margin-left: 10px; padding: 3px 0"
          @click="FlushNodes()"
          type="text"
          >{{ $translator({ cn: "刷新", en: "Flush" }) }}</el-button
        >

        <el-button
          style="float: right; margin-left: 10px; padding: 3px 0"
          @click="AddNode()"
          type="text"
          >{{ $translator({ cn: "添加", en: "Add" }) }}</el-button
        >
      </div>

      <el-table
        height="500"
        :data="uif.user_manager.nodesList"
        stripe
        style="width: 100%"
        ref="filterTable"
      >
        <el-table-column
          :label="$translator({ cn: '启用', en: 'Enabled' })"
          min-width="50"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              @click.native="enableUserOrNode(scope.row, 'node')"
              v-model="scope.row.enabled"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </template>
        </el-table-column>

        <!-- <el-table-column label="测试" min-width="80" align="center" sortable> -->
        <!--   <template slot-scope="scope"> -->
        <!--     {{ localTest(scope.row) }} -->
        <!--   </template> -->
        <!-- </el-table-column> -->

        <el-table-column
          prop="name"
          :label="$translator({ cn: '名字', en: 'Name' })"
          min-width="150"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            {{ scope.row.alias }}
            {{ scope.row.name }}({{ scope.row.ipv4_address }})
          </template>
        </el-table-column>

        <el-table-column
          prop="online_user"
          :label="$translator({ cn: '在线', en: 'Proxy' })"
          min-width="40"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            {{ scope.row.online_user }}/{{ scope.row.allocated_user }}
          </template>
        </el-table-column>

        <el-table-column
          :label="$translator({ cn: '流量', en: 'Path' })"
          min-width="75"
          prop="week_traffic"
          :sort-method="SortServerTraffic"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            <el-tag
              effect="plain"
              class="type_tag"
              type="info"
              disable-transitions
              >{{ BuildTraffic(scope.row.week_traffic) }}</el-tag
            >
            <el-tag
              effect="plain"
              class="type_tag"
              type="info"
              disable-transitions
              >{{ BuildTraffic(scope.row.total_traffic) }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column
          label="最后更新"
          prop="last_seen_at"
          min-width="80"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            {{ ParseTime(scope.row.last_seen_at) }}
          </template>
        </el-table-column>

        <el-table-column
          label="创建"
          min-width="80"
          align="center"
          sortable
          prop="create_at"
        >
          <template slot-scope="scope">
            {{ ParseTime(scope.row.create_at) }}
          </template>
        </el-table-column>

        <el-table-column
          :label="$translator({ cn: '操作', en: 'Action' })"
          width="90"
          align="center"
        >
          <template slot-scope="scope">
            <el-dropdown trigger="click">
              <el-button type="primary" size="mini">
                {{ $translator({ cn: "操作", en: "Action" }) }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  icon="el-icon-edit-outline"
                  @click.native="handleNodeDetail(scope.row)"
                  >{{
                    $translator({ cn: "配置", en: "Config" })
                  }}</el-dropdown-item
                >

                <el-dropdown-item
                  icon="el-icon-refresh"
                  @click.native="Dispach(scope.row, 'DispachNode')"
                  >{{
                    $translator({ cn: "重新分配", en: "Config" })
                  }}</el-dropdown-item
                >

                <el-dropdown-item
                  icon="el-icon-delete"
                  @click.native="Delete(scope.row, 'nodes')"
                  >{{
                    $translator({ cn: "删除", en: "Config" })
                  }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          订阅
          <el-divider direction="vertical"></el-divider>
          {{ todayOnlineUser }} / {{ validUserCount }}
        </span>
        <div class="user-header-controls">
          <el-checkbox-group
            v-model="sortFilters"
            size="mini"
            @change="handleSortFiltersChange"
            class="hdr-checks"
          >
            <el-checkbox label="valid">按状态</el-checkbox>
            <el-checkbox label="traffic">按流量</el-checkbox>
          </el-checkbox-group>
          <el-input
            v-model="seaIDKey"
            class="hdr-input"
            size="mini"
            clearable
            placeholder="搜索 Key"
          />
          <el-input
            v-model="searchNameKey"
            class="hdr-input"
            size="mini"
            clearable
            placeholder="搜索 Name"
          />
          <el-button
            class="hdr-btn"
            @click="AddUser()"
            type="text"
            >{{ $translator({ cn: "添加", en: "Run Testing" }) }}</el-button
          >
          <el-button
            class="hdr-btn"
            @click="FlushUsers()"
            type="text"
            >{{ $translator({ cn: "刷新", en: "Run Testing" }) }}</el-button
          >
        </div>
      </div>

      <el-table
        :data="PagedUsers"
        stripe
        style="width: 100%"
        height="500"
        ref="filterTable"
        @sort-change="handleSortChange"
      >
        <el-table-column
          :label="$translator({ cn: '启用', en: 'Enabled' })"
          min-width="50"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              @click.native="enableUserOrNode(scope.row, 'user')"
              v-model="scope.row.enabled"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column
          label="状态"
          min-width="60"
          align="center"
          prop="valid"
        >
          <template slot-scope="scope">
            <el-tag
              effect="plain"
              class="type_tag"
              :type="IsUserTimeout(scope.row) ? 'danger' : 'success'"
              disable-transitions
              >{{ IsUserTimeout(scope.row) ? "到期" : "可用" }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column
          prop="name"
          :label="$translator({ cn: '名字', en: 'Name' })"
          min-width="150"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>

        <el-table-column
          :label="$translator({ cn: '流量', en: 'Path' })"
          min-width="75"
          align="center"
          prop="traffic_balance"
        >
          <template slot-scope="scope">
            <el-tag
              effect="plain"
              class="type_tag"
              type="info"
              disable-transitions
              >{{ BuildTraffic(scope.row.traffic_balance) }}</el-tag
            >
            <el-tag
              effect="plain"
              class="type_tag"
              type="info"
              disable-transitions
              >{{ BuildTraffic(scope.row.init_traffic) }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column
          label="最后在线"
          min-width="80"
          align="center"
          :sort-method="SortOnline"
        >
          <template slot-scope="scope">
            {{ ParseTime(scope.row.last_seen_at) }}
            {{ ParseTodayTraffic(scope.row) }}
          </template>
        </el-table-column>

        <el-table-column label="到期" min-width="80" align="center" >
          <template slot-scope="scope">
            {{ ParseTime(scope.row.expires_at) }}
          </template>
        </el-table-column>

        <el-table-column
          :label="$translator({ cn: '操作', en: 'Action' })"
          width="90"
          align="center"
        >
          <template slot-scope="scope">
            <el-dropdown trigger="click">
              <el-button type="primary" size="mini">
                {{ $translator({ cn: "操作", en: "Action" }) }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  icon="el-icon-edit-outline"
                  @click.native="handleUserDetail(scope.row)"
                  >{{
                    $translator({ cn: "配置", en: "Config" })
                  }}</el-dropdown-item
                >

                <el-dropdown-item
                  icon="el-icon-refresh"
                  @click.native="Dispach(scope.row, 'DispachUser')"
                  >{{
                    $translator({ cn: "重新分配", en: "Config" })
                  }}</el-dropdown-item
                >

                <el-dropdown-item
                  icon="el-icon-document-copy"
                  @click.native="CopyShare(scope.row)"
                  >{{
                    $translator({ cn: "复制订阅", en: "Config" })
                  }}</el-dropdown-item
                >

                <el-dropdown-item
                  icon="el-icon-delete"
                  @click.native="Delete(scope.row, 'users')"
                  >{{
                    $translator({ cn: "删除", en: "Config" })
                  }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px; text-align: right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalUsersCount"
        >
        </el-pagination>
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>配置</span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="开启 SSM">
              <el-switch
                v-model="uif.config.ssm.enabled"
                @change="SaveAndApply()"
              >
              </el-switch>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="SSM 密码">
              <el-input
                v-model="uif.config.ssm.password"
                :placeholder="$translator({ cn: '必填', en: 'Required' })"
                v-on:change="SaveAndApply()"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="API 地址">
              <el-input
                v-model="uif.user_manager.apiAddress"
                :placeholder="$translator({ cn: '必填', en: 'Required' })"
                v-on:change="SaveList()"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item :label="$translator({ cn: '接口密码', en: 'Port' })">
              <el-input
                v-model="uif.user_manager.apiPwd"
                :placeholder="$translator({ cn: '必填', en: 'Required' })"
                v-on:change="SaveList()"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item :label="$translator({ cn: '间隔', en: 'Port' })">
              <el-input
                v-model.number="config.loop_gap"
                :placeholder="$translator({ cn: '必填', en: 'Required' })"
                v-on:change="FlushConfig(true)"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item :label="$translator({ cn: '倍率', en: 'Port' })">
              <el-input
                v-model="config.traffic_rate"
                :placeholder="$translator({ cn: '必填', en: 'Required' })"
                v-on:change="FlushConfig(true)"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item :label="$translator({ cn: '用法', en: 'Port' })">
              <el-input
                v-model="config.profile_url"
                :placeholder="$translator({ cn: '必填', en: 'Required' })"
                v-on:change="FlushConfig(true)"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item :label="$translator({ cn: '官网', en: 'Port' })">
              <el-input
                v-model="config.offical_domain"
                :placeholder="$translator({ cn: '必填', en: 'Required' })"
                v-on:change="FlushConfig(true)"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span> 域名 </span>

        <el-button
          style="float: right; margin-left: 10px; padding: 3px 0"
          @click="FlushDomain()"
          type="text"
          >{{ $translator({ cn: "刷新", en: "Run Testing" }) }}</el-button
        >

        <el-button
          style="float: right; margin-left: 10px; padding: 3px 0"
          @click="AddDomain()"
          type="text"
          >{{ $translator({ cn: "添加", en: "Run Testing" }) }}</el-button
        >
      </div>

      <el-table
        :data="uif.user_manager.domainList"
        stripe
        style="width: 100%"
        ref="filterTable"
      >
        <el-table-column
          :label="$translator({ cn: '启用', en: 'Enabled' })"
          min-width="50"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              @click.native="enableUserOrNode(scope.row, 'domain')"
              v-model="scope.row.enabled"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column
          prop="name"
          :label="$translator({ cn: '名字', en: 'Name' })"
          min-width="150"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            {{ scope.row.id }}({{ scope.row.name }})
          </template>
        </el-table-column>

        <el-table-column
          prop="used"
          :label="$translator({ cn: '使用量', en: 'Name' })"
          min-width="150"
          align="center"
        >
        </el-table-column>

        <el-table-column
          label="最后更新"
          min-width="80"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            {{ ParseTime(scope.row.last_seen_at) }}
          </template>
        </el-table-column>

        <el-table-column label="创建" min-width="80" align="center" sortable>
          <template slot-scope="scope">
            {{ ParseTime(scope.row.create_at) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="添加 / 修改节点"
      :visible.sync="uif.user_manager.isOpenAddNode"
      :fullscreen="true"
      v-if="uif.user_manager.isOpenAddNode"
    >
      <add_node />
    </el-dialog>

    <el-dialog
      title="添加 / 修改用户"
      :visible.sync="uif.user_manager.isOpenAddUser"
      :fullscreen="true"
      v-if="uif.user_manager.isOpenAddUser"
    >
      <add_user @saved="handleUserSaved" />
    </el-dialog>

    <el-dialog
      title="添加 / 修改域名"
      :visible.sync="uif.user_manager.isOpenAddDomain"
      :fullscreen="true"
      v-if="uif.user_manager.isOpenAddDomain"
    >
      <add_domain />
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { IsObject, ParseTraffic } from "@/utils/index.js";
import moment from "moment";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { DeepCopy } from "@/utils";
import Cookies from "js-cookie";

import add_node from "./add_node.vue";
import add_user from "./add_user.vue";
import add_domain from "./add_domain.vue";

export default {
  name: "routing_list",
  components: { add_node, add_user, add_domain },
  data() {
    return {
      USER_MANAGE_ADDRESS: "USER_MANAGE_address",
      USER_MANAGE_pwd: "USER_MANAGE_pwd",
      nodes_delay: {},
      totalUsersCount: 0,
      sortWithTraffic: false,
      sortWithValid: false,
      sortFilters: [],
      todayOnlineUser: 0,
      validUserCount: 0,
      isTrafficSort: false,
      config: {
        loop_gap: 60,
        traffic_rate: 1.2,
        profile_url: "",
        offical_domain: "",
      },
      seaIDKey: "",
      searchNameKey: "",
      currentPage: 1,
      pageSize: 10,
    };
  },
  watch: {
    seaIDKey() {
      this.currentPage = 1;
      this.FlushUsers();
    },
    searchNameKey() {
      this.currentPage = 1;
      this.FlushUsers();
    },
  },
  computed: {
    ...mapState(["uif"]),
    SearchID() {
      return this.uif.user_manager.usersList;
    },
    PagedUsers() {
      return this.SearchID;
    },
  },
  mounted() {
    var a = Cookies.get(this.USER_MANAGE_ADDRESS);
    if (a != null) {
      this.uif.user_manager.apiAddress = a;
    }
    var p = Cookies.get(this.USER_MANAGE_pwd);
    if (p != null) {
      this.uif.user_manager.apiPwd = p;
    }
    this.GetUIFConfig();
    this.FlushUsers();
    this.FlushNodes();
    this.FlushDomain();
    this.FlushConfig(false);
    this.FlushUsersTraffic();
    this.CountValidUsers();
  },
  methods: {
    ...mapActions({
      GetUIFConfig: "uif/GetUIFConfig",
      ApplyCoreConfig: "uif/ApplyCoreConfig",
      SaveUIFConfig: "uif/SaveUIFConfig",
    }),
    SaveAndApply() {
      this.SaveUIFConfig();
      this.ApplyCoreConfig();
    },
    handleUserDetail(row) {
      this.AddUser();
      var G = 1000000000;
      G = 1073741824;
      this.uif.user_manager.info = DeepCopy(row);
      this.uif.user_manager.info.traffic_balance = parseFloat(
        (row.traffic_balance / G).toFixed(2),
      );
      this.uif.user_manager.info.init_traffic = row.init_traffic / G;
    },
    handleUserSaved() {
      this.FlushUsers();
    },
    handleNodeDetail(row) {
      this.AddNode();
      this.uif.user_manager.info = row;
    },
    SortOnline(a, b) {
      return a.last_seen_at - b.last_seen_at;
    },
    SortServerTraffic(a, b) {
      return a.week_traffic - b.week_traffic;
    },
    SortTrafficMost(a, b) {
      var t1 = a.init_traffic - a.traffic_balance;
      var t2 = b.init_traffic - b.traffic_balance;
      return t1 - t2;
    },
    ping(url) {
      const start = performance.now();
      return fetch(url, { method: "HEAD", mode: "no-cors" })
        .then(() => performance.now() - start)
        .catch(() => null);
    },
    localTest(row) {
      if (row.id in this.nodes_delay) {
        return parseInt(this.nodes_delay[row.id]);
      }
      return "";
    },
    CopyShare(row) {
      var r = `https://${row.domain_id}/p?k=${row.id}&t=clash#${encodeURIComponent(row.name)}`;
      var t = this;
      this.$copyText(r).then(
        function (e) {
          t.$message({
            showClose: true,
            message: "订阅 已复制到剪切板\n",
            type: "success",
          });
        },
        function (e) {},
      );
    },
    SaveList() {
      Cookies.set(this.USER_MANAGE_ADDRESS, this.uif.user_manager.apiAddress, {
        expires: 30,
      });
      Cookies.set(this.USER_MANAGE_pwd, this.uif.user_manager.apiPwd, {
        expires: 30,
      });
    },
    enableUserOrNode(row, method) {
      var e = "false";
      if (row.enabled == 1) {
        e = "true";
      }

      var t = this;
      const formData = new URLSearchParams();
      formData.append("key", this.uif.user_manager.apiPwd);
      formData.append("method", "EnableOrDisable");
      formData.append("id", row.id);
      formData.append("userOrNode", method);
      formData.append("enabled", e);
      axios
        .post(this.uif.user_manager.apiAddress, formData)
        .then((response) => {
          console.log(response);
          var data = response["data"];
        });
    },
    ParseTime(d) {
      return moment(d).fromNow();
    },
    ParseTodayTraffic(row) {
      if (row.id in this.uif.user_manager.usersTodayTrafficList) {
        var t = ParseTraffic(
          this.uif.user_manager.usersTodayTrafficList[row.id],
        );
        return `[${t}]`;
      }
      return "";
    },
    BuildTraffic(data) {
      return ParseTraffic(data);
    },
    IsTimeout(row) {
      return ParseTraffic(data);
    },
    BuildTotalOnline(data) {
      var k = "online_user";
      var res = 0;
      for (var item in this.uif.user_manager.nodesList) {
        item = this.uif.user_manager.nodesList[item];
        if (k in item) {
          res += item[k];
        }
      }
      return res;
    },
    BuildFreeOrPaid() {
      var p = 0;
      var f = 0;
      for (var item in this.uif.user_manager.usersList) {
        item = this.uif.user_manager.usersList[item];
        if (item["type"] != 0) {
          p += 1;
        } else {
          f += 1;
        }
      }
      return `${f}/${p}`;
    },
    IsUserTimeout(item) {
      if (item.traffic_balance < 0 || item.expires_at < moment().valueOf()) {
        return true;
      }
      return false;
    },
    AddNode() {
      var nodeInfo = {
        id: uuidv4(),
        name: "",
        alias: "",
        ipv4_address: "",
        ipv6_address: "",
        bind_address: "",
        bind_port: "",
        location: "",
        enabled: 1,
        node_type: 0,
        create_at: moment().valueOf(),
        last_seen_at: moment().valueOf(),
        total_traffic: 0,
        week_traffic: 0,
        online_user: 0,
        allocated_user: 0,
        api_address: "",
        uif_address: "",
        uif_key: "",
      };
      this.uif.user_manager.info = nodeInfo;
      this.uif.user_manager.isOpenAddNode = true;
    },
    AddNode() {
      var nodeInfo = {
        id: uuidv4(),
        name: "",
        ipv4_address: "",
        ipv6_address: "",
        bind_address: "",
        bind_port: "",
        location: "",
        enabled: 1,
        node_type: 0,
        create_at: moment().valueOf(),
        last_seen_at: moment().valueOf(),
        total_traffic: 0,
        week_traffic: 0,
        online_user: 0,
        api_address: "",
        uif_address: "",
        uif_key: "",
      };
      this.uif.user_manager.info = nodeInfo;
      this.uif.user_manager.isOpenAddNode = true;
    },
    AddDomain() {
      var nodeInfo = {
        id: "",
        name: "",
        enabled: 1,
        used: 0,
        create_at: moment().valueOf(),
        last_seen_at: moment().valueOf(),
      };
      this.uif.user_manager.info = nodeInfo;
      this.uif.user_manager.isOpenAddDomain = true;
    },
    AddUser() {
      var userInfo = {
        id: uuidv4(),
        name: "",
        domain_id: "",
        enabled: 1,
        user_type: 0,
        is_banned: 0,
        expires_at: moment().valueOf(),
        last_seen_at: moment().valueOf(),
        traffic_balance: 200,
        init_traffic: 200,
        ip: "",
        node_count: 2,
        prefer_location: "",
      };
      this.uif.user_manager.info = userInfo;
      this.uif.user_manager.isOpenAddUser = true;
    },
    BuildTotal(isWeek) {
      var k = "total_traffic";
      if (isWeek) {
        k = "week_traffic";
      }
      var res = 0;
      for (var item in this.uif.user_manager.nodesList) {
        item = this.uif.user_manager.nodesList[item];
        if (k in item) {
          res += item[k];
        }
      }
      return this.BuildTraffic(res);
    },
    FlushNodes() {
      var t = this;
      t.nodes_delay = {};
      t.uif.user_manager.nodesList = [];
      const formData = new URLSearchParams();
      formData.append("key", this.uif.user_manager.apiPwd);
      formData.append("method", "getAllNodes");
      axios
        .post(this.uif.user_manager.apiAddress, formData)
        .then((response) => {
          console.log(response);
          var data = response["data"];
          if ("status" in data && data["status"] == 0) {
            t.uif.user_manager.nodesList = data["res"];
            t.uif.user_manager.nodesList.reverse();
            t.FlushNodesDelay(t.uif.user_manager.nodesList);
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "更新服务器失败",
          });
        });
    },
    FlushNodesDelay(nodesList) {
      return;
      for (var item in nodesList) {
        item = nodesList[item];
        this.FlushNodesDelay2(item.api_address, item.id);
      }
    },
    FlushNodesDelay2(a, id) {
      var t = this;
      this.ping(`http://${a}:9191`)
        .then((response) => {
          t.$set(t.nodes_delay, id, response);
          console.log(t.nodes_delay);
        })
        .catch((err) => {
          t.$set(t.nodes_delay, id, -1);
        });
    },
    FlushUsers() {
      var t = this;
      t.uif.user_manager.usersList = [];
      const formData = new URLSearchParams();
      formData.append("key", this.uif.user_manager.apiPwd);
      formData.append("method", "getUsersBy");
        if (this.seaIDKey) {
          formData.append("id", this.seaIDKey);
        }
        if (this.searchNameKey) {
          formData.append("name", this.searchNameKey);
        }

        formData.append("limit", String(this.pageSize));
        if (this.sortWithValid) {
          formData.append("valid", "true");
        }
        if (this.sortWithTraffic) {
          formData.append("sort", "traffic");
        }
        formData.append(
          "offset",
          String((this.currentPage - 1) * this.pageSize),
        );

      axios
        .post(this.uif.user_manager.apiAddress, formData)
        .then((response) => {
          var data = response["data"];
          if ("status" in data && data["status"] == 0) {
            var l  = data["res"]
            console.log(l)
            t.uif.user_manager.usersList = l['list'];
            t.totalUsersCount = l.total;
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "更新用户失败",
          });
        });
    },
    handleSortChange(column) {
      if (column.prop === "traffic_balance") {
        this.sortWithTraffic = !!column.order;
      } else if (column.prop === "valid") {
        this.sortWithValid = !!column.order;
      } 
      this.updateSortFiltersFromFlags();
      this.currentPage = 1;
      this.FlushUsers();
    },
    handleSortFiltersChange(val) {
      this.sortWithValid = val.includes("valid");
      this.sortWithTraffic = val.includes("traffic");
      this.currentPage = 1;
      this.FlushUsers();
    },
    updateSortFiltersFromFlags() {
      var res = [];
      if (this.sortWithValid) {
        res.push("valid");
      }
      if (this.sortWithTraffic) {
        res.push("traffic");
      }
      this.sortFilters = res;
    },
    CountValidUsers() {
      const formData = new URLSearchParams();
      formData.append("key", this.uif.user_manager.apiPwd);
      formData.append("method", "countValidUsers");
      axios
        .post(this.uif.user_manager.apiAddress, formData)
        .then((response) => {
          var data = response["data"];
          if ("status" in data && data["status"] == 0) {
            this.validUserCount = data["res"];
          }
        })
        .catch((err) => {});
    },
    FlushUsersTraffic() {
      var t = this;
      const formData = new URLSearchParams();
      formData.append("key", this.uif.user_manager.apiPwd);
      formData.append("method", "countAllUsersTodayTraffic");
      axios
        .post(this.uif.user_manager.apiAddress, formData)
        .then((response) => {
          var data = response["data"];
          if ("status" in data && data["status"] == 0) {
            var temp = data["res"];
            t.uif.user_manager.usersTodayTrafficList = temp;
            t.todayOnlineUser = Object.keys(temp).length;
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "更新流量失败",
          });
        });
    },
    FlushDomain() {
      var t = this;
      const formData = new URLSearchParams();
      formData.append("key", this.uif.user_manager.apiPwd);
      formData.append("method", "getAllDomains");
      axios
        .post(this.uif.user_manager.apiAddress, formData)
        .then((response) => {
          console.log(response);
          var data = response["data"];
          if ("status" in data && data["status"] == 0) {
            t.uif.user_manager.domainList = data["res"];
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "更新域名失败",
          });
        });
    },
    FlushConfig(isUpdate) {
      if (this.uif.user_manager.apiPwd == "") {
        return;
      }
      var t = this;
      const formData = new URLSearchParams();
      formData.append("key", this.uif.user_manager.apiPwd);
      if (isUpdate) {
        formData.append("method", "updateConfig");
        this.config.traffic_rate = parseFloat(this.config.traffic_rate);
        formData.append("c", JSON.stringify(this.config));
      } else {
        formData.append("method", "getConfig");
      }
      axios
        .post(this.uif.user_manager.apiAddress, formData)
        .then((response) => {
          console.log(response);
          var data = response["data"];
          if ("status" in data && data["status"] == 0) {
            if (!isUpdate) {
              t.config = data["res"];
            }
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "更新域名失败",
          });
        });
    },
    Dispach(row, method) {
      const formData = new URLSearchParams();
      formData.append("key", this.uif.user_manager.apiPwd);
      formData.append("method", method);
      formData.append("id", row.id);
      axios
        .post(this.uif.user_manager.apiAddress, formData)
        .then((response) => {
          console.log(response);
          var data = response["data"];
          this.$message({
            message: "更新成功",
          });
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: "更新失败",
          });
        });
    },
    Delete(row, table) {
      const formData = new URLSearchParams();
      formData.append("key", this.uif.user_manager.apiPwd);
      formData.append("method", "Delete");
      formData.append("table", table);
      formData.append("id", row.id);

      axios
        .post(this.uif.user_manager.apiAddress, formData)
        .then((response) => {
          console.log(response);
          var data = response["data"];
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: "更新失败",
          });
        });
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
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.FlushUsers();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.FlushUsers();
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
.user-header-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}
.user-header-controls .hdr-input {
  width: 200px;
}
.user-header-controls .hdr-btn {
  padding: 3px 0;
}
.user-header-controls .hdr-checks {
  display: inline-flex;
}
@media (max-width: 768px) {
  .user-header-controls {
    justify-content: space-between;
    gap: 6px;
  }
  .user-header-controls .hdr-input {
    flex: 1 1 140px;
    min-width: 140px;
  }
  .user-header-controls .hdr-checks {
    flex: 1 1 160px;
  }
  .user-header-controls .hdr-btn {
    flex: 0 0 auto;
  }
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
</style>
