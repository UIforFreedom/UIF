<template>
  <el-form label-width="150px" v-loading="uif.pannel.isLoadingWarp">
    <el-row :gutter="5">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item>
          <el-button @click="FillWarp()" type="text">
            {{ "使用 Warp" }}
          </el-button>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="local_address">
          <el-select
            v-model="outbound_obj.setting.local_address"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="必填"
          >
            <el-option
              v-for="item in ['172.16.0.2/32', '2606:4700::/128']"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="私钥">
          <el-input
            v-model="outbound_obj.setting.private_key"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="公钥">
          <el-input
            v-model="outbound_obj.setting.peer_public_key"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="pre_shared_key">
          <el-input
            v-model="outbound_obj.setting.pre_shared_key"
            placeholder="选填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="workers">
          <el-input
            v-model.number="outbound_obj.setting.workers"
            placeholder="必填"
            type="number"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="mtu大小">
          <el-input
            v-model.number="outbound_obj.setting.mtu"
            placeholder="必填"
            type="number"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" v-if="false">
        <el-form-item label="system_interface">
          <el-switch v-model="outbound_obj.setting.system_interface">
          </el-switch>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="reserved1">
          <el-input
            v-model.number="outbound_obj.setting.reserved[0]"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="reserved2">
          <el-input
            v-model.number="outbound_obj.setting.reserved[1]"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="reserved3">
          <el-input
            v-model.number="outbound_obj.setting.reserved[2]"
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
  name: "wireguard",
  props: ["outbound_obj"],
  components: {},
  data() {
    return {};
  },
  created() {
    var setting = {
      interface_name: "",
      local_address: ["172.16.0.2/32"],
      private_key: "YNXtAzepDqRv9H52osJVDQnznT5AM11eCK3ESpwSt04=",
      peer_public_key: "Z1XXLsKYkYxuiYjJIkRvtIKFepCYHTgON+GwPq7SOV4=",
      pre_shared_key: "",
      reserved: [0, 0, 0],
      workers: 4,
      system_interface: false,
      mtu: 1280,
    };
    this.outbound_obj.setting = InitSetting(this.outbound_obj.setting, setting);
  },
  computed: {
    ...mapState(["uif"]),
  },

  methods: {
    ...mapActions({
      GetWarp: "uif/GetWarp",
    }),
    FillWarp() {
      this.GetWarp();
    },
  },
};
</script>
