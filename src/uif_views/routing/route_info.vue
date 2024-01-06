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
            @click="Save()"
            >保存</el-button
          >
          <el-button
            style="float: right; margin-left: 10px; padding: 3px 0; color: red"
            type="text"
            @click="Delete()"
            v-if="!uif.route.isAdding"
            >删除</el-button
          >
        </div>

        <el-form label-width="120px">
          <el-row :gutter="5">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="名称">
                <el-input
                  v-model="uif.route.info.tag"
                  placeholder="必填"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item label="出口">
                <el-select v-model="uif.route.info.outbound" placeholder="出站">
                  <el-option
                    v-for="item in outboundType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="端口">
                <el-select
                  v-model="uif.route.info.port"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="选填"
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
              <el-form-item label="协议">
                <el-select
                  v-model="uif.route.info.protocol"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="选填"
                >
                  <el-option
                    v-for="item in ['HTTP', 'TLS', 'QUIC']"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="进程">
                <el-select
                  v-model="uif.route.info.process_name"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="选填"
                >
                  <el-option
                    v-for="item in ['sing-box', 'v2ray', 'tuic', 'xray']"
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

        <el-collapse>
          <el-collapse-item title="域名规则" name="1">
            <el-form label-width="120px">
              <el-row :gutter="5">
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <el-form-item label="完全匹配">
                    <el-select
                      v-model="uif.route.info.domain"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      placeholder="选填"
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
                  <el-form-item label="后缀匹配">
                    <el-select
                      v-model="uif.route.info.domain_suffix"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      placeholder="选填"
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
                  <el-form-item label="关键字匹配">
                    <el-select
                      v-model="uif.route.info.domain_keyword"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      placeholder="选填"
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
                  <el-form-item label="正则匹配">
                    <el-select
                      v-model="uif.route.info.domain_regex"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      placeholder="选填"
                    >
                      <el-option
                        v-for="item in ['*.facebook.com', '*.cn']"
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
                    <el-form-item label="geoSite范围">
                      <el-select
                        v-model="uif.route.info.geosite"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        placeholder="geosize范围"
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

          <el-collapse-item title="IP规则" name="2">
            <el-form label-width="120px">
              <el-row :gutter="5">
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                  <el-form-item label="IP">
                    <el-select
                      v-model="uif.route.info.ip_cidr"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      placeholder="选填"
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
                    <el-form-item label="geoip范围">
                      <el-select
                        v-model="uif.route.info.geoip"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        placeholder="geoip范围"
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

export default {
  name: "routing_info",
  props: [],
  data() {
    return {
      outboundType: [
        { label: "直连", value: "freedom" },
        { label: "屏蔽", value: "block" },
        { label: "代理", value: "proxy" },
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
    };
  },
  computed: {
    ...mapState(["uif"]),
  },
  mounted() {},
  methods: {
    ...mapActions({
      SaveUIFConfig: "uif/SaveUIFConfig",
      ApplyCoreConfig: "uif/ApplyCoreConfig",
    }),
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
            message: "取消删除",
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
      }
      this.uif.route.isOpen = false;
      this.SaveUIFConfig();
      this.ApplyCoreConfig();
    },
    querySearch(_, cb) {
      cb(this.ipDataList);
    },
  },
};
</script>
