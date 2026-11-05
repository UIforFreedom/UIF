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
    </el-row>
  </el-form>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { InitSetting } from "@/utils";

export default {
  name: "mixed",
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
      setting = {};
    }
    this.outbound_obj.setting = InitSetting(this.outbound_obj.setting, setting);
  },
  methods: {
    ...mapActions({}),
  },
};
</script>
