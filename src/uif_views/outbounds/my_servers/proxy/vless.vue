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
        <el-form-item label="flow">
          <el-select
            v-model="outbound_obj.setting.flow"
            placeholder="必填"
            style="width: 100%"
          >
            <el-option
              v-for="item in ['xtls-rprx-vision']"
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
        <el-form-item label="flow">
          <el-select
            v-model="outbound_obj.setting.users[0].flow"
            placeholder="必填"
            style="width: 100%"
          >
            <el-option
              v-for="item in ['xtls-rprx-vision']"
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
    </el-row>
  </el-form>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { v4 as uuidv4 } from "uuid";
import { InitSetting } from "@/utils";

export default {
  name: "vless",
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
          uuid: uuidv4(),
          flow: "xtls-rprx-vision",
        },
      ],
    };
    if (this.uif.pannel.isClient) {
      setting = {
        uuid: uuidv4(),
        flow: "xtls-rprx-vision",
      };
    }
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
