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
        <el-form-item label="UUID">
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
        <el-form-item label="UUID">
          <el-input
            v-model="outbound_obj.setting.users[0].uuid"
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
        <el-form-item label="alter_id">
          <el-input
            v-model.number="outbound_obj.setting.alter_id"
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
        <el-form-item label="alter_id">
          <el-input
            v-model.number="outbound_obj.setting.users[0].alterId"
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
        <el-form-item label="加密">
          <el-select
            v-model="outbound_obj.setting.security"
            placeholder="必填"
            style="width: 100%"
          >
            <el-option
              v-for="item in [
                'auto',
                'none',
                'zero',
                'aes-128-gcm',
                'chacha20-poly1305',
              ]"
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
        <el-form-item label="填充">
          <el-switch v-model="outbound_obj.setting.global_padding"> </el-switch>
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
        <el-form-item label="长度块加密">
          <el-switch v-model="outbound_obj.setting.authenticated_length">
          </el-switch>
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
  name: "vmess",
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
          alterId: 0,
        },
      ],
    };
    if (this.uif.pannel.isClient) {
      setting = {
        uuid: uuidv4(),
        security: "auto",
        alter_id: 0,
        global_padding: false,
        authenticated_length: false,
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
