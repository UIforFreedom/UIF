<template>
  <div>
    <el-form label-width="150px">
      <el-row :gutter="5">
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
          v-if="uif.pannel.isClient"
        >
          <el-tooltip :disabled="uif.showToolTip" placement="top">
            <div slot="content">需要先启用负责转发的节点, 小心本地回环</div>
            <el-form-item :label='$translator({ cn: "链式代理", en: "detour" })'>
              <out_seletor
                :placeholder="$translator({ cn: '选填', en: 'Optional' })"
                :outbound="outbound_obj.dial.detour"
                :isDetour="true"
              />
            </el-form-item>
          </el-tooltip>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" v-if="IsShowTOF()">
          <el-tooltip :disabled="uif.showToolTip" placement="top">
            <div slot="content">Tcp Fast Open，服务器端也需要同时设置才有效</div>
            <el-form-item label="TFO">
              <el-switch v-model="outbound_obj.dial.tcp_fast_open"> </el-switch>
            </el-form-item>
          </el-tooltip>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" v-if="IsShowTOF()">
          <el-tooltip :disabled="uif.showToolTip" placement="top">
            <div slot="content">TCP Multi Path，服务器端也需要同时设置才有效</div>
            <el-form-item label="TMP">
              <el-switch v-model="outbound_obj.dial.tcp_multi_path"> </el-switch>
            </el-form-item>
          </el-tooltip>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { InitSetting } from "@/utils";
import out_seletor from "@/uif_views/outbounds/my_servers/out_seletor.vue";

export default {
  name: "dial",
  props: ["outbound_obj"],
  components: { out_seletor },
  data() {
    return {};
  },
  created() {
    var setting = {
      detour: { id: [], tag: "" },
      tcp_fast_open: false,
      tcp_multi_path: false,
    };
    if (!("dial" in this.outbound_obj)) {
      this.outbound_obj.dial = {};
    }
    this.outbound_obj.dial = InitSetting(this.outbound_obj.dial, setting);
  },
  computed: {
    ...mapState(["uif"]),
  },

  methods: {
    ...mapActions({
      SaveUIFConfig: "uif/SaveUIFConfig",
      ApplyCoreConfig: "uif/ApplyCoreConfig",
    }),
    IsShowTOF() {
      if (
        ["trojan", "vmess", "vless", "shadowsocks"].includes(
          this.outbound_obj.protocol,
        )
      ) {
        return true;
      }
      return false;
    },
    SaveAndApply() {
      this.SaveUIFConfig();
      this.ApplyCoreConfig();
    },
  },
};
</script>
