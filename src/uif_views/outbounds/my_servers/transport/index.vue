<template>
  <div>
    <el-form label-width="150px">
      <el-row :gutter="5">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item label="类型 (protocol)">
            <el-select
              v-model="outbound_obj.transport.protocol"
              placeholder="必填"
              style="width: 100%"
              @change="onChangePortocol"
            >
              <el-option
                v-for="item in getUsableStream()"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item label="服务器地址">
            <el-input
              v-model="outbound_obj.transport.address"
              placeholder="必填"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item label="服务器端口">
            <el-input
              v-model.number="outbound_obj.transport.port"
              placeholder="必填"
              type="number"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" v-if="isShowTLS">
          <el-form-item label="加密 (security)">
            <el-select
              v-model="outbound_obj.transport.tls_type"
              placeholder="必填"
              style="width: 100%"
            >
              <el-option
                v-for="item in ['none', 'tls']"
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

    <el-row :gutter="5">
      <el-divider></el-divider>
    </el-row>

    <tcp
      v-if="outbound_obj.transport.protocol == 'tcp'"
      :transport="outbound_obj.transport"
    />

    <ws
      v-if="outbound_obj.transport.protocol == 'ws'"
      :transport="outbound_obj.transport"
    />

    <quic
      v-if="outbound_obj.transport.protocol == 'quic'"
      :transport="outbound_obj.transport"
    />

    <kcp
      v-if="outbound_obj.transport.protocol == 'kcp'"
      :transport="outbound_obj.transport"
    />

    <grpc
      v-if="outbound_obj.transport.protocol == 'grpc'"
      :transport="outbound_obj.transport"
    />

    <el-row :gutter="5" v-if="outbound_obj.transport.tls_type != 'none'">
      <el-divider></el-divider>
    </el-row>

    <tls
      :transport="outbound_obj.transport"
      v-if="outbound_obj.transport.tls_type != 'none'"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

import tls from "./tls.vue";

import tcp from "./tcp.vue";
import quic from "./quic.vue";
import ws from "./ws.vue";
import kcp from "./kcp.vue";
import grpc from "./grpc.vue";

export default {
  name: "transport",
  props: ["outbound_obj"],
  components: { tls, tcp, quic, ws, kcp, grpc },
  data() {
    return {};
  },
  mounted() {},
  computed: {
    ...mapState(["v2ray"]),
    isShowTLS() {
      var noTLSList = [
        "direct",
        "mixed",
        "tun",
        "wireguard",
        "socks",
        "shadowsocks",
        "shadowtls",
      ];

      if (noTLSList.includes(this.outbound_obj.protocol)) {
        return false;
      }
      return true;
    },
  },

  methods: {
    ...mapActions({
      ConnectV2ray: "v2ray/ConnectV2ray",
    }),
    onChangePortocol(_) {
      this.outbound_obj.transport.setting = {};
    },
    getUsableStream() {
      var hasTransport = ["vmess", "trojan", "vless"];
      if (hasTransport.includes(this.outbound_obj.protocol)) {
        return ["tcp", "ws", "grpc", "quic"];
      }
      return ["tcp"];
    },
  },
};
</script>
