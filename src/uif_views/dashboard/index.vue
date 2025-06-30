<style>
.info {
  text-align: center;
}
.info .el-card__header {
  padding: 0;
  padding-top: 4px;
  padding-bottom: 4px;
}
.info_card {
  height: 100px;
  text-align: center;
}
#close:hover {
  color: black;
}
</style>

<template>
  <div class="app-container">
    <el-row :gutter="5" class="info" v-if="false">
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="info_card">
          <div slot="header">
            <i class="el-icon-film"></i>
            {{ $translator({ cn: "状态", en: "Status" }) }}
          </div>

          <el-tag :type="uif.connection.isConnected ? 'success' : 'danger'">
            {{
              uif.connection.isConnected
                ? $translator({ cn: "后端已连接", en: "Connected" })
                : $translator({ cn: "未连接", en: "Not Connected" })
            }}
            ({{ uif.connection.times }})
          </el-tag>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="info_card">
          <div slot="header">
            <i class="el-icon-odometer"></i>
            流量
          </div>
          下载: 100GB
          <br />
          上传: 100GB
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="info_card">
          <div slot="header">
            <i class="el-icon-connection"></i>
            连接数
          </div>

          Inbound: 6
          <br />
          Outbound: 6
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="info_card">
          <div slot="header">
            <i class="el-icon-c-scale-to-original"></i>
            内存
          </div>

          100 MB
        </el-card>
      </el-col>
    </el-row>

    <el-card class="box-card" v-loading="uif.connection.isConnecting">
      <div slot="header" class="clearfix">
        {{ $translator({ cn: "面板", en: "Home" }) }}
        <el-divider direction="vertical"></el-divider>
        {{ uif.connection.version }}
        <el-divider direction="vertical"></el-divider>
        <i
          class="el-icon-success"
          style="color: green"
          v-if="uif.connection.isConnected"
        >
          {{ uif.connection.times }}
        </i>
        <i
          class="el-icon-error"
          style="color: gray"
          v-if="!uif.connection.isConnected"
        >
          {{ $translator({ cn: "未连接", en: "Disconnected" }) }}
        </i>

        <el-switch
          style="float: right; margin-left: 10px; padding: 3px 0"
          v-model="uif.config.simplified.enabled"
          :active-text="$translator({ cn: '简化版', en: 'Simplified' })"
          :inactive-text="$translator({ cn: '专业版', en: 'Professional' })"
          @change="ChangeSimple()"
        >
        </el-switch>
      </div>

      <el-form label-width="100px" v-if="false">
        <el-row :gutter="5" v-if="false">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" v-if="false">
            <el-form-item :label="$translator({ cn: '密码', en: 'Password' })">
              <el-input
                v-model="uif.password"
                placeholder="选填"
                :disabled="uif.connection.isConnected"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :label="$translator({ cn: '接口', en: 'Address' })">
              <el-autocomplete
                :style="{ width: '100%' }"
                v-model="uif.apiAddress"
                @select="ChangeSession"
                :fetch-suggestions="GetAllSession"
                :disabled="uif.connection.isConnected"
                placeholder="必填"
              >
              </el-autocomplete>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item>
              <el-button @click="OpenLoginSessionInfoPannel()" type="text">
                {{ $translator({ cn: "管理接口", en: "Copy Share Link" }) }}
              </el-button>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" v-if="false">
            <el-form-item :label="$translator({ cn: '后端目录', en: 'Path' })">
              <el-input
                :disabled="true"
                v-model="uif.connection.path"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="5" v-if="false">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" v-if="false">
            <el-form-item>
              <el-button @click="ResetAll()"> 重置所有配置 </el-button>
            </el-form-item>
          </el-col>

          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" v-if="false">
            <el-form-item>
              <el-button @click="Share()"> 分享配置到移动端 </el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="5">
          <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item :label="$translator({ cn: '接口', en: 'Address' })">
              <el-autocomplete
                :style="{ width: '100%' }"
                v-model="uif.apiAddress"
                @select="ChangeSession"
                :fetch-suggestions="GetAllSession"
                :disabled="uif.connection.isConnected"
                placeholder="必填"
              >
              </el-autocomplete>
            </el-form-item>
          </el-col>

          <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item>
              <el-button @click="CopyShareLink()" type="text">
                {{ $translator({ cn: "管理接口", en: "Copy Share Link" }) }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-descriptions
        :title="$translator({ cn: 'API 接口', en: 'API' })"
        :column="2"
        border
      >
        <template slot="extra">
          <el-button
            type="primary"
            size="small"
            v-on:click="OpenLoginSessionInfoPannel()"
          >
            {{ $translator({ cn: "管理接口", en: "API Mannager" }) }}
          </el-button>
          <el-button
            :type="uif.connection.isConnected ? 'danger' : 'success'"
            @click="Connect()"
            size="small"
            >{{ ConnectButtom() }}
            <i class="el-icon-upload el-icon--right"></i>
          </el-button>
        </template>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-paperclip"></i>
            {{ $translator({ cn: "地址", en: "URL" }) }}
          </template>
          <el-autocomplete
            v-model="uif.apiAddress"
            @select="ChangeSession"
            :fetch-suggestions="GetAllSession"
            :disabled="uif.connection.isConnected"
            placeholder="必填"
            v-if="false"
          >
          </el-autocomplete>
          <el-tag effect="plain">
            {{ uif.apiAddress }}
          </el-tag>
        </el-descriptions-item>

        <el-descriptions-item v-if="false">
          <template slot="label">
            <i class="el-icon-tickets"></i>
            {{ $translator({ cn: "状态", en: "Status" }) }}
          </template>
          <el-tag
            size="small"
            :type="uif.connection.isConnected ? 'success' : 'info'"
          >
            {{
              uif.connection.isConnected
                ? $translator({ cn: "后端已连接", en: "Connected" })
                : $translator({ cn: "未连接", en: "Not Connected" })
            }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <el-descriptions :column="1" border v-if="uif.connection.isConnected">
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile"></i>
            {{ $translator({ cn: "操作系统", en: "Operating System" }) }}
          </template>
          {{ ParseHost() }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            {{ $translator({ cn: "用户", en: "User Info" }) }}
          </template>
          {{ ParsePlatform() }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-data-board"></i>
            {{ $translator({ cn: "CPU 信息", en: "CPU Info" }) }}
          </template>
          {{ ParseCPUInfo() }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            {{ $translator({ cn: "运行目录", en: "Working Dir" }) }}
          </template>
          {{ uif.connection.path }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-pie-chart"></i>
            {{ $translator({ cn: "内存", en: "Memory" }) }}
          </template>
          {{ ParseMemInfo() }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card>
      <div slot="header" class="clearfix">
        <span style="cursor: pointer">{{
          $translator({ cn: "可用检测", en: "Available Test" })
        }}</span>
        <el-button
          style="float: right; margin-left: 10px; padding: 3px 0"
          type="text"
          @click="TestWeb"
          >{{ $translator({ cn: "开始测试", en: "Run Testing" }) }}</el-button
        >
      </div>

      <el-form>
        <el-row :gutter="5">
          <el-col
            :xs="12"
            :sm="8"
            :md="4"
            :lg="4"
            :xl="4"
            v-for="item in uif.testWebsiteList"
            :key="item['domain']"
            v-loading="item['isTesting']"
          >
            <el-card style="text-align: center">
              {{ ParseTestDomain(item["domain"]) }} <br />

              <i
                :class="
                  item['delay2'] == -1 ? 'el-icon-close' : 'el-icon-check'
                "
                v-if="item['delay2'] != 0"
              ></i>
              {{ item["delay"] }}
            </el-card>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <div slot="header" class="clearfix">
        <span style="cursor: pointer">
          {{ $translator({ cn: "内核", en: "Core" }) }}
          <el-divider direction="vertical"></el-divider>
          {{ uif.connection.coreVersion }}
          <el-divider direction="vertical"></el-divider>
          <i
            class="el-icon-error"
            style="color: red"
            v-if="uif.connection.coreStatus == 1 && uif.connection.isConnected"
          >
            {{ $translator({ cn: "未运行", en: "Stoped" }) }}
          </i>

          <i
            class="el-icon-success"
            style="color: green"
            v-if="uif.connection.coreStatus == 0 && uif.connection.isConnected"
          >
            {{ $translator({ cn: "运行中", en: "Running" }) }}
          </i>
        </span>
        <div style="float: right; margin-left: 10px; padding: 3px 0">
          <el-switch v-model="uif.consoleAuto"></el-switch>
          {{ $translator({ cn: "自动刷新 ", en: "Auto Flush" }) }}
        </div>
      </div>

      <console :content="uif.coreLog" />
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import console from "./console.vue";
import { ParseTraffic1024 } from "@/utils/index.js";
import { getToken } from "@/utils/auth";
import { SetSimpleStyle } from "@/utils";

export default {
  name: "Dashboard",
  components: { console },
  data() {
    return {};
  },
  mounted() {},
  computed: {
    ...mapState(["uif"]),
  },
  methods: {
    ...mapActions({
      Connect: "uif/Connect",
      Reset: "uif/ResetAll",
      CloseCore: "uif/CloseCore",
      CloseUIF: "uif/CloseUIF",
      TestWeb: "uif/TestWeb",
      SaveUIFConfig: "uif/SaveUIFConfig",
      InitSimple: "uif/InitSimple",
    }),
    OpenLoginSessionInfoPannel() {
      this.uif.loginSessionInfo.isOpen = true;
    },
    ParseMemInfo() {
      return this.uif.connection.isConnected
        ? ParseTraffic1024(this.uif.connection.system_info.memory.total)
        : "";
    },
    ParseTestDomain(item) {
      try {
        var t = new URL(item);
        return t.host;
      } catch (error) {
        return item;
      }
    },
    ParseCPUInfo() {
      var cpu_info = this.uif.connection.system_info.cpu_info[0];
      return this.uif.connection.isConnected
        ? `${cpu_info.modelName} (${cpu_info.cores} 核)`
        : "";
    },
    ChangeSimple() {
      SetSimpleStyle(this.uif.config.simplified.enabled);
      this.uif.loginSession.isReloadWeb = true;
      this.InitSimple();
    },
    ParsePlatform() {
      var host_info = this.uif.connection.system_info.host_info;
      if (host_info == undefined) {
        return "";
      }
      return this.uif.connection.isConnected
        ? `${host_info.platform} ${host_info.platformFamily} (${host_info.hostname}) `
        : "";
    },
    ParseHost() {
      var host_info = this.uif.connection.system_info.host_info;
      if (host_info == undefined) {
        return "";
      }
      return this.uif.connection.isConnected
        ? `${host_info.os}(${host_info.kernelArch}) ${host_info.kernelVersion}`
        : "";
    },
    ConnectButtom() {
      if (this.uif.connection.isConnected) {
        return this.$translator({ cn: "断开连接", en: "Disconnect" });
      }
      return this.$translator({ cn: "连接后端", en: "Connect" });
    },
    ChangeSession(item) {
      this.uif.password = item["password"];
      if (this.uif.connection.isConnected) {
        this.Connect(); // disconnect
      }
      this.Connect();
    },
    DeleteSession(item) {
      console.log(item);
    },
    GetAllSession(_, cb) {
      cb(this.uif.loginSession);
    },
    ResetAll() {
      this.$confirm(
        "此操作会清空所有东西（包括入站、出站、路由等），不可逆转, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        },
      )
        .then(() => {
          this.Reset();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除",
          });
        });
    },
    Share() {
      var shareLink =
        "http://" +
        this.uif.connection.ip +
        ":9413/share?key=" +
        encodeURIComponent(getToken());

      var t = this;
      this.$copyText(shareLink).then(
        function (e) {
          t.$message({
            showClose: true,
            message: "分享链接 已复制到剪切板",
            type: "success",
          });
        },
        function (e) {},
      );
    },
  },
};
</script>
