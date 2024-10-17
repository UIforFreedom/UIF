<template>
  <el-form label-width="150px">
    <el-row :gutter="5">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="interface_name">
          <el-input
            v-model="outbound_obj.setting.interface_name"
            placeholder="选填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="协议栈">
          <el-select v-model="outbound_obj.setting.stack" placeholder="必填">
            <el-option
              v-for="item in ['system', 'gvisor', 'mixed']"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="转发模式">
          <el-select v-model="outbound_obj.setting.mode" placeholder="必填">
            <el-option
              v-for="item in ['fakeip', 'realip']"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="IPV4 接口">
          <el-input
            v-model="outbound_obj.setting.inet4_address"
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
        v-if="outbound_obj.setting.mode == 'fakeip'"
      >
        <el-form-item label="IPV4-FakeIP范围">
          <el-input
            v-model="outbound_obj.setting.inet4_range"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="IPV6 接口">
          <el-input
            v-model="outbound_obj.setting.inet6_address"
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
        v-if="outbound_obj.setting.inet6_address != ''"
      >
        <el-form-item label="IPV6-FakeIP范围">
          <el-input
            v-model="outbound_obj.setting.inet6_range"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="自动配置">
          <el-switch v-model="outbound_obj.setting.auto_route"> </el-switch>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="严格路由">
          <el-switch v-model="outbound_obj.setting.strict_route"> </el-switch>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="MTU">
          <el-input
            v-model.number="outbound_obj.setting.mtu"
            placeholder="必填"
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
  name: "tun",
  props: ["outbound_obj"],
  components: {},
  data() {
    return {};
  },
  created() {
    var setting = {
      interface_name: "",

      inet4_address: "172.19.0.1/30",
      inet6_address: "",

      inet4_range: "198.18.0.0/15",
      inet6_range: "",

      auto_route: true,
      strict_route: false,
      mtu: 9000,
      stack: "system",
      mode: "fakeip",
    };
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
