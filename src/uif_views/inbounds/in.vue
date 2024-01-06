<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span style="cursor: pointer">
          我的入口
          <el-divider direction="vertical"></el-divider>
          {{ config.config.inbounds.length }}
        </span>
        <el-button
          style="float: right; margin-left: 10px; padding: 3px 0"
          type="text"
          @click="AddNew()"
          >添加</el-button
        >
      </div>

      <el-table
        :data="config.config.inbounds"
        stripe
        style="width: 100%"
        ref="filterTable"
      >
        <el-table-column label="启用" min-width="50" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enabled" @change="OnStateChange">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column prop="tag" label="名字" min-width="150" align="center">
          <template slot-scope="scope">
            <el-tag effect="dark" :type="TagColor(scope.row)">
              {{ scope.row.tag }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="protocol"
          label="代理协议"
          min-width="100"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            <el-tag
              effect="plain"
              class="type_tag"
              type="info"
              disable-transitions
              >{{ scope.row.protocol }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column label="路径" min-width="100" align="center" sortable>
          <template slot-scope="scope">
            <el-tag
              effect="plain"
              class="type_tag"
              type="info"
              disable-transitions
              >{{ BuildPath(scope.row) }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="transport.protocol"
          label="传输协议"
          min-width="100"
          sortable
        >
          <template slot-scope="scope">
            <el-tag
              effect="plain"
              class="type_tag"
              type="info"
              disable-transitions
              >{{ scope.row.transport.protocol }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column
          prop="transport.tls_type"
          label="TLS"
          min-width="80"
          align="center"
          sortable
        >
          <template slot-scope="scope">
            <el-tag
              effect="plain"
              class="type_tag"
              :type="
                scope.row.transport.tls_type == 'none' ? 'danger' : 'success'
              "
              disable-transitions
              >{{ scope.row.transport.tls_type }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column label="操作" width="80" align="center">
          <template slot-scope="scope">
            <el-dropdown trigger="click">
              <el-button type="primary" size="mini">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="ShareIn(scope.$index, scope.row)"
                  >分享</el-dropdown-item
                >

                <el-dropdown-item
                  @click.native="HandleDetail(scope.$index, scope.row)"
                  divided
                  >配置</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import out_item from "@/uif_views/outbounds/my_servers/out_item_info.vue";
import { newDefaultHttpOut } from "@/store/uif/config.js";
import { mapActions, mapState } from "vuex";
import In2Out from "@/store/uif/uif_in_2_out";

export default {
  name: "in",
  components: { out_item },
  data() {
    return {
      show_with_json: false,
      isAdding: false, // true == adding
      rowIndex: 0,
      item_row: {},
    };
  },
  mounted() {
    this.GetUIFConfig();
  },
  computed: {
    ...mapState(["config", "uif"]),
  },

  methods: {
    ...mapActions({
      ApplyCoreConfig: "uif/ApplyCoreConfig",
      GetUIFConfig: "uif/GetUIFConfig",
      SaveUIFConfig: "uif/SaveUIFConfig",
    }),
    ShareIn(index, row) {
      this.uif.share.isSingle = true;
      try {
        var res = In2Out(row);
      } catch (e) {
        this.$message.error("该协议不支持分享！");
        return;
      }
      this.uif.share.info = res;
      this.uif.share.isOpenShare = true;
    },
    BuildPath(row) {
      if (row.protocol == "tun") {
        return "*";
      }
      var res = row.transport.port;
      if (row.transport.protocol == "ws") {
        res += ":" + row.transport.setting.path;
      } else if (row.transport.protocol == "grpc") {
        res += ":" + row.transport.setting.serviceName;
      }
      return res;
    },
    HandleDetail(index, row) {
      this.uif.pannel.info = row;
      this.uif.pannel.index = index;
      this.uif.pannel.all_list = this.config.config.inbounds;
      this.uif.pannel.isAdding = false;
      this.uif.pannel.isClient = false;
      this.uif.pannel.isShowingJson = false;
      this.uif.pannel.isOpen = true;
    },
    AddNew() {
      this.uif.pannel.all_list = this.config.config.inbounds;
      this.uif.pannel.info = newDefaultHttpOut();
      this.uif.pannel.isAdding = true;
      this.uif.pannel.isClient = false;
      this.uif.pannel.isShowingJson = false;
      this.uif.pannel.isOpen = true;
    },
    TagColor(row) {
      if (row.protocol == "freedom") {
        return "success";
      }
      if (row.protocol == "block") {
        return "warning";
      }
    },
    OnStateChange(cb) {
      this.SaveUIFConfig();
      this.ApplyCoreConfig();
    },
  },
};
</script>

<style>
.type_tag {
  min-width: 60px;
  text-align: center;
}
</style>
