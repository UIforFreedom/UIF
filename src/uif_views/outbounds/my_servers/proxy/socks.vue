<template>
  <el-form label-width="150px">
    <el-row :gutter="5">
      <el-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="8"
        :xl="8"
        v-if="uif.pannel.isClient"
      >
        <el-form-item label="版本">
          <el-select
            v-model="outbound_obj.setting.version"
            placeholder="必填"
            style="width: 100%"
          >
            <el-option
              v-for="item in ['5', '4', '4a']"
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
  name: "socks",
  props: ["outbound_obj"],
  components: {},
  data() {
    return {
      auth: false,
    };
  },
  created() {
    var setting = {
      users: [
        {
          username: "",
          password: "",
        },
      ],
    };
    if (this.uif.pannel.isClient) {
      setting = {
        version: "5",
        username: "",
        password: "",
      };
    }
    this.outbound_obj.setting = InitSetting(this.outbound_obj.setting, setting);
  },
  computed: {
    ...mapState(["config", "uif"]),
  },

  methods: {
    ...mapActions({}),
  },
};
</script>
