<template>
  <el-card v-loading="isLoading">
    <div slot="header" class="clearfix">
      <span style="cursor: pointer">添加用户</span>
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

      <el-form-item :label="$translator({ cn: 'Key', en: 'name' })">
        <div
          style="
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 8px;
          "
        >
          <el-input
            placeholder="必填"
            v-model="uif.user_manager.info.id"
            clearable
          ></el-input>
          <el-button type="text" @click="CopyKey(uif.user_manager.info)">复制</el-button>
        </div>
      </el-form-item>

      <el-form-item
        :label="$translator({ cn: '类型', en: 'Import type' })"
        v-if="false"
      >
        <el-radio-group v-model="uif.user_manager.info.user_type">
          <el-radio :label="0">免费</el-radio>
          <el-radio :label="1">收费</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="过期时间">
        <el-date-picker
          v-model.number="uif.user_manager.info.expires_at"
          type="datetime"
          :value-format="'timestamp'"
          placeholder="选择日期时间"
          align="right"
        >
        </el-date-picker>

        <el-button type="text" style="margin-left: 10px" @click="AddTimes(-1)"
          >过期</el-button
        >
        <el-button type="text" @click="AddTimes(1)">一个月</el-button>
        <el-button type="text" @click="AddTimes(12 * 5)">长期</el-button>
      </el-form-item>

      <el-form-item
        label="分配域名"
        v-if="uif.user_manager.info.domain_id != ''"
      >
        <el-input
          placeholder="必填"
          v-model="uif.user_manager.info.domain_id"
        ></el-input>
      </el-form-item>

      <el-form-item label="剩余流量">
        <el-input
          placeholder="必填"
          clearable
          v-model.number="uif.user_manager.info.traffic_balance"
        ></el-input>
      </el-form-item>

      <el-form-item label="初始流量">
        <el-input
          placeholder="必填"
          clearable
          v-model.number="uif.user_manager.info.init_traffic"
        ></el-input>
      </el-form-item>

      <el-form-item label="节点数量">
        <el-input
          placeholder="必填"
          clearable
          v-model.number="uif.user_manager.info.node_count"
        ></el-input>
      </el-form-item>

      <el-form-item label="偏爱">
        <el-select
          v-model="tag"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="tag"
        >
          <el-option
            v-for="(value, index) in ['us', 'sg', 'nf', 'tk', 'aws']"
            :key="index"
            :label="value"
            :value="value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-for="(item, index) in node_list"
        :key="index"
        :label="'节点 ' + index"
      >
        <el-input placeholder="必填" v-model="node_list[index]"></el-input>
      </el-form-item>

      <el-form-item label="update at">
        <el-input placeholder="必填" v-model="node_update_at"></el-input>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
import axios from "axios";
import { DeepCopy } from "@/utils";
import moment from "moment";

export default {
  name: "add_user",
  components: {},
  data() {
    return {
      isLoading: false,
      node_list: [],
      tag: [],
      node1: "",
      node2: "",
      node_update_at: 0,
    };
  },
  mounted() {
    this.GetDispachedNode();
    this.tag = [];
    var t = this.uif.user_manager.info.prefer_location.split("|");
    for (var item in t) {
      item = t[item];
      if (item != "") {
        this.tag.push(item);
      }
    }
  },
  computed: {
    ...mapState(["uif"]),
  },
  methods: {
    ...mapActions({
      SaveUIFConfig: "uif/SaveUIFConfig",
      ApplyCoreConfig: "uif/ApplyCoreConfig",
      UpdateSub: "uif/UpdateSub",
    }),
    CopyKey(row) {
      var r = row.id
      var t = this;
      this.$copyText(r).then(
        function (e) {
          t.$message({
            showClose: true,
            message: "Key 已复制到剪切板\n",
            type: "success",
          });
        },
        function (e) {},
      );
    },
    SaveOrAdd() {
      const formData = new URLSearchParams();
      formData.append("key", this.uif.user_manager.apiPwd);
      formData.append("method", "updateOrNewUser");
      var G = 1000000000;
      G = 1073741824;
      this.uif.user_manager.info.traffic_balance = Math.round(
        this.uif.user_manager.info.traffic_balance * G,
      );
      this.uif.user_manager.info.init_traffic = Math.round(
        this.uif.user_manager.info.init_traffic * G,
      );
      this.uif.user_manager.info.prefer_location = this.tag.join("|");
      formData.append("userInfo", JSON.stringify(this.uif.user_manager.info));
      axios
        .post(this.uif.user_manager.apiAddress, formData)
        .then((response) => {
          var data = response["data"];
          var status = data["status"];
          if (status != 0) {
            this.$message({
              type: "error",
              message: data["res"],
            });
            return;
          }
          this.uif.user_manager.isOpenAddUser = false;
        });
    },
    GetNodeInfo(nodeID) {
      if (nodeID == "") {
        return "";
      }
      for (var item in this.uif.user_manager.nodesList) {
        item = this.uif.user_manager.nodesList[item];
        if (nodeID == item.id) {
          return `${item.name}(${item.api_address})`;
        }
      }
      return "";
    },
    AddTimes(l) {
      var v = moment().add(l, "months");
      this.uif.user_manager.info.expires_at = v.valueOf();
    },
    GetDispachedNode() {
      const formData = new URLSearchParams();
      formData.append("key", this.uif.user_manager.apiPwd);
      formData.append("method", "GetUserDispachedNode");
      formData.append("id", this.uif.user_manager.info.id);
      axios
        .post(this.uif.user_manager.apiAddress, formData)
        .then((response) => {
          var data = response["data"];
          var status = data["status"];
          if (status == 0) {
            var t = data["res"]["node_list"].split("|");
            for (var item in t) {
              item = t[item];
              if (item != "") {
                this.node_list.push(this.GetNodeInfo(item));
              }
            }
            this.node1 = this.GetNodeInfo(data["res"]["node1_id"]);
            this.node2 = this.GetNodeInfo(data["res"]["node2_id"]);
            this.node_update_at = moment(data["res"]["update_at"]).fromNow();
          }
        });
    },
  },
};
</script>
