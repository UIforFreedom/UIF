<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>便捷选项</span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="4">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">随着操作系统启动而启动UIF</div>
              <el-form-item label="开机自启动">
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
              <div slot="content">启动UIF时，弹出Web</div>
              <el-form-item label="弹出主页">
                <el-switch
                  v-model="uif.config.popupWeb"
                  v-on:change="SaveUIFConfig()"
                >
                </el-switch>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="4">
            <el-form-item label="自动更新UIF">
              <el-switch
                v-on:change="SaveUIFConfig()"
                v-model="uif.config.autoUpdateUIF"
              >
              </el-switch>
            </el-form-item>
          </el-col>

          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="4">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">不要这个黑色框框</div>
              <el-form-item label="不显示提示">
                <el-switch v-model="uif.showToolTip"> </el-switch>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="4"> </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>自动优选</span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="测试地址">
              <el-input
                v-model="uif.config.urlTest.testURL"
                @change="SaveAndApply()"
                placeholder="必填"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="测试间隔">
              <el-input
                placeholder="必填"
                @change="SaveAndApply()"
                v-model="uif.config.urlTest.interval"
              >
                <template slot="append">分钟</template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="排序误差">
              <el-input
                placeholder="必填"
                @change="SaveAndApply()"
                v-model="uif.config.urlTest.tolerance"
              >
                <template slot="append">毫秒</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>更新设置</span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">IP数据库更新地址</div>
              <el-form-item label="IP库地址">
                <el-autocomplete
                  value-key="name"
                  v-model="uif.config.geoIPAddress"
                  @change="SaveAndApply()"
                  :fetch-suggestions="getIPDBList"
                  placeholder="请输入内容"
                ></el-autocomplete>
              </el-form-item>
            </el-tooltip>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-tooltip :disabled="uif.showToolTip" placement="top">
              <div slot="content">Site数据库更新地址</div>
              <el-form-item label="Site库地址">
                <el-autocomplete
                  value-key="name"
                  v-model="uif.config.geoSiteAddress"
                  @change="SaveAndApply()"
                  :fetch-suggestions="getSiteDBList"
                  placeholder="请输入内容"
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
              <el-form-item label="内核定期重启">
                <el-select
                  v-model="uif.config.coreAutoRestart"
                  @change="SaveUIFConfig()"
                >
                  <el-option label="不重启" value="0"></el-option>
                  <el-option label="1小时" value="1"></el-option>
                  <el-option label="3小时" value="3"></el-option>
                  <el-option label="6小时" value="6"></el-option>
                  <el-option label="12小时" value="12"></el-option>
                  <el-option label="1天" value="24"></el-option>
                </el-select>
              </el-form-item>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>NTP 时间更新</span>
      </div>
      <el-form label-width="100px">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="4">
            <el-form-item label="开启自动校准">
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
            <el-form-item label="服务器">
              <el-autocomplete
                v-model="uif.config.ntp.server"
                @change="SaveAndApply()"
                :fetch-suggestions="getNTPList"
                placeholder="必填"
              ></el-autocomplete>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="端口">
              <el-autocomplete
                v-model.number="uif.config.ntp.server_port"
                @change="SaveAndApply()"
                placeholder="必填"
              ></el-autocomplete>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-form-item label="间隔">
              <el-input
                placeholder="必填"
                @change="SaveAndApply()"
                v-model="uif.config.ntp.interval"
              >
                <template slot="append">分钟</template>
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
  },
  created() {
    this.GetUIFConfig();
  },
  methods: {
    ...mapActions({
      GetUIFConfig: "uif/GetUIFConfig",
      SaveUIFConfig: "uif/SaveUIFConfig",
      ApplyCoreConfig: "uif/ApplyCoreConfig",
      InstallAutoStartup: "uif/InstallAutoStartup",
    }),
    SaveAndApply() {
      this.SaveUIFConfig();
      this.ApplyCoreConfig();
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
