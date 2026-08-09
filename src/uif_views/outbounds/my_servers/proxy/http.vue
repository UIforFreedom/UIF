<template>
  <el-form label-width="150px">
    <el-row :gutter="5">
      <el-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="8"
        :xl="8"
        v-if="!uif.pannel.isClient"
      >
        <el-form-item label="设置系统代理">
          <el-switch v-model="outbound_obj.setting.set_system_proxy">
          </el-switch>
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
        <el-form-item label="用户名">
          <el-input
            v-model="outbound_obj.setting.username"
            placeholder="选填"
          ></el-input>
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
        <el-form-item label="用户密码">
          <el-input
            v-model="outbound_obj.setting.password"
            placeholder="选填"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { InitSetting } from "@/utils";

export default {
  name: "http",
  props: ["outbound_obj"],
  components: {},
  data() {
    return {
      auth: false,
    };
  },
  computed: {
    ...mapState(["uif"]),
  },
  created() {
    var setting = {
      set_system_proxy: false,
    };
    if (this.uif.pannel.isClient) {
      setting = {
        username: "",
        password: "",
      };
    }
    this.outbound_obj.setting = InitSetting(this.outbound_obj.setting, setting);
  },
  methods: {
    ...mapActions({}),
  },
};
</script>
