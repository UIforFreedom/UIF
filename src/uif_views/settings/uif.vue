<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ Translator({ cn: "便捷选项", en: "UIF Settings" }) }}</span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="4">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                {{
                  Translator({
                    cn: "随着操作系统启动而启动UIF",
                    en: "Open UIF while computer ready",
                  })
                }}
              </div>
              <el-form-item
                :label="Translator({ cn: '开机启动', en: 'Auto Startup' })"
              >
                <el-switch
                  v-model="uif.config.startup"
                  v-on:change="SaveAutoStartup()"
                >
                </el-switch>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="4">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                {{
                  Translator({
                    cn: "启动UIF时，弹出Web",
                    en: "Popup main board while UIF ready",
                  })
                }}
              </div>
              <el-form-item
                :label="Translator({ cn: '弹出面板', en: 'Popup UIF' })"
              >
                <el-switch
                  v-model="uif.config.popupWeb"
                  v-on:change="SaveUIFConfig()"
                >
                </el-switch>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="4">
            <el-form-item
              :label="Translator({ cn: '自动更新UIF', en: 'Auto Update' })"
            >
              <el-switch
                v-on:change="SaveUIFConfig()"
                v-model="uif.config.autoUpdateUIF"
              >
              </el-switch>
            </el-form-item>
          </el-col>

          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="4">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                {{
                  Translator({
                    cn: "不要这个黑色框框",
                    en: "No Hint.",
                  })
                }}
              </div>
              <el-form-item
                :label="Translator({ cn: '不显示提示', en: 'Disable Hint' })"
              >
                <el-switch v-model="uif.showToolTip"> </el-switch>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="4">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                {{ Translator({ cn: "语言", en: "Language" }) }}
              </div>
              <el-form-item :label="Translator({ cn: '语言', en: 'Language' })">
                <el-select v-model="uif.config.lang" @change="ChangeLang()">
                  <el-option label="中文" value="cn"></el-option>
                  <el-option label="English" value="en"></el-option>
                </el-select>
              </el-form-item>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ Translator({ cn: "分享", en: "Share" }) }}</span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                {{
                  Translator({
                    cn: "解析到本机的域名, 留空默认使用本机IP",
                    en: "Resolve to yourself ,Use IP by default.",
                  })
                }}
              </div>
              <el-form-item :label="Translator({ cn: '绑定域名', en: 'Domain' })">
                <el-input
                  v-model.trim="uif.config.share.domain"
                  @change="SaveUIFConfig()"
                  :placeholder="Translator({ cn: '选填', en: 'Optional' })"
                ></el-input>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item
              :label="Translator({ cn: '分享链接', en: 'Share Link' })"
            >
              <el-input
                v-model="ShareLink"
                @change="SaveUIFConfig()"
                :disabled="true"
                :placeholder="Translator({ cn: '选填', en: 'Optional' })"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item>
              <el-button @click="CopyShareLink()" type="text">
                {{ Translator({ cn: "复制分享链接", en: "Copy Share Link" }) }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" v-if="false">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                {{
                  Translator({
                    cn: "移动端必须要求使用Tun",
                    en: "Resolve to yourself ,Use IP by default.",
                  })
                }}
              </div>
              <el-form-item
                :label="Translator({ cn: 'Tun 模式', en: 'Tun Mode' })"
              >
                <el-select
                  v-model="uif.config.share.tunShareMode"
                  @change="SaveUIFConfig()"
                >
                  <el-option
                    :label="Translator({ cn: 'Fake IP', en: 'Fake IP' })"
                    value="fakeip"
                  ></el-option>
                  <el-option
                    :label="Translator({ cn: 'Real IP', en: 'Real IP' })"
                    value="realip"
                  ></el-option>
                </el-select>
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
                  v-model="uif.config.subnet.share"
                  @select="SaveUIFConfig()"
                  @change="SaveUIFConfig()"
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

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">所使用DNS服务器</div>
              <el-form-item label="本地 DNS">
                <el-autocomplete
                  value-key="value"
                  v-model="uif.config.share.localDNSAddress"
                  @select="SaveUIFConfig()"
                  @change="SaveUIFConfig()"
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
                  v-model="uif.config.share.remoteDNSAddress"
                  @select="SaveUIFConfig()"
                  @change="SaveUIFConfig()"
                  :fetch-suggestions="queryRemoteDNSList"
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
        <span>{{ Translator({ cn: "自动优选", en: "Auto Selecting" }) }}</span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item
              :label="Translator({ cn: '测试地址', en: 'Address' })"
            >
              <el-input
                v-model.trim="uif.config.urlTest.testURL"
                @change="SaveAndApply()"
                :placeholder="Translator({ cn: '必填', en: 'Required' })"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item
              :label="Translator({ cn: '测试间隔', en: 'Interval' })"
            >
              <el-input
                :placeholder="Translator({ cn: '必填', en: 'Required' })"
                @change="SaveAndApply()"
                v-model="uif.config.urlTest.interval"
              >
                <template slot="append">{{
                  Translator({ cn: "分钟", en: "Minute" })
                }}</template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item
              :label="Translator({ cn: '排序误差', en: 'Tolerance' })"
            >
              <el-input
                :placeholder="Translator({ cn: '必填', en: 'Required' })"
                @change="SaveAndApply()"
                v-model="uif.config.urlTest.tolerance"
              >
                <template slot="append">{{
                  Translator({ cn: "毫秒", en: "ms" })
                }}</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ Translator({ cn: "更新设置", en: "Update Settings" }) }}</span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                {{
                  Translator({
                    cn: "IP数据库更新地址",
                    en: "IP database repo address",
                  })
                }}
              </div>
              <el-form-item
                :label="Translator({ cn: 'IP库地址', en: 'IP DB' })"
              >
                <el-autocomplete
                  value-key="name"
                  v-model.trim="uif.config.geoIPAddress"
                  @change="SaveAndApply()"
                  :fetch-suggestions="getIPDBList"
                  :placeholder="Translator({ cn: '必填', en: 'Required' })"
                ></el-autocomplete>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                {{
                  Translator({
                    cn: "Site数据库更新地址",
                    en: "Site database repo address",
                  })
                }}
              </div>
              <el-form-item
                :label="Translator({ cn: 'Site库地址', en: 'Domain DB' })"
              >
                <el-autocomplete
                  value-key="name"
                  v-model.trim="uif.config.geoSiteAddress"
                  @change="SaveAndApply()"
                  :fetch-suggestions="getSiteDBList"
                  :placeholder="Translator({ cn: '必填', en: 'Required' })"
                ></el-autocomplete>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                定时重启内核，回收垃圾，减少内存占用 <br />
                重启时自动断开所有连接
              </div>
              <el-form-item
                :label="Translator({ cn: '内核定期重启', en: 'Auto Restart' })"
              >
                <el-select
                  v-model="uif.config.coreAutoRestart"
                  @change="SaveUIFConfig()"
                >
                  <el-option
                    :label="Translator({ cn: '不重启', en: 'Will Not' })"
                    value="0"
                  ></el-option>
                  <el-option
                    :label="Translator({ cn: '1 小时', en: '1 Hour' })"
                    value="1"
                  ></el-option>
                  <el-option
                    :label="Translator({ cn: '3 小时', en: '3 Hours' })"
                    value="3"
                  ></el-option>
                  <el-option
                    :label="Translator({ cn: '6 小时', en: '6 Hours' })"
                    value="6"
                  ></el-option>
                  <el-option
                    :label="Translator({ cn: '12 小时', en: '12 Hours' })"
                    value="12"
                  ></el-option>
                  <el-option
                    :label="Translator({ cn: '1 天', en: '1 Day' })"
                    value="24"
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
        <span>{{ Translator({ cn: "NTP 时间更新", en: "Time Adjust" }) }}</span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="4">
            <el-form-item
              :label="Translator({ cn: '开启自动校准', en: 'Enable' })"
            >
              <el-switch
                v-model="uif.config.ntp.enabled"
                v-on:change="SaveUIFConfig()"
              >
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="5" v-if="uif.config.ntp.enabled">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item :label="Translator({ cn: '服务器', en: 'Address' })">
              <el-autocomplete
                v-model="uif.config.ntp.server"
                @change="SaveAndApply()"
                :fetch-suggestions="getNTPList"
                :placeholder="Translator({ cn: '必填', en: 'Required' })"
              ></el-autocomplete>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item :label="Translator({ cn: '端口', en: 'Port' })">
              <el-autocomplete
                v-model.number="uif.config.ntp.server_port"
                @change="SaveAndApply()"
                :placeholder="Translator({ cn: '必填', en: 'Required' })"
              ></el-autocomplete>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item :label="Translator({ cn: '频率', en: 'Frequency' })">
              <el-input
                :placeholder="Translator({ cn: '必填', en: 'Required' })"
                @change="SaveAndApply()"
                v-model="uif.config.ntp.interval"
              >
                <template slot="append">{{
                  Translator({ cn: "分钟", en: "Minute" })
                }}</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getToken } from "@/utils/auth";
import { SetLang } from "@/utils";
import { resetRouter } from "@/router";

export default {
  data() {
    return {
      list: null,
      is_changed: false,
      ipDataList: [
        {
          value:
            "https://cdn.jsdelivr.net/gh/Loyalsoldier/geoip@release/cn.dat",
          name: "Loyalsoldier/geoip",
        },
      ],
      SizeDataList: [
        {
          value:
            "https://cdn.jsdelivr.net/gh/Loyalsoldier/geoip@release/cn.dat",
          name: "Loyalsoldier/geoip",
        },
      ],
      CoreUpdateAddressList: [
        {
          value: "https://github.com/SagerNet/sing-box",
          name: "SagerNet/sing-box",
        },
      ],
      NTPList: [
        {
          value: "ntp.aliyun.com",
          name: "ntp.aliyun.com",
        },
      ],
      UIFUpdateAddressList: [
        {
          value: "https://github.com/UIforFreedom/UIF",
          name: "UIforFreedom/UIF",
        },
      ],
    };
  },
  computed: {
    ...mapState(["uif"]),
    ShareLink() {
      var apiAddress = new URL(this.uif.apiAddress);
      var hostname = apiAddress.hostname;
      var port = apiAddress.port;
      if (this.uif.config.share.domain != "") {
        hostname = this.uif.config.share.domain;
      } else if (["127.0.0.1", "0.0.0.0"].includes(hostname)) {
        hostname = this.uif.connection.ip;
      }
      var shareLink = "http://" + hostname;
      if (port != "") {
        shareLink += ":" + port;
      }
      shareLink += "/share?key=" + encodeURIComponent(getToken());
      this.showShareLink = shareLink;
      return shareLink;
    },
  },
  created() {
    this.GetUIFConfig();
  },
  mounted() {},
  methods: {
    ...mapActions({
      GetUIFConfig: "uif/GetUIFConfig",
      SaveUIFConfig: "uif/SaveUIFConfig",
      ApplyCoreConfig: "uif/ApplyCoreConfig",
      InstallAutoStartup: "uif/InstallAutoStartup",
      BuildShareLink: "uif/BuildShareLink",
    }),
    queryLocalDNSList(_, cb) {
      cb(this.uif.dnsServer.localDNSList);
    },
    queryRemoteDNSList(_, cb) {
      cb(this.uif.dnsServer.remoteDNSList);
    },
    querySubnet(_, cb) {
      cb(this.uif.subNetList);
    },
    SaveAndApply() {
      this.SaveUIFConfig();
      this.ApplyCoreConfig();
    },
    ChangeLang() {
      this.SaveUIFConfig();
      SetLang(this.uif.config.lang);
      resetRouter();
    },
    Translator(i) {
      return i[this.uif.config.lang];
    },
    CopyShareLink() {
      var shareLink = this.showShareLink;

      var t = this;
      this.$copyText(shareLink).then(
        function (e) {
          t.$message({
            showClose: true,
            message: "分享链接 已复制到剪切板\n" + shareLink,
            type: "success",
          });
        },
        function (e) {},
      );
    },
    SaveAutoStartup() {
      this.SaveUIFConfig();
      this.InstallAutoStartup();
    },
    getIPDBList(_, cb) {
      cb(this.ipDataList);
    },
    getSiteDBList(_, cb) {
      cb(this.SizeDataList);
    },
    getNTPList(_, cb) {
      cb(this.NTPList);
    },
    queryUIF(_, cb) {
      cb(this.UIFUpdateAddressList);
    },
    queryCore(_, cb) {
      cb(this.CoreUpdateAddressList);
    },
    seleteItem(item) {
      this.uif.config.geoIPAddress = item["value"];
    },
  },
};
</script>
