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
            v-model="outbound_obj.setting.auth_str"
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
            v-model="outbound_obj.setting.users[0].auth_str"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="混淆密码">
          <el-input
            v-model="outbound_obj.setting.obfs"
            placeholder="必填"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="关闭 MTU 发现">
          <el-switch v-model="outbound_obj.setting.disable_mtu_discovery">
          </el-switch>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="上传速度">
          <el-input
            placeholder="必填"
            v-model.number="outbound_obj.setting.up_mbps"
            type="number"
          >
            <template slot="append">Mbps</template>
          </el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="下载速度">
          <el-input
            placeholder="必填"
            v-model.number="outbound_obj.setting.down_mbps"
            type="number"
          >
            <template slot="append">Mbps</template>
          </el-input>
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
        <el-form-item label="recv_window_client">
          <el-input
            placeholder="必填"
            v-model="outbound_obj.setting.recv_window_client"
          >
          </el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-form-item label="recv_window_conn">
          <el-input
            placeholder="必填"
            v-model.number="outbound_obj.setting.recv_window_conn"
            type="number"
          >
          </el-input>
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
        <el-form-item label="recv_window">
          <el-input
            placeholder="必填"
            v-model.number="outbound_obj.setting.recv_window"
            type="number"
          >
          </el-input>
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
        <el-form-item label="max_conn_client">
          <el-input
            placeholder="必填"
            v-model.number="outbound_obj.setting.max_conn_client"
            type="number"
          >
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
  name: "hysteria",
  props: ["outbound_obj"],
  components: {},
  data() {
    return {};
  },
  created() {
    var setting = {
      up_mbps: 100,
      down_mbps: 100,
      obfs: uuidv4(),

      users: [
        {
          auth_str: uuidv4(),
        },
      ],

      recv_window_conn: 15728640,
      disable_mtu_discovery: false,

      recv_window_client: 67108864,
      max_conn_client: 1024,
    };
    if (this.uif.pannel.isClient) {
      setting = {
        up_mbps: 100,
        down_mbps: 100,
        obfs: uuidv4(),
        auth_str: uuidv4(),
        recv_window_conn: 15728640,
        disable_mtu_discovery: false,

        recv_window: 67108864,
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
