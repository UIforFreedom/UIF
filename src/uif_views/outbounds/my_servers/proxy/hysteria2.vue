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
        <el-form-item label="认证密码">
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
        <el-form-item label="认证密码">
          <el-input
            v-model="outbound_obj.setting.users[0].password"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="拥塞算法">
          <el-select
            v-model="congestion"
            placeholder="必填"
            style="width: 100%"
            @change="CheckCongestion"
          >
            <el-option
              v-for="item in [
                { name: 'BBR', value: 'BBR' },
                { name: 'Brutal', value: 'Brutal' },
              ]"
              :key="item['name']"
              :label="item['name']"
              :value="item['value']"
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
        <el-form-item label="混淆算法">
          <el-select
            v-model="outbound_obj.setting.obfs.type"
            placeholder="必填"
            style="width: 100%"
          >
            <el-option
              v-for="item in [
                { name: 'none', value: '' },
                { name: 'salamander', value: 'salamander' },
              ]"
              :key="item['name']"
              :label="item['name']"
              :value="item['value']"
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
        v-if="outbound_obj.setting.obfs.type != ''"
      >
        <el-form-item label="混淆密码">
          <el-input
            v-model="outbound_obj.setting.obfs.password"
            placeholder="选填"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="5" v-if="congestion != 'BBR'">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="上传速度">
          <el-input
            type="number"
            placeholder="必填"
            v-model.number="outbound_obj.setting.up_mbps"
          >
            <template slot="append">Mbps</template>
          </el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="下载速度">
          <el-input
            type="number"
            placeholder="必填"
            v-model.number="outbound_obj.setting.down_mbps"
          >
            <template slot="append">Mbps</template>
          </el-input>
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
  name: "hysteria2",
  props: ["outbound_obj"],
  components: {},
  data() {
    return { congestion: "BBR" };
  },
  created() {
    var setting = {
      up_mbps: 100,
      down_mbps: 100,
      obfs: {
        type: "",
        password: uuidv4(),
      },
      users: [
        {
          password: uuidv4(),
        },
      ],
      ignore_client_bandwidth: false,
      masquerade: "http://127.0.0.1:8080",
    };
    if (this.uif.pannel.isClient) {
      setting = {
        up_mbps: 100,
        down_mbps: 100,
        obfs: {
          type: "",
          password: uuidv4(),
        },
        password: uuidv4(),
      };
    }
    this.outbound_obj.setting = InitSetting(this.outbound_obj.setting, setting);
    if (
      this.outbound_obj.setting.up_mbps != 0 &&
      this.outbound_obj.setting.down_mbps != 0
    ) {
      this.congestion = "BBR";
    }
  },
  computed: {
    ...mapState(["uif"]),
  },
  methods: {
    CheckCongestion() {
      if (this.congestion == "BBR") {
        this.outbound_obj.setting.up_mbps = 0;
        this.outbound_obj.setting.down_mbps = 0;
      }
      console.log(this.outbound_obj);
    },
  },
};
</script>
