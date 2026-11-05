<template>
  <div>
    <el-form label-width="150px" v-if="!uif.pannel.isClient">
      <el-row :gutter="5">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-tooltip :disabled="uif.showToolTip" placement="top">
            <div slot="content">
              自定义：很安全，方便快捷，推荐<br />
              自动续签：需要你拥有该域名并设置好DNS到本机，麻烦<br />
              不验证：适配其他客户端，但不安全
            </div>
            <el-form-item label="证书类型">
              <el-select
                v-model="transport.certSignType"
                @change="ChangeType()"
              >
                <el-option label="自定义" value="self"></el-option>
                <el-option label="自动续签" value="auto"></el-option>
                <el-option label="不验证" value="skip"></el-option>
              </el-select>
            </el-form-item>
          </el-tooltip>
        </el-col>

        <el-col
          :xs="24"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
          v-if="transport.certSignType == 'auto'"
        >
          <el-form-item label="颁发机构">
            <el-select v-model="transport.tls.acme.provider">
              <el-option label="Let's Encrypt" value="letsencrypt"></el-option>
              <el-option label="ZeroSSL" value="zerossl"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="5" v-if="transport.certSignType != 'skip'">
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
          v-if="transport.certSignType != 'auto'"
        >
          <el-form-item label="域名">
            <el-input
              v-model="transport.tls.server_name"
              :placeholder="$translator({ cn: '必填', en: 'Required' })"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
          v-if="transport.certSignType == 'auto'"
        >
          <el-form-item label="域名">
            <el-input v-model="serverDomain" placeholder="必填"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item label="alpn">
            <el-select
              v-model="transport.tls.alpn"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="选填"
            >
              <el-option
                v-for="item in ['http/1.1', 'h2', 'h3']"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="5" v-if="['self'].includes(transport.certSignType)">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="PEM 证书">
            <el-input
              v-model="transport.tls.certificate"
              :placeholder="$translator({ cn: '必填', en: 'Required' })"
              :rows="8"
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="PEM 秘钥">
            <el-input
              v-model="transport.tls.key"
              :placeholder="$translator({ cn: '必填', en: 'Required' })"
              :rows="8"
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-form label-width="150px" v-if="uif.pannel.isClient">
      <el-row :gutter="5">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item label="server_name">
            <el-input
              v-model="transport.tls.server_name"
              :placeholder="$translator({ cn: '必填', en: 'Required' })"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item label="alpn">
            <el-select
              v-model="transport.tls.alpn"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="选填"
            >
              <el-option
                v-for="item in ['http/1.1', 'h2', 'h3']"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="5">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item label="allowInsecure">
            <el-switch v-model="transport.tls.insecure"> </el-switch>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item label="开启uTLS">
            <el-switch v-model="transport.tls.utls.enabled"> </el-switch>
          </el-form-item>
        </el-col>

        <el-col
          v-if="uif.pannel.isClient && transport.tls.utls.enabled"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <el-form-item label="uTLS指纹">
            <el-select
              v-model="transport.tls.utls.fingerprint"
              :placeholder="$translator({ cn: '必填', en: 'Required' })"
              style="width: 100%"
            >
              <el-option
                v-for="item in [
                  'none',
                  'chrome',
                  'firefox',
                  'edge',
                  'safari',
                  '360',
                  'qq',
                  'ios',
                  'android',
                  'random',
                  'randomized',
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

      <el-row :gutter="5">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="PEM证书">
            <el-input
              v-model="transport.tls.certificate"
              placeholder="选填"
              :rows="8"
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { InitSetting } from "@/utils";

export default {
  name: "tls",
  props: ["transport"],
  components: {},
  data() {
    return { serverDomain: "" };
  },
  computed: {
    ...mapState(["uif"]),
  },
  watch: {
    serverDomain(newValue, oldValue) {
      this.transport.tls.server_name = newValue;
      if (this.transport.certSignType == "auto") {
        this.transport.tls.acme.domain = [newValue];
      }
    },
  },
  methods: {
    ChangeType() {
      var type = this.transport.certSignType;
      if (["self", "skip"].includes(type)) {
        this.transport.tls.acme.domain = [];
        var server_name = this.transport.tls.server_name;
        var domain = this.uif.connection.cert.domain;
        if (server_name == domain || server_name == "") {
          this.transport.tls.server_name = domain;
          this.transport.tls.certificate = this.uif.connection.cert.public;
          this.transport.tls.key = this.uif.connection.cert.key;
        }
      } else if (["auto"].includes(type)) {
        this.transport.tls.certificate = "";
        this.transport.tls.key = "";
        if (this.transport.tls.server_name != "") {
          this.transport.tls.acme.domain = [this.transport.tls.server_name];
        }
        this.serverDomain = this.transport.tls.server_name;
      }
    },
  },
  created() {
    var setting = {
      enabled: true,
      acme: {
        domain: [],
        provider: "letsencrypt",
      },
      reality: {
        enabled: false,
        handshake: {
          server: "google.com",
          server_port: 443,
        },
        private_key: "UuMBgl7MXTPx9inmQp2UC7Jcnwc6XYbwDNebonM-FCc",
        public_key: "jNXHt1yRo0vDuchQlIP6Z0ZvjT3KtzVI-T4E7RoLJS0",
        short_id: ["0123456789abcdef"],
        max_time_difference: "1m",
      },
      server_name: "",
      alpn: [],
      certificate: "",
      key: "",
    };
    if (this.uif.pannel.isClient) {
      setting = {
        enabled: true,
        insecure: false,
        certificate: "",
        alpn: [],
        utls: {
          enabled: false,
          fingerprint: "random",
        },
        reality: {
          enabled: false,
          public_key: "jNXHt1yRo0vDuchQlIP6Z0ZvjT3KtzVI-T4E7RoLJS0",
          short_id: "0123456789abcdef",
        },
        disable_sni: false,
        server_name: "",
      };
    }
    this.transport.tls = InitSetting(this.transport.tls, setting);
    if (!this.uif.pannel.isClient) {
      this.ChangeType();
    }
  },
};
</script>
