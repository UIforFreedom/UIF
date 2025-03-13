<template>
  <el-form label-width="150px">
    <el-row :gutter="5">
      <el-col
        v-if="!uif.pannel.isClient"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="8"
        :xl="8"
      >
        <el-form-item label="用户密码">
          <el-input
            v-model="outbound_obj.setting.users[0]['password']"
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
        v-if="uif.pannel.isClient"
      >
        <el-form-item label="用户密码">
          <el-input
            v-model="outbound_obj.setting.password"
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
        v-if="!uif.pannel.isClient"
      >
        <el-form-item label="回落地址">
          <el-input
            v-model.trim="outbound_obj.setting.fallback.server"
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
        v-if="!uif.pannel.isClient"
      >
        <el-form-item label="回落端口">
          <el-input
            v-model="outbound_obj.setting.fallback.server_port"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { v4 as uuidv4 } from "uuid";
import { InitSetting } from "@/utils";

export default {
  name: "trojan",
  props: ["outbound_obj"],
  components: {},
  data() {
    return {};
  },
  created() {
    var setting = {
      users: [{ name: "uif", password: uuidv4() }],
      fallback: { server: "ui4freedom.org", server_port: 443 },
    };
    if (this.uif.pannel.isClient) {
      setting = {
        password: uuidv4(),
      };
    }
    this.outbound_obj.setting = InitSetting(this.outbound_obj.setting, setting);
  },
  computed: {
    ...mapState(["uif"]),
  },

  methods: {
    ...mapActions({}),
  },
};
</script>
