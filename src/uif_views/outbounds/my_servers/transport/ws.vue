<template>
  <el-form label-width="150px">
    <el-row :gutter="5">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="路径">
          <el-input
            v-model="transport.setting.path"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="Host">
          <el-input
            v-model="transport.setting.headers['Host']"
            placeholder="选填"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { InitSetting } from "@/utils";

export default {
  name: "ws",
  props: ["transport"],
  components: {},
  data() {
    return {};
  },
  created() {
    var setting = {
      path: "/",
      headers: { Host: "" },
    };
    this.transport.setting = InitSetting(this.transport.setting, setting);
  },
  computed: {},
  methods: {},
};
</script>
