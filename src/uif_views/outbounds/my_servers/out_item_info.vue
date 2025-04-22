<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span style="cursor: pointer">
        {{ uif.pannel.info.tag }}
        <el-divider direction="vertical"></el-divider>
        <el-button
          style="margin-left: 10px; padding: 3px 0"
          type="text"
          @click="Switch()"
          >{{ uif.pannel.isShowingJson ? "Table" : "Json" }}</el-button
        >
      </span>
      <el-button
        style="float: right; margin-left: 10px; padding: 3px 0"
        @click="Save()"
        icon="el-icon-check"
        type="text"
        >{{ $translator({ cn: "保存", en: "Save" }) }}</el-button
      >
      <el-button
        style="float: right; margin-left: 10px; padding: 3px 0; color: red"
        @click="Delete()"
        type="text"
        icon="el-icon-delete"
        v-if="!uif.pannel.isAdding"
        >{{ $translator({ cn: "删除", en: "Delete" }) }}</el-button
      >
    </div>
    <div v-if="uif.pannel.isShowingJson">
      <b-ace-editor
        v-model="uif.pannel.info_string"
        lang="json"
        width="100%"
      ></b-ace-editor>
    </div>

    <div v-if="!uif.pannel.isShowingJson">
      <el-collapse>
        <el-collapse-item
          :title="$translator({ cn: '代理设置', en: 'Proxy Settings' })"
          name="1"
        >
          <proxy :outbound_obj="uif.pannel.info" />
        </el-collapse-item>

        <el-collapse-item
          :title="$translator({ cn: '多路复用', en: 'Mux' })"
          name="2"
          v-if="isShowMux"
        >
          <mux :outbound_obj="uif.pannel.info" />
        </el-collapse-item>

        <el-collapse-item
          :title="$translator({ cn: '传输设置', en: 'Transport Settings' })"
          name="3"
          v-if="uif.pannel.info.protocol != 'tun'"
        >
          <transport :outbound_obj="uif.pannel.info" />
        </el-collapse-item>

        <el-collapse-item
          :title="$translator({ cn: '拨号设置', en: 'Dial Settings' })"
          name="4"
          v-if="uif.pannel.info.protocol != 'tun'"
        >
          <dial :outbound_obj="uif.pannel.info" />
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
import proxy from "./proxy/index.vue";
import transport from "./transport/index.vue";
import dial from "./dial/index.vue";
import mux from "./mux/index.vue";

export default {
  name: "out_item",
  props: [],
  components: { proxy, transport, dial, mux },
  data() {
    return {};
  },
  mounted() {
    this.uif.pannel.info_string = "";
    this.uif.pannel.isShowingJson = false;
  },
  created() {},
  computed: {
    ...mapState(["uif", "config"]),
    isShowMux() {
      return false;
      if (
        ["trojan", "vmess", "vless", "shadowsocks"].includes(
          this.uif.pannel.info.protocol,
        )
      ) {
        return true;
      }
      return false;
    },
  },
  methods: {
    ...mapActions({
      SaveUIFConfig: "uif/SaveUIFConfig",
      ApplyCoreConfig: "uif/ApplyCoreConfig",
    }),
    Switch() {
      if (this.uif.pannel.isShowingJson) {
        if (!this.Check()) {
          return;
        }
      } else {
        this.uif.pannel.info_string = JSON.stringify(
          this.uif.pannel.info,
          null,
          2,
        );
      }
      this.uif.pannel.isShowingJson = !this.uif.pannel.isShowingJson;
    },
    Check() {
      if (this.uif.pannel.isShowingJson) {
        try {
          this.uif.pannel.info = JSON.parse(this.uif.pannel.info_string);
        } catch (e) {
          this.$message.error(
            "错误的 Json 格式，无法保存, 也无法转换成表格! 请检查",
          );
          return false;
        }
      }
      return true;
    },
    Save() {
      if (!this.Check()) {
        return;
      }
      if (this.uif.pannel.isAdding) {
        this.uif.pannel.all_list.push(this.uif.pannel.info);
      } else {
        this.uif.pannel.all_list.splice(
          this.uif.pannel.index,
          1,
          this.uif.pannel.info,
        );
      }
      this.uif.pannel.isShowingJson = false;
      this.uif.pannel.isOpen = false;
      this.SaveUIFConfig();
      this.ApplyCoreConfig();
    },
    Delete() {
      this.$confirm("此操作不可逆转, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.uif.pannel.all_list.splice(this.uif.pannel.index, 1);
          this.uif.pannel.isShowingJson = false;
          this.uif.pannel.isOpen = false;
          this.SaveUIFConfig();
          this.ApplyCoreConfig();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除",
          });
        });
    },
  },
};
</script>
