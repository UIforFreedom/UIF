<template>
  <el-form label-width="150px">
    <el-row :gutter="5">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="启用拥塞控制">
          <el-switch v-model="transport.kcpSettings.congestion"> </el-switch>
        </el-form-item>
      </el-col>

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

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="最大传输单元">
          <el-input-number
            v-model="transport.kcpSettings.mtu"
            :min="1"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="传输时间间隔">
          <el-input-number
            v-model="transport.kcpSettings.tti"
            :min="1"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="上行链路容量">
          <el-input-number
            v-model="transport.kcpSettings.uplinkCapacity"
            :min="1"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="下行链路容量">
          <el-input-number
            v-model="transport.kcpSettings.downlinkCapacity"
            :min="1"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="读取缓冲区(MB)">
          <el-input-number
            v-model="transport.kcpSettings.readBufferSize"
            :min="1"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="写入缓冲区(MB)">
          <el-input-number
            v-model="transport.kcpSettings.writeBufferSize"
            :min="1"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: "kcp",
  props: ["transport"],
  components: {},
  data() {
    return { request_header: "", response_header: "" };
  },
  mounted() {},
  computed: {},
  methods: {},
};
</script>
