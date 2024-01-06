<template>
  <el-form label-width="150px">
    <el-row :gutter="5">
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

      <el-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="8"
        :xl="8"
        v-if="uif.pannel.isClient"
      >
        <el-form-item label="禁用SNI">
          <el-switch v-model="transport.tls.disable_sni"> </el-switch>
        </el-form-item>
      </el-col>

      <el-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="8"
        :xl="8"
        v-if="!uif.pannel.isClient"
      >
        <el-form-item label="sni">
          <el-input
            v-model="transport.tls.server_name"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="8"
        :xl="8"
        v-if="uif.pannel.isClient && !transport.tls.disable_sni"
      >
        <el-form-item label="sni">
          <el-input
            v-model="transport.tls.server_name"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <el-col
        v-if="uif.pannel.isClient"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="8"
        :xl="8"
      >
        <el-form-item label="allowInsecure">
          <el-switch v-model="transport.tls.insecure"> </el-switch>
        </el-form-item>
      </el-col>

      <el-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="8"
        :xl="8"
        v-if="uif.pannel.isClient"
      >
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
            placeholder="必填"
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

    <el-row :gutter="5" v-if="false">
      <el-radio v-model="radio" label="1">备选项</el-radio>
      <el-radio v-model="radio" label="2">备选项</el-radio>
    </el-row>

    <el-row :gutter="5">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-form-item label="PEM证书">
          <el-input
            v-model="transport.tls.certificate"
            :placeholder="uif.pannel.isClient ? '选填' : '必填'"
            :rows="8"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col
        v-if="!uif.pannel.isClient"
        :xs="24"
        :sm="24"
        :md="24"
        :lg="24"
        :xl="24"
      >
        <el-form-item label="PEM秘钥">
          <el-input
            v-model="transport.tls.key"
            placeholder="必填"
            :rows="8"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { mapState } from "vuex";
import { InitSetting } from "@/utils";

export default {
  name: "tls",
  props: ["transport"],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapState(["uif"]),
  },
  methods: {},
  created() {
    var setting = {
      enabled: true,
      acme: {
        domain: [],
        email: "uiforfreedom@gmail.com",
        provider: "letsencrypt",
      },
      server_name: "",
      alpn: [],
      certificate: `-----BEGIN CERTIFICATE-----
MIIDMTCCAhmgAwIBAgIULR/T/qZKwjjs+uhnpyg1hP4iKocwDQYJKoZIhvcNAQEF
BQAwKTEMMAoGA1UEAwwDdWlmMQwwCgYDVQQKDAN1aWYxCzAJBgNVBAYTAkNOMB4X
DTIzMDgwOTAzNTUwMFoXDTMwMTIyMDExNTAwMFowXTELMAkGA1UEBhMCQ04xCzAJ
BgNVBAgMAmNuMQswCQYDVQQHDAJjbjEQMA4GA1UECgwHdWlmLm9yZzEQMA4GA1UE
CwwHdWlmLm9yZzEQMA4GA1UEAwwHdWlmLm9yZzCCASIwDQYJKoZIhvcNAQEBBQAD
ggEPADCCAQoCggEBAOHZrU36GhjBJ/KLaFKHac7AFJ8FTTlIWTJQRku6P58bpzFs
2UJmmavwaAMXrPciI/E10wzowvAdadf5BuxM/KNJ/mHecbzYjMqe6Y5s9DIM5tGS
UJ4vdAm6bzw1pRRCArwL9bNVHCoKwvMYehWIAaVc/YiEs3rhpBU+SvJBh9ds1Rvh
p7TyWjidhv5tGcV8GJALyjs4C5nPQQNBWW7kf6qvLDEMQ4SVLfbOAZo2oSSCqnBX
t0HlICUArL8aO7nY1NGh3Nj7X/c69Bpc+FhXsuA9EbJRr8CFsTJ/4kY+eblBy7vb
qM0cRAazOh1jLLrAbqzQy1r2KvwS4yc10HwpvikCAwEAAaMdMBswCwYDVR0RBAQw
AoIAMAwGA1UdEwEB/wQCMAAwDQYJKoZIhvcNAQEFBQADggEBAFlY9qDxnpyNJSZp
VArjEw52McyLN6oH2++CUvdOC0gUHoYj8yld9uzD23TBQuPNPlaMLRwq8KPeo4C/
1CbJcD6wjBUOsQrnyFXrBrbQSDUhCOoAE67Dv9F0GIeVfOgWTkk2apCM2iwI7n80
mJKGOxt+B0Yc3Vc0AFo/S4GjeOod8mVXROC4z1ZMFMvM+ml+ZnlbEGIEkfjfehzT
AcVNv/w8zakE/aQvF182/NTgcRJtHOgRXX+SQwCpNkMYsBJpd15VcDs85UXrJSFW
DUNsBJ9xmN3zuLVLFpP4wgYXYtdNt41ChuZRbDD+KzNJXlCU6nhyEsDJ5tvw1gTY
mgk6/ko=
-----END CERTIFICATE-----`,
      key: `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDh2a1N+hoYwSfy
i2hSh2nOwBSfBU05SFkyUEZLuj+fG6cxbNlCZpmr8GgDF6z3IiPxNdMM6MLwHWnX
+QbsTPyjSf5h3nG82IzKnumObPQyDObRklCeL3QJum88NaUUQgK8C/WzVRwqCsLz
GHoViAGlXP2IhLN64aQVPkryQYfXbNUb4ae08lo4nYb+bRnFfBiQC8o7OAuZz0ED
QVlu5H+qrywxDEOElS32zgGaNqEkgqpwV7dB5SAlAKy/Gju52NTRodzY+1/3OvQa
XPhYV7LgPRGyUa/AhbEyf+JGPnm5Qcu726jNHEQGszodYyy6wG6s0Mta9ir8EuMn
NdB8Kb4pAgMBAAECggEAQXkwY5WosRp18Tt2383/338Ru1P3Ii8WJJ7e8h8pSH/k
xVBP348M56qHDLZ1XyOXldrLt0dXE/MC9yhrWF+tMc1GoKqzAFMq5aaSAMcXN9dD
pueq1WDeW9+fVa4bkDbewhMZhIac5pc+Euk6ozlNeNnvaf9GZM47Gil34qkar1mD
Dvis9rACzlHIgUdcC0w1R0aswYjyZsABPdzqvvj/WEB1ybbKLzzv4stm+JUGQLk7
fHTx1ahG0oYP/Y4cF8peL11OtfrhwmTn4JgzUsH9enL1WpBaaofk+j56pBPxH0V4
LIwld5qgCQHfi3h5lr0sV9VK4DqoKasl55hLMQ/xDQKBgQD8QaCDlnHbd5T5Y/u9
i8263cbcRAON/iUp+GzJeYYKZcqN1g92ankyqqIkYuYD7qIolybB6HFyEVQyRDIu
KdnQBv3bsYiMUuJFhSTOIXBiCje82hs29redDst292Mqhrup65iivRKqVjGzpInO
ZpoKPRN4mU5xDmLat7Krq54/NwKBgQDlM7pe/1KRWCCYBKZZxxCE6e6/NOiF28Ul
jlaYcuZeuRzAmuATPF+ACZO25SXqfU/KFryJJFWVz+meSWZykWC4zLISHU7MudRA
gPrUoCy/Ap18p4Uwg2I1lL+vcMcAMbGs4ewj/h2FNp4qFkUprm5+Ic79+2Y1YGCi
VIHFtSLdnwKBgQDnrOZctClxpQwfV+J2nRWfj9v5pEWXfVhoiY5wI7olhoNXbMfa
u8L/85Li1CnoZpxrpxajdHXsi1nGqLdlim5PDnzL7us35U+HBdddsXxjrnquaaog
+sp75oCbjG15OzDTyFrw67Fe27beBDnEZJsI2Dsvwa03TD0iHyBrZjz6VQKBgQCz
4FHOhiBdksUZqOSIprJvLUxCYRpvGxfwrnGFeP8UrcBD5Agg8IueZ2W27sU/7xJ0
bj2Of6ZvSVl18PLmzPMUdQj3MGsMPna2HMM9pWsYiMvh7XKYrTOhC1kYLbDvlRB0
tmVlpeOzDTc5nnqvCIcMlCnnp6oCD94m551k9RAkzwKBgQCIlI1auVdg3PO+60Nj
YtZtViO2l+jfZPq/XaVPIO0LiOrZZU44I0LqPegYenDi2zSWYEMUyi7rRruaXI97
3fo2JukJQSdUP1XeEBqOkT2TA94krgiIN1925sd76SlkvlMHL8oThEy8bQkPExoK
ZtTd02M9k92DvitsV9YfFBf8Jw==
-----END PRIVATE KEY-----`,
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
        disable_sni: false,
        server_name: "",
      };
    }
    this.transport.tls = InitSetting(this.transport.tls, setting);
  },
};
</script>
