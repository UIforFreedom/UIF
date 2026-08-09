<template>
  <div>
    <el-form label-width="150px">
      <el-row :gutter="5">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item label="开启(可选)">
            <el-switch v-model="enabled" v-on:change="change()"> </el-switch>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="5" v-if="outbound_obj.transport.multiplex.enabled">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item label="类型">
            <el-select v-model="outbound_obj.transport.multiplex.protocol" placeholder="必填">
              <el-option
                v-for="item in ['smux', 'yamux', 'h2mux']"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item label="Padding">
            <el-switch v-model="outbound_obj.transport.multiplex.Padding"> </el-switch>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item label="max_streams">
            <el-input
              v-model.number="outbound_obj.transport.multiplex.max_streams"
              placeholder="必填"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { InitSetting } from "@/utils";

export default {
  name: "mux",
  props: ["outbound_obj"],
  components: {},
  data() {
    return { enabled: false };
  },
  computed: {
    ...mapState(["uif"]),
  },
  created() {
    var setting = {
      enabled: false,
      padding: false,

      protocol: "smux",
      max_streams: 4,
    };
    var transport = this.outbound_obj["transport"];
    if (!("multiplex" in transport)) {
      transport["multiplex"] = {};
    }
    transport["multiplex"] = InitSetting(transport["multiplex"], setting);
    this.enabled = transport["multiplex"]['enabled'];
  },
  methods: {
    ...mapActions({}),
    change() {
      this.outbound_obj["transport"]["multiplex"]["enabled"] = this.enabled;
    },
  },
};
</script>
