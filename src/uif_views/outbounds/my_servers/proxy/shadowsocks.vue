<template>
  <el-form label-width="150px">
    <el-row :gutter="5">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-tooltip :disabled="uif.showToolTip" placement="top">
          <div slot="content">字符串长度必须为16</div>
          <el-form-item label="密码">
            <el-input
              v-model="outbound_obj.setting.password"
              maxlength="16"
              minlength="16"
              placeholder="必填"
            ></el-input>
          </el-form-item>
        </el-tooltip>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="加密方法">
          <el-select
            v-model="outbound_obj.setting.method"
            placeholder="必填"
            style="width: 100%"
          >
            <el-option
              v-for="item in [
                '2022-blake3-aes-128-gcm',
                '2022-blake3-aes-256-gcm',
                '2022-blake3-chacha20-poly1305',
                'aes-128-gcm',
                'aes-192-gcm',
                'aes-256-gcm',
                'chacha20-ietf-poly1305',
                'xchacha20-ietf-poly1305',
                'none',
                'aes-128-ctr',
                'aes-192-ctr',
                'aes-256-ctr',
                'aes-128-cfb',
                'aes-192-cfb',
                'aes-256-cfb',
                'rc4-md5',
                'aes-128-ctr',
                'xchacha20',
              ]"
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
</template>

<script>
import { mapState, mapActions } from "vuex";
import { v4 as uuidv4 } from "uuid";
import { InitSetting } from "@/utils";
import { Base64 } from "js-base64";

export default {
  name: "shadowsocks",
  props: ["outbound_obj"],
  components: {},
  data() {
    return {};
  },
  created() {
    var keyLen = uuidv4().slice(0, 16);
    var setting = {
      method: "2022-blake3-aes-128-gcm",
      password: Base64.encode(keyLen),
    };
    if (this.uif.pannel.isClient) {
      setting = {
        method: "2022-blake3-aes-128-gcm",
        password: Base64.encode(keyLen),
        plugin: "",
        plugin_opts: {
          host: "uif.org",
          mode: "http",
          tls: false,
          path: "/",
          "obfs-host": "",
        },
      };
    }
    this.outbound_obj.setting = InitSetting(this.outbound_obj.setting, setting);
  },
  computed: {
    ...mapState(["uif"]),
  },

  methods: {
    ...mapActions({
      ConnectV2ray: "v2ray/ConnectV2ray",
    }),
  },
};
</script>
