<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span style="cursor: pointer"> 接口管理 </span>
      <el-button
        style="float: right; margin-left: 10px; padding: 3px 0"
        @click="AddNew()"
        type="text"
        icon="el-icon-circle-plus-outline"
        >{{ $translator({ cn: "添加", en: "Add" }) }}</el-button
      >
    </div>

    <el-table
      :data="uif.loginSession"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      row-key="id"
      ref="dragTable"
    >
      <el-table-column label="名称" min-width="150" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.name"
            placeholder="选填"
            @change="SaveSessionList"
          ></el-input>
        </template>
      </el-table-column>

      <el-table-column label="地址" min-width="300" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.value"
            placeholder="必填"
            @change="SaveSessionList"
          ></el-input>
          <div
            v-if="IsMixedContent(scope.row.value)"
            style="color: #f56c6c; font-size: 12px; margin-top: 5px"
          >
            {{
              $translator({
                cn: "当前为HTTPS，浏览器禁止连接非本地HTTP接口",
                en: "Current is HTTPS, browser prohibits connection to non-local HTTP interface",
              })
            }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="密码" min-width="230" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.password"
            placeholder="选填"
            @change="SaveSessionList"
          ></el-input>
        </template>
      </el-table-column>

      <el-table-column label="最后使用时间" min-width="110" align="center">
        <template slot-scope="scope">
          {{ ShowLastDate(scope.row) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="145">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :disabled="IsUsing(scope.row)"
            @click="ChangeSession(scope.$index, scope.row)"
            >{{ IsUsing(scope.row) ? "当前" : "切换" }}</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="HandleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { SaveSession, SetAPIAddress, SetKey } from "@/utils";
import { mapState, mapActions } from "vuex";
import { newLoginSession } from "@/store/uif/config.js";
import moment from "moment";
import Sortable from "sortablejs";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "out_item",
  props: [],
  components: {},
  data() {
    return {};
  },
  mounted() {
    this.uif.pannel.info_string = "";
    this.uif.pannel.isShowingJson = false;
    for (var i in this.uif.loginSession) {
      if (!("id" in this.uif.loginSession[i])) {
        this.$set(this.uif.loginSession[i], "id", uuidv4());
      }
    }
    this.rowDrop();
  },
  created() {},
  destroyed() {
    this.uif.connection.isConnected = false;
    var usingSession = newLoginSession();
    if (this.uif.loginSession.length == 0) {
      this.uif.loginSession.push(usingSession);
    } else {
      usingSession = this.uif.loginSession[0];
    }

    for (var item in this.uif.loginSession) {
      item = this.uif.loginSession[item];
      if (item["value"] == this.uif.apiAddress) {
        usingSession = item;
        break;
      }
    }

    SaveSession(JSON.stringify(this.uif.loginSession));
    SetAPIAddress(usingSession.value);
    SetKey(usingSession.password);

    window.location.reload();
  },
  computed: {
    ...mapState(["uif", "config"]),
  },
  methods: {
    ...mapActions({
      Connect: "uif/Connect",
      SaveUIFConfig: "uif/SaveUIFConfig",
      ApplyCoreConfig: "uif/ApplyCoreConfig",
    }),
    ShowLastDate(row) {
      if ("lastUsedDate" in row) {
        return moment.unix(row["lastUsedDate"]).format("YYYY-MM-DD");
      }
      return "-";
    },
    IsMixedContent(url) {
      if (window.location.protocol !== "https:") {
        return false;
      }
      try {
        const urlObj = new URL(url);
        if (urlObj.protocol === "http:") {
          const hostname = urlObj.hostname;
          if (
            hostname === "localhost" ||
            hostname === "127.0.0.1" ||
            hostname === "[::1]"
          ) {
            return false;
          }
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },
    SaveSessionList() {
      SaveSession(JSON.stringify(this.uif.loginSession));
    },
    AddNew() {
      this.uif.loginSession.push(newLoginSession());
      this.SaveSessionList();
    },
    HandleDelete(i, _) {
      this.$confirm("此操作不可逆转, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.uif.loginSession.splice(i, 1);
          SaveSession(JSON.stringify(this.uif.loginSession));
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除",
          });
        });
    },
    ChangeSession(i, _) {
      var usingSession = this.uif.loginSession[i];
      this.uif.connection.isConnected = false;

      this.SaveSessionList();
      SetAPIAddress(usingSession.value);
      SetKey(usingSession.password);
      window.location.reload();
    },
    tableRowClassName({ row, rowIndex }) {
      if (this.IsUsing(row)) {
        return "warning-row";
      }
      return "";
    },
    IsUsing(row) {
      if (
        row["value"] == this.uif.apiAddress &&
        row["password"] == this.uif.password
      ) {
        return true;
      }
      return false;
    },
    rowDrop() {
      const tbody = this.$refs.dragTable.$el.querySelector(
        ".el-table__body-wrapper tbody",
      );
      const _this = this;
      Sortable.create(tbody, {
        filter: ".el-input__inner",
        preventOnFilter: false,
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.uif.loginSession.splice(oldIndex, 1)[0];
          _this.uif.loginSession.splice(newIndex, 0, currRow);
          SaveSession(JSON.stringify(_this.uif.loginSession));
        },
      });
    },
  },
};
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}
</style>
