<template>
  <el-form label-width="150px">
    <el-row :gutter="5">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="加密方法">
          <el-select v-model="transport.quicSettings.security">
            <el-option
              v-for="item in ['none', 'aes-128-gcm', 'chacha20-poly1305']"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <div v-if="transport.quicSettings.security != 'none'">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="加密秘钥">
            <el-input
              v-model="transport.quicSettings.key"
              placeholder="必填"
            ></el-input>
          </el-form-item>
        </el-col>
      </div>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="头部伪装">
          <el-select v-model="transport.quicSettings.header.type">
            <el-option
              v-for="item in [
                'none',
                'srtp',
                'utp',
                'wechat-video',
                'dtls',
                'wireguard',
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
export default {
  name: "quic",
  props: ["transport"],
  components: {},
  data() {
    return {};
  },
  mounted() {},
  computed: {},
  methods: {},
};
</script>
