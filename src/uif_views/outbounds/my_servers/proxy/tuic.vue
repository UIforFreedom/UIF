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

      <el-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="8"
        :xl="8"
        v-if="uif.pannel.isClient"
      >
        <el-form-item label="uuid">
          <el-input
            v-model="outbound_obj.setting.uuid"
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
        <el-form-item label="uuid">
          <el-input
            v-model="outbound_obj.setting.users[0].uuid"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" v-if="false">
        <el-form-item label="0-RTT">
          <el-switch v-model="outbound_obj.setting.zero_rtt_handshake">
          </el-switch>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <el-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="8"
        :xl="8"
        v-if="!uif.pannel.isClient && false"
      >
        <el-form-item label="认证超时">
          <el-input
            placeholder="必填"
            v-model="outbound_obj.setting.auth_timeout"
          >
          </el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" v-if="false">
        <el-form-item label="心跳间隔">
          <el-input placeholder="必填" v-model="outbound_obj.setting.heartbeat">
          </el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="拥塞算法">
          <el-select
            v-model="outbound_obj.setting.congestion_control"
            placeholder="必填"
            style="width: 100%"
          >
            <el-option
              v-for="item in ['cubic', 'bbr', 'new_reno']"
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
        <el-form-item label="UDP模式">
          <el-select
            v-model="outbound_obj.setting.udp_relay_mode"
            placeholder="必填"
            style="width: 100%"
          >
            <el-option
              v-for="item in ['native', 'quic']"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
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
  name: "tuic",
  props: ["outbound_obj"],
  components: {},
  data() {
    return {};
  },
  created() {
    var setting = {
      users: [
        {
          uuid: uuidv4(),
          password: uuidv4(),
        },
      ],
      congestion_control: "bbr",
      zero_rtt_handshake: false,
      auth_timeout: "10s",
      heartbeat: "100s",
    };
    if (this.uif.pannel.isClient) {
      setting = {
        uuid: uuidv4(),
        password: uuidv4(),
        congestion_control: "bbr",
        udp_relay_mode: "native",
        zero_rtt_handshake: false,
        heartbeat: "100s",
      };
    }
    this.outbound_obj.setting = InitSetting(this.outbound_obj.setting, setting);
  },
  computed: {
    ...mapState(["uif"]),
  },

  methods: {
    ...mapActions({
      ConnectV2ray: "v2ray/ConnectV2ray",
    }),
  },
};
</script>
