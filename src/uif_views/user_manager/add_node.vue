<template>
  <el-card v-loading="isLoading">
    <div slot="header" class="clearfix">
      <span style="cursor: pointer">添加节点</span>
      <el-button
        style="float: right; margin-left: 10px; padding: 3px 0"
        type="text"
        icon="el-icon-check"
        @click="SaveOrAdd()"
      >
        {{ this.$translator({ cn: "保存", en: "Save" }) }}
      </el-button>
    </div>

    <el-form label-width="120px">
      <el-form-item :label="$translator({ cn: '名字', en: 'name' })">
        <el-input
          placeholder="必填"
          v-model="uif.user_manager.info.name"
        ></el-input>
      </el-form-item>

      <el-form-item :label="$translator({ cn: 'API 地址', en: 'name' })">
        <el-input
          placeholder="必填"
          v-model="uif.user_manager.info.api_address"
        ></el-input>
      </el-form-item>

      <el-form-item :label="$translator({ cn: 'IPv4 地址', en: 'name' })">
        <el-input
          placeholder="必填"
          v-model="uif.user_manager.info.ipv4_address"
        ></el-input>
      </el-form-item>

      <el-form-item :label="$translator({ cn: 'IPv6 地址', en: 'name' })">
        <el-input
          placeholder="选填"
          v-model="uif.user_manager.info.ipv6_address"
        ></el-input>
      </el-form-item>

      <el-form-item :label="$translator({ cn: '地区', en: 'name' })">
        <el-input
          placeholder="选填"
          v-model="uif.user_manager.info.location"
        ></el-input>
      </el-form-item>

      <el-form-item :label="$translator({ cn: '总已用流量', en: 'name' })">
        <el-input
          placeholder="必填"
          v-model.number="uif.user_manager.info.total_traffic"
        ></el-input>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
import axios from "axios";

export default {
  name: "add_node",
  components: {},
  data() {
    return {
      isLoading: false,
    };
  },
  mounted() {},
  computed: {
    ...mapState(["uif"]),
  },
  methods: {
    SaveOrAdd() {
      const formData = new URLSearchParams();
      formData.append("key", this.uif.user_manager.apiPwd);
      formData.append("method", "updateOrNewNode");
      formData.append("nodeInfo", JSON.stringify(this.uif.user_manager.info));
      axios
        .post(this.uif.user_manager.apiAddress, formData)
        .then((response) => {
          var data = response["data"];
          var status = data["status"];
          console.log(data);
          console.log(status);
          if (status != 0) {
            this.$message({
              type: "error",
              message: data["res"],
            });
            return;
          }
          this.uif.user_manager.isOpenAddNode = false;
        });
    },
  },
};
</script>
