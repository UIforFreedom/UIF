<template>
  <el-card v-loading="isLoading">
    <div slot="header" class="clearfix">
      <span style="cursor: pointer">{{ uif.subscribe.info.tag }} </span>
      <el-button
        style="float: right; margin-left: 10px; padding: 3px 0"
        type="text"
        @click="SaveOrAdd()"
        >{{ uif.subscribe.isAdding ? "添加" : "保存" }}</el-button
      >
    </div>
    <el-form label-width="120px">
      <el-form-item label="名字（自定义）">
        <el-input
          placeholder="必填"
          v-model="uif.subscribe.info.tag"
        ></el-input>
      </el-form-item>

      <el-form-item label="自动更新间隔">
        <el-select v-model="uif.subscribe.info.updateGap">
          <el-option label="每次启动UIF" value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="导入方式">
        <el-radio v-model="uif.subscribe.info.type" label="link">链接</el-radio>
        <el-radio v-model="uif.subscribe.info.type" label="data">
          原始数据
        </el-radio>
      </el-form-item>

      <el-form-item label="订阅地址" v-if="uif.subscribe.info.type == 'link'">
        <el-input
          placeholder="必填 (支持 Clash，Clash-Meta, V2rayN, Sing-Box, UIF)"
          v-model="uif.subscribe.info.data"
          :rows="3"
          type="textarea"
        ></el-input>
      </el-form-item>

      <el-form-item label="数据" v-if="uif.subscribe.info.type == 'data'">
        <el-input
          placeholder="必填 (支持 Clash，Clash-Meta, V2rayN, Sing-Box, UIF)"
          v-model="uif.subscribe.info.data"
          :rows="5"
          type="textarea"
        ></el-input>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "add_subscribe_page",
  props: [],
  components: {},
  data() {
    return {
      isLoading: false,
    };
  },
  mounted() {},
  computed: {
    ...mapState(["config", "uif"]),
  },

  methods: {
    ...mapActions({
      SaveUIFConfig: "uif/SaveUIFConfig",
      UpdateSub: "uif/UpdateSub",
    }),
    SaveOrAdd() {
      if (
        this.uif.subscribe.info.tag == "" ||
        this.uif.subscribe.info.data == ""
      ) {
        this.$message({
          type: "info",
          message: "订阅链接 和 名字 都不能为空",
        });
        return;
      }

      if (this.uif.subscribe.isAdding) {
        this.AddNew();
      } else {
        this.uif.subscribe.isOpenSub = false;
        this.SaveUIFConfig();
      }
    },
    async AddNew() {
      this.isLoading = true;

      var isOK = await this.UpdateSub();
      this.isLoading = false;
      if (!isOK) {
        return;
      }

      this.config.config.subscribe.push(this.uif.subscribe.info);
      this.SaveUIFConfig();
      this.uif.subscribe.isOpenSub = false;
    },
  },
};
</script>

<style></style>
