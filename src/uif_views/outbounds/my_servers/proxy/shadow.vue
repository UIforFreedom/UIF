<template>
  <el-form label-width="150px">
    <el-row :gutter="5">
      <el-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="8"
        :xl="8"
        v-if="outbound_obj.setting.version == 2"
      >
        <el-form-item label="密码">
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
        v-if="outbound_obj.setting.version == 3 && !uif.pannel.isClient"
      >
        <el-form-item label="密码">
          <el-input
            v-model="outbound_obj.setting.users[0].password"
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
        v-if="outbound_obj.setting.version == 3 && uif.pannel.isClient"
      >
        <el-form-item label="密码">
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
            v-model="outbound_obj.setting.handshake.server"
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
            v-model="outbound_obj.setting.handshake.server_port"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="版本">
          <el-select
            v-model="outbound_obj.setting.version"
            placeholder="必填"
            style="width: 100%"
          >
            <el-option
              v-for="item in [3, 2, 1]"
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
        v-if="!uif.pannel.isClient"
      >
        <el-form-item label="严格模式">
          <el-switch v-model="outbound_obj.setting.strict_mode"> </el-switch>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { mapState } from "vuex";
import { v4 as uuidv4 } from "uuid";
import { InitSetting } from "@/utils";

export default {
  name: "shadowtls",
  props: ["outbound_obj"],
  components: {},
  data() {
    return {};
  },
  created() {
    var setting = {
      version: 3,
      password: uuidv4(),
      strict_mode: false,
      users: [
        {
          password: uuidv4(),
        },
      ],
      handshake: {
        server: "github.com",
        server_port: 443,
      },
    };
    if (this.uif.pannel.isClient) {
      setting = {
        version: 3,
        password: uuidv4(),
      };
    }
    this.outbound_obj.setting = InitSetting(this.outbound_obj.setting, setting);
  },
  computed: {
    ...mapState(["uif"]),
  },

  methods: {},
};
</script>
