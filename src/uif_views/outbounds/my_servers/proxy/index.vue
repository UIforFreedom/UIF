<template>
  <div>
    <el-form label-width="150px">
      <el-row :gutter="5">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item :label="$translator({ cn: '名字', en: 'Name' })">
            <el-input
              v-model="outbound_obj.tag"
              :placeholder="$translator({ cn: '必填', en: 'Required' })"
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item :label="$translator({ cn: '类型', en: 'Type' })">
            <el-select
              v-model="outbound_obj.protocol"
              :placeholder="$translator({ cn: '必填', en: 'Required' })"
              style="width: 100%"
              @change="onChangePortocol"
            >
              <el-option
                v-for="item in GetUsableProxy()"
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
    <vmess
      v-if="outbound_obj.protocol == 'vmess'"
      :outbound_obj="outbound_obj"
    />

    <socks
      v-if="outbound_obj.protocol == 'socks'"
      :outbound_obj="outbound_obj"
    />

    <shadowsocks
      v-if="outbound_obj.protocol == 'shadowsocks'"
      :outbound_obj="outbound_obj"
    />

    <vless
      v-if="outbound_obj.protocol == 'vless'"
      :outbound_obj="outbound_obj"
    />

    <trojan
      v-if="outbound_obj.protocol == 'trojan'"
      :outbound_obj="outbound_obj"
    />

    <shadowtls
      v-if="outbound_obj.protocol == 'shadowtls'"
      :outbound_obj="outbound_obj"
    />

    <wireguard
      v-if="outbound_obj.protocol == 'wireguard'"
      :outbound_obj="outbound_obj"
    />

    <tuic v-if="outbound_obj.protocol == 'tuic'" :outbound_obj="outbound_obj" />

    <hysteria
      v-if="outbound_obj.protocol == 'hysteria'"
      :outbound_obj="outbound_obj"
    />

    <hysteria2
      v-if="outbound_obj.protocol == 'hysteria2'"
      :outbound_obj="outbound_obj"
    />

    <mixed
      v-if="outbound_obj.protocol == 'mixed'"
      :outbound_obj="outbound_obj"
    />

    <http v-if="outbound_obj.protocol == 'http'" :outbound_obj="outbound_obj" />

    <tun v-if="outbound_obj.protocol == 'tun'" :outbound_obj="outbound_obj" />
  </div>
</template>

<script>
import { mapState } from "vuex";

import vmess from "./vmess.vue";
import socks from "./socks.vue";
import shadowsocks from "./shadowsocks.vue";
import vless from "./vless.vue";
import trojan from "./trojan.vue";
import shadowtls from "./shadow.vue";
import hysteria from "./hysteria.vue";
import hysteria2 from "./hysteria2.vue";
import tun from "./tun.vue";
import Wireguard from "./wireguard.vue";
import http from "./http.vue";
import mixed from "./mixed.vue";
import tuic from "./tuic.vue";

export default {
  name: "basic",
  props: ["outbound_obj"],
  components: {
    vmess,
    http,
    mixed,
    socks,
    shadowsocks,
    vless,
    trojan,
    hysteria2,
    shadowtls,
    hysteria,
    tun,
    tuic,
    Wireguard,
  },
  data() {
    return {};
  },
  mounted() {},
  computed: {
    ...mapState(["config", "uif"]),
  },
  methods: {
    onChangePortocol(_) {
      this.outbound_obj.setting = {};
      this.outbound_obj.transport.protocol = "tcp";
      if (
        ["hysteria", "hysteria2", "tuic", "trojan", "vless"].includes(
          this.outbound_obj.protocol,
        )
      ) {
        this.outbound_obj.transport.tls_type = "tls";
      } else {
        this.outbound_obj.transport.tls_type = "none";
      }
    },
    GetUsableProxy() {
      /*{{{*/
      if (this.uif.pannel.isClient) {
        return [
          "http",
          "socks",
          "trojan",
          "vmess",
          "shadowsocks",
          "hysteria",
          "hysteria2",
          "vless",
          "tuic",
          "wireguard",
        ];
      }
      return [
        "http",
        "socks",
        "trojan",
        "vmess",
        "shadowsocks",
        "hysteria",
        "hysteria2",
        "vless",
        "tun",
        "tuic",
        "mixed",
      ];
    } /*}}}*/,
  },
};
</script>
