<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ $translator({ cn: "便捷选项", en: "UIF Settings" }) }}</span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="4">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                {{
                  $translator({
                    cn: "随着操作系统启动而启动UIF",
                    en: "Open UIF while computer ready",
                  })
                }}
              </div>
              <el-form-item
                :label="$translator({ cn: '开机启动', en: 'Auto Startup' })"
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
                  $translator({
                    cn: "启动UIF时，弹出Web",
                    en: "Popup main board while UIF ready",
                  })
                }}
              </div>
              <el-form-item
                :label="$translator({ cn: '弹出面板', en: 'Popup UIF' })"
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
              :label="$translator({ cn: '自动更新UIF', en: 'Auto Update' })"
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
                  $translator({
                    cn: "不要这个黑色框框",
                    en: "No Hint.",
                  })
                }}
              </div>
              <el-form-item
                :label="$translator({ cn: '不显示提示', en: 'Disable Hint' })"
              >
                <el-switch v-model="uif.showToolTip"> </el-switch>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col :xs="24" :sm="8" :md="8" :lg="6" :xl="4">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                {{ $translator({ cn: "Language", en: "语言" }) }}
              </div>
              <el-form-item
                :label="$translator({ cn: '语言', en: 'Language' })"
              >
                <el-select v-model="uif.config.lang" @change="ChangeLang()">
                  <el-option label="中文" value="cn"></el-option>
                  <el-option label="English" value="en"></el-option>
                </el-select>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col
            :xs="24"
            :sm="8"
            :md="8"
            :lg="6"
            :xl="4"
            v-if="uif.config.simplified.enabled"
          >
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                {{ $translator({ cn: "流量接管模式", en: "Inbound Mode" }) }}
              </div>
              <el-form-item
                :label="$translator({ cn: '入站模式', en: 'Inbound' })"
              >
                <el-select
                  v-model="uif.config.simplified.inboundMode"
                  @change="InitSimple()"
                >
                  <el-option label="HTTP （常见）" value="mixed"></el-option>
                  <el-option label="Tun VPN" value="tun"></el-option>
                </el-select>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col
            :xs="24"
            :sm="8"
            :md="8"
            :lg="6"
            :xl="4"
            v-if="uif.config.simplified.enabled"
          >
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                当你发起一个网络请求<br />UIF 会识别这个请求的类型<br />然后根据这个设置决定是否需要走代理
              </div>
              <el-form-item :label="$translator({ cn: '策略', en: 'Type' })">
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

          <el-col
            :xs="24"
            :sm="8"
            :md="8"
            :lg="6"
            :xl="4"
            v-if="uif.config.simplified.enabled"
          >
            <el-form-item>
              <el-button @click="CopyShareLink()" type="text">
                {{ $translator({ cn: "复制分享链接", en: "Copy Share Link" }) }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="box-card" v-if="!isSimple">
      <div slot="header" class="clearfix">
        <span>{{ $translator({ cn: "分享", en: "Share" }) }}</span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                {{
                  $translator({
                    cn: "解析到本机的域名, 留空默认使用本机IP",
                    en: "Resolve to yourself ,Use IP by default.",
                  })
                }}
              </div>
              <el-form-item
                :label="$translator({ cn: '绑定域名', en: 'Domain' })"
              >
                <el-input
                  v-model.trim="uif.config.share.domain"
                  @change="SaveUIFConfig()"
                  :placeholder="$translator({ cn: '选填', en: 'Optional' })"
                ></el-input>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item
              :label="$translator({ cn: '分享链接', en: 'Share Link' })"
            >
              <el-input
                v-model="ShareLink"
                @change="SaveUIFConfig()"
                :disabled="true"
                :placeholder="$translator({ cn: '选填', en: 'Optional' })"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item>
              <el-button @click="CopyShareLink()" type="text">
                {{ $translator({ cn: "复制分享链接", en: "Copy Share Link" }) }}
              </el-button>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item>
              <el-button @click="CopySingBoxURL()" type="text">
                {{
                  $translator({
                    cn: "快速导入",
                    en: "Quic Import",
                  })
                }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="5" v-if="false">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" v-if="false">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                {{
                  $translator({
                    cn: "移动端必须要求使用Tun",
                    en: "Resolve to yourself ,Use IP by default.",
                  })
                }}
              </div>
              <el-form-item
                :label="$translator({ cn: 'Tun 模式', en: 'Tun Mode' })"
              >
                <el-select
                  v-model="uif.config.share.tunShareMode"
                  @change="SaveUIFConfig()"
                >
                  <el-option
                    :label="$translator({ cn: 'Fake IP', en: 'Fake IP' })"
                    value="fakeip"
                  ></el-option>
                  <el-option
                    :label="$translator({ cn: 'Real IP', en: 'Real IP' })"
                    value="realip"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" v-if="false">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                {{
                  $translator({
                    cn: "本机IP归属地，提高分流精度",
                    en: "Local IP Address. May improve route rule acurative.",
                  })
                }}
              </div>
              <el-form-item
                :label="$translator({ cn: '本地子网', en: 'Subnet' })"
              >
                <el-autocomplete
                  value-key="value"
                  v-model="uif.config.subnet.share"
                  @select="SaveUIFConfig()"
                  @change="SaveUIFConfig()"
                  :fetch-suggestions="querySubnet"
                  :placeholder="$translator({ cn: '选填', en: 'Optional' })"
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
                  v-model="uif.config.subnet.ip_mode_share"
                  @change="SaveUIFConfig()"
                >
                  <el-option
                    :label="$translator({ cn: '不使用', en: 'Not To Use' })"
                    value=""
                  ></el-option>
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

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                {{
                  $translator({
                    cn: "分享的优先使用哪种 IP",
                    en: "IPv4 or IPv6",
                  })
                }}
              </div>
              <el-form-item
                :label="$translator({ cn: 'IP 策略', en: 'IP Type' })"
              >
                <el-select
                  v-model="uif.config.shareIPType"
                  @change="SaveUIFConfig()"
                >
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
                  v-model="uif.config.share.localDNSAddress"
                  @select="SaveUIFConfig()"
                  @change="SaveUIFConfig()"
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
                  v-model="uif.config.share.remoteDNSAddress"
                  @select="SaveUIFConfig()"
                  @change="SaveUIFConfig()"
                  :fetch-suggestions="queryRemoteDNSList"
                  :placeholder="$translator({ cn: '必填', en: 'Required' })"
                ></el-autocomplete>
              </el-form-item>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="box-card" v-if="!isSimple">
      <div slot="header" class="clearfix">
        <span>{{ $translator({ cn: "自动优选", en: "Auto Selecting" }) }}</span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item
              :label="$translator({ cn: '测试地址', en: 'Address' })"
            >
              <el-input
                v-model.trim="uif.config.urlTest.testURL"
                @change="SaveAndApply()"
                :placeholder="$translator({ cn: '必填', en: 'Required' })"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item
              :label="$translator({ cn: '测试间隔', en: 'Interval' })"
            >
              <el-input
                :placeholder="$translator({ cn: '必填', en: 'Required' })"
                @change="SaveAndApply()"
                v-model.number="uif.config.urlTest.interval"
              >
                <template slot="append">{{
                  $translator({ cn: "分钟", en: "Minute" })
                }}</template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item
              :label="$translator({ cn: '排序误差', en: 'Tolerance' })"
            >
              <el-input
                :placeholder="$translator({ cn: '必填', en: 'Required' })"
                @change="SaveAndApply()"
                v-model.number="uif.config.urlTest.tolerance"
              >
                <template slot="append">{{
                  $translator({ cn: "毫秒", en: "ms" })
                }}</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="box-card" v-if="!isSimple">
      <div slot="header" class="clearfix">
        <span>{{
          $translator({ cn: "更新设置", en: "Update Settings" })
        }}</span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">
                定时重启内核，回收垃圾，减少内存占用 <br />
                重启时自动断开所有连接
              </div>
              <el-form-item
                :label="$translator({ cn: '内核定期重启', en: 'Auto Restart' })"
              >
                <el-select
                  v-model="uif.config.coreAutoRestart"
                  @change="SaveUIFConfig()"
                >
                  <el-option
                    :label="$translator({ cn: '不重启', en: 'Will Not' })"
                    value="0"
                  ></el-option>
                  <el-option
                    :label="$translator({ cn: '1 小时', en: '1 Hour' })"
                    value="1"
                  ></el-option>
                  <el-option
                    :label="$translator({ cn: '3 小时', en: '3 Hours' })"
                    value="3"
                  ></el-option>
                  <el-option
                    :label="$translator({ cn: '6 小时', en: '6 Hours' })"
                    value="6"
                  ></el-option>
                  <el-option
                    :label="$translator({ cn: '12 小时', en: '12 Hours' })"
                    value="12"
                  ></el-option>
                  <el-option
                    :label="$translator({ cn: '1 天', en: '1 Day' })"
                    value="24"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="box-card" v-if="!isSimple">
      <div slot="header" class="clearfix">
        <span>{{
          $translator({ cn: "NTP 时间更新", en: "Time Adjust" })
        }}</span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="24" :sm="8" :md="8" :lg="6" :xl="4">
            <el-form-item
              :label="$translator({ cn: '开启自动校准', en: 'Enable' })"
            >
              <el-switch
                v-model="uif.config.ntp.enabled"
                v-on:change="SaveAndApply()"
              >
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="5" v-if="uif.config.ntp.enabled">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item :label="$translator({ cn: '服务器', en: 'Address' })">
              <el-autocomplete
                v-model="uif.config.ntp.server"
                @change="SaveAndApply()"
                :fetch-suggestions="getNTPList"
                :placeholder="$translator({ cn: '必填', en: 'Required' })"
              ></el-autocomplete>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item :label="$translator({ cn: '端口', en: 'Port' })">
              <el-autocomplete
                v-model.number="uif.config.ntp.server_port"
                @change="SaveAndApply()"
                :placeholder="$translator({ cn: '必填', en: 'Required' })"
              ></el-autocomplete>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item :label="$translator({ cn: '频率', en: 'Frequency' })">
              <el-input
                :placeholder="$translator({ cn: '必填', en: 'Required' })"
                @change="SaveAndApply()"
                v-model="uif.config.ntp.interval"
              >
                <template slot="append">{{
                  $translator({ cn: "分钟", en: "Minute" })
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
import { SetLang, GetSimpleStyle } from "@/utils";
import moment from "moment";

export default {
  data() {
    return {
      list: null,
      isSimple: GetSimpleStyle(),
      is_changed: false,
      ipDataList: [
        {
          value:
            "https://github.com/soffchen/sing-geoip/releases/latest/download/geoip.db",
          name: "soffchen/sing-geoip",
        },
      ],
      SiteDataList: [
        {
          value:
            "https://github.com/soffchen/sing-geosite/releases/latest/download/geosite.db",
          name: "soffchen/sing-geosite",
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
      InitSimple: "uif/InitSimple",
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
      SetLang(this.uif.config.lang);
      this.uif.loginSession.isReloadWeb = true;
      this.SaveUIFConfig();
    },
    CopyShareLink() {
      var shareLink = this.ShareLink;

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
    CopySingBoxURL() {
      var name = encodeURIComponent(`UIF[${moment().format("MM-DD HH:MM")}]`);
      var shareLink = `sing-box://import-remote-profile?url=${encodeURIComponent(this.ShareLink)}#${name}`;
      window.open(shareLink, "_blank");
    },
    SaveAutoStartup() {
      this.SaveUIFConfig();
      this.InstallAutoStartup();
    },
    getIPDBList(_, cb) {
      cb(this.ipDataList);
    },
    getSiteDBList(_, cb) {
      cb(this.SiteDataList);
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
