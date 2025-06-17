<template>
  <div>
    <el-dialog
      :title="uif.route.isAdding ? '添加路由' : '修改路由'"
      :visible.sync="uif.route.isOpen"
      :fullscreen="true"
    >
      <el-card>
        <div slot="header" class="clearfix">
          <span style="cursor: pointer">{{ uif.route.info.tag }}</span>
          <el-button
            style="float: right; margin-left: 10px; padding: 3px 0"
            type="text"
            icon="el-icon-check"
            @click="Save()"
            >{{ this.$translator({ cn: "保存", en: "Save" }) }}</el-button
          >
          <el-button
            style="float: right; margin-left: 10px; padding: 3px 0; color: red"
            type="text"
            @click="Delete()"
            icon="el-icon-delete"
            v-if="!uif.route.isAdding"
            >{{ $translator({ cn: "删除", en: "Delete" }) }}</el-button
          >
        </div>

        <el-form label-width="120px">
          <el-row :gutter="5">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$translator({ cn: '名字', en: 'Name' })">
                <el-input
                  v-model="uif.route.info.tag"
                  :placeholder="$translator({ cn: '必填', en: 'Required' })"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-tooltip :disabled="uif.showToolTip" placement="top">
                <div slot="content">需要去到出站启用才能显示出来</div>
                <el-form-item
                  :label="$translator({ cn: '默认出口', en: 'Default Out' })"
                >
                  <out_seletor
                    :placeholder="$translator({ cn: '必填', en: 'Required' })"
                    :outbound="uif.route.info"
                    :isDetour="false"
                  />
                </el-form-item>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form>

        <el-collapse>
          <el-collapse-item
            :title="$translator({ cn: '通用', en: 'Basic' })"
            name="3"
          >
            <el-form label-width="120px">
              <el-row :gutter="5">
                <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                  <el-form-item
                    :label="$translator({ cn: '端口', en: 'Port' })"
                  >
                    <el-select
                      v-model="uif.route.info.port"
                      multiple
                      @change="handlePortChange"
                      filterable
                      allow-create
                      default-first-option
                      :placeholder="$translator({ cn: '选填', en: 'Optional' })"
                    >
                      <el-option
                        v-for="item in [80, 443]"
                        :key="item"
                        :label="item"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                  <el-form-item
                    :label="$translator({ cn: '协议', en: 'Protocol' })"
                  >
                    <el-select
                      v-model="uif.route.info.protocol"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      :placeholder="$translator({ cn: '选填', en: 'Optional' })"
                    >
                      <el-option
                        v-for="item in [
                          'http',
                          'tls',
                          'quic',
                          'bittorrent',
                          'stun',
                          'dtls',
                        ]"
                        :key="item"
                        :label="item"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                  <el-form-item
                    :label="$translator({ cn: '网络类型', en: 'Network' })"
                  >
                    <el-select
                      v-model="uif.route.info.network"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      :placeholder="$translator({ cn: '选填', en: 'Optional' })"
                    >
                      <el-option
                        v-for="item in ['tcp', 'udp']"
                        :key="item"
                        :label="item"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                  <el-form-item
                    :label="$translator({ cn: '入站', en: 'Inbounds' })"
                  >
                    <el-select
                      v-model="uif.route.info.inbound"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      :placeholder="$translator({ cn: '选填', en: 'Optional' })"
                    >
                      <el-option
                        v-for="item in getAllInbound()"
                        :key="item['id']"
                        :label="item['tag']"
                        :value="item['id']"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                  <el-form-item
                    :label="$translator({ cn: '进程', en: 'Process' })"
                  >
                    <el-select
                      v-model="uif.route.info.process_name"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      :placeholder="$translator({ cn: '选填', en: 'Optional' })"
                    >
                      <el-option
                        v-for="item in ['sing-box', 'v2ray.exe', 'clash']"
                        :key="item"
                        :label="item"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                  <el-form-item
                    :label="$translator({ cn: '入站用户', en: 'Inbound Users' })"
                  >
                    <el-select
                      v-model="uif.route.info.auth_user"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      :placeholder="$translator({ cn: '选填', en: 'Optional' })"
                    >
                      <el-option
                        v-for="item in ['user_name']"
                        :key="item"
                        :label="item"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>

          <el-collapse-item
            :title="$translator({ cn: '域名规则', en: 'Domain Rules' })"
            name="1"
          >
            <el-form label-width="120px">
              <el-row :gutter="5">
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <el-form-item
                    :label="$translator({ cn: '完全匹配', en: 'Full' })"
                  >
                    <el-select
                      v-model="uif.route.info.domain"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      :placeholder="$translator({ cn: '选填', en: 'Optional' })"
                    >
                      <el-option
                        v-for="item in ['youtube.com', 'github.com']"
                        :key="item"
                        :label="item"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <el-form-item
                    :label="$translator({ cn: '后缀匹配', en: 'Suffix' })"
                  >
                    <el-select
                      v-model="uif.route.info.domain_suffix"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      :placeholder="$translator({ cn: '选填', en: 'Optional' })"
                    >
                      <el-option
                        v-for="item in ['.cn', '.com']"
                        :key="item"
                        :label="item"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <el-form-item
                    :label="$translator({ cn: '关键字匹配', en: 'Key Seach' })"
                  >
                    <el-select
                      v-model="uif.route.info.domain_keyword"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      :placeholder="$translator({ cn: '选填', en: 'Optional' })"
                    >
                      <el-option
                        v-for="item in ['google', 'git']"
                        :key="item"
                        :label="item"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <el-form-item
                    :label="$translator({ cn: '正则匹配', en: 'Regex' })"
                  >
                    <el-select
                      v-model="uif.route.info.domain_regex"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      :placeholder="$translator({ cn: '选填', en: 'Optional' })"
                    >
                      <el-option
                        v-for="item in [`^.*\\.domain\\.com`, '^stun\\\\..+']"
                        :key="item"
                        :label="item"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                  <el-tooltip :disabled="uif.showToolTip" placement="top">
                    <div slot="content">预设域名规则</div>
                    <el-form-item
                      :label="
                        $translator({ cn: 'geoSite 范围', en: 'geoSite' })
                      "
                    >
                      <el-select
                        v-model="uif.route.info.geosite"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        :placeholder="
                          $translator({ cn: '选填', en: 'Optional' })
                        "
                      >
                        <el-option
                          v-for="item in siteDataList"
                          :key="item.value"
                          :label="item.value"
                          :value="item.value"
                        >
                          <country-flag :country="item.value" size="small" />
                          {{ item.value }}
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-tooltip>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>

          <el-collapse-item
            :title="$translator({ cn: 'IP 规则', en: 'IP Rules' })"
            name="2"
          >
            <el-form label-width="120px">
              <el-row :gutter="5">
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <el-form-item label="目标 CIDR">
                    <el-select
                      v-model="uif.route.info.ip_cidr"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      :placeholder="$translator({ cn: '选填', en: 'Optional' })"
                    >
                      <el-option
                        v-for="item in ['8.8.8.84/32', '114.114.114.114/16']"
                        :key="item"
                        :label="item"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <el-form-item label="来源 CIDR">
                    <el-select
                      v-model="uif.route.info.source_ip_cidr"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      :placeholder="$translator({ cn: '选填', en: 'Optional' })"
                    >
                      <el-option
                        v-for="item in ['192.168.200.84/32', '192.168.0.0/16']"
                        :key="item"
                        :label="item"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
                  <el-tooltip :disabled="uif.showToolTip" placement="top">
                    <div slot="content">填写国家英文代号</div>
                    <el-form-item label="geoip">
                      <el-select
                        v-model="uif.route.info.geoip"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        placeholder="geoip"
                      >
                        <el-option
                          v-for="item in ipDataList"
                          :key="item.value"
                          :label="item.value"
                          :value="item.value"
                        >
                          <country-flag :country="item.value" size="small" />
                          {{ item.value }}
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-tooltip>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import out_seletor from "@/uif_views/outbounds/my_servers/out_seletor.vue";

export default {
  name: "routing_info",
  props: [],
  components: { out_seletor },
  data() {
    return {
      outOptions: [
        { label: "直连", value: "freedom" },
        { label: "屏蔽", value: "block" },
        { label: "代理", value: "proxy" },
        {
          label: "自添加",
          children: [],
        },
        {
          label: "订阅",
          children: [],
        },
      ],
      ipDataList: [
        /*{{{*/
        {
          value: "CN",
          name: "CN",
        },
        {
          value: "US",
          name: "US",
        },
        {
          value: "HK",
          name: "HK",
        },
        {
          value: "TW",
          name: "TW",
        },
      ] /*}}}*/,
      siteDataList: [
        {
          value: "openai",
          name: "openai",
        },
        {
          value: "google",
          name: "google",
        },
        {
          value: "google-scholar",
          name: "google-scholar",
        },
        {
          value: "category-ads",
          name: "category-ads",
        },
      ],
    };
  },
  computed: {
    ...mapState(["uif", "config"]),
  },
  created() {},
  methods: {
    ...mapActions({
      SaveUIFConfig: "uif/SaveUIFConfig",
      ApplyCoreConfig: "uif/ApplyCoreConfig",
    }),
    handlePortChange(value) {
      // 确保选中的值是整数
      this.uif.route.info.port = value.map(Number);
    },
    UpdateOutOptions() {
      this.outOptions = [];
      var res = [
        {
          label: this.$translator({ cn: "直连", en: "Direct" }),
          value: "freedom",
        },
        { label: "屏蔽", value: "block" },
        { label: "代理", value: "proxy" },
        {
          label: "自添加",
          children: [],
        },
        {
          label: "订阅",
          children: [],
        },
      ];
      console.log(this.config.config);
      var custom = res[3]["children"];
      for (var i in this.config.config.outbounds) {
        i = this.config.config.outbounds[i];
        if (!i["enabled"]) {
          continue;
        }
        custom.push({ value: i["core_tag"], label: i["core_tag"] });
      }

      var sub = res[4]["children"];
      for (var i in this.config.config.subscribe) {
        i = this.config.config.subscribe[i];
        var subOut = [];
        for (var j in i["outbounds"]) {
          j = i["outbounds"][j];
          if (!j["enabled"]) {
            continue;
          }
          subOut.push({ value: j["core_tag"], label: j["core_tag"] });
        }
        sub.push({ value: i["tag"], label: i["tag"], children: subOut });
      }
      this.outOptions = res;
    },
    Delete() {
      this.$confirm("此操作不可逆转, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.uif.route.all_list.splice(this.uif.route.index, 1);
          this.uif.route.isOpen = false;
          this.SaveUIFConfig();
          this.ApplyCoreConfig();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: $translator({ cn: "取消删除", en: "Delete aborted." }),
          });
        });
    },
    IsEmpty() {
      if (this.uif.route.info["outbound"] == "") {
        return false;
      }
      for (var item in this.uif.route.info) {
        if (
          item != "tag" &&
          item != "outbound" &&
          item != "id" &&
          this.uif.route.info[item].length > 0
        ) {
          return false;
        }
      }
      return true;
    },
    Save() {
      if (this.IsEmpty()) {
        this.$message({
          type: "error",
          message: "条件不能为空！",
        });
        return;
      }
      if (this.uif.route.isAdding) {
        this.uif.route.all_list.push(this.uif.route.info);
      } else {
        this.uif.route.all_list.splice(
          this.uif.route.index,
          1,
          this.uif.route.info,
        );
      }
      this.uif.route.isOpen = false;
      this.SaveUIFConfig();
      this.ApplyCoreConfig();
    },
    querySearch(_, cb) {
      cb(this.ipDataList);
    },
    getAllInbound() {
      var res = [];
      for (var item in this.config.config.inbounds) {
        item = this.config.config.inbounds[item];
        if (!item["enabled"] || !("id" in item)) {
          continue;
        }
        res.push({ id: item["id"], tag: item["tag"] });
      }
      return res;
    },
  },
};
</script>
