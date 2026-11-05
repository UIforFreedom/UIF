<template>
  <el-form label-width="150px">
    <el-row :gutter="5">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="serviceName">
          <el-input
            v-model="transport.setting.service_name"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="idleTimeout">
          <el-input
            v-model="transport.setting.idle_timeout"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="pingTimeout">
          <el-input
            v-model="transport.setting.ping_timeout"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="keepalivePing">
          <el-switch v-model="transport.setting.permit_without_stream">
          </el-switch>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { mapState } from "vuex";
import { InitSetting } from "@/utils";

export default {
  name: "grpc",
  props: ["transport"],
  components: {},
  data() {
    return {};
  },
  created() {
    var setting = {
      service_name: "TunService",
      idle_timeout: "15s",
      ping_timeout: "15s",
      permit_without_stream: false,
    };
    this.transport.setting = InitSetting(this.transport.setting, setting);
  },
  methods: {},
};
</script>
