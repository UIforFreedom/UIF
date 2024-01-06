<template>
  <div class="app-container">
    <el-table
      :data="outbound_list"
      stripe
      style="width: 100%"
      :max-height="isSub ? '500' : '20000'"
    >
      <el-table-column label="启用" min-width="50" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enabled" @change="Connect"> </el-switch>
        </template>
      </el-table-column>

      <el-table-column prop="tag" label="名字" min-width="200" align="center">
        <template slot-scope="scope">
          <el-tag effect="dark" :type="TagColor(scope.row)">
            {{ scope.row.tag }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="tag" label="地址" min-width="200" align="center">
        <template slot-scope="scope">
          {{ AddressAndPort(scope.row) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="protocol"
        label="代理协议"
        width="115"
        sortable
        align="center"
      >
        <template slot-scope="scope">
          <el-tag effect="plain" type="info" disable-transitions>{{
            scope.row.protocol
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="transport.protocol"
        label="传输协议"
        width="110"
        sortable
        align="center"
      >
        <template slot-scope="scope">
          <el-tag effect="plain" type="info" disable-transitions>{{
            scope.row.transport.protocol
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="transport.tls_type"
        label="TLS"
        width="80"
        align="center"
        sortable
      >
        <template slot-scope="scope">
          <el-tag
            effect="plain"
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
                @click.native="ShareSingle(scope.$index, scope.row)"
                >分享</el-dropdown-item
              >

              <el-dropdown-item
                @click.native="SpeedTest(scope.$index, scope.row)"
                >测速</el-dropdown-item
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

      <el-table-column
        label="测速"
        width="100"
        sortable
        :sort-method="SpeedSort"
        align="center"
        prop="delay"
      >
        <template slot-scope="scope">
          <div :style="{ color: DelayColor(scope.row.delay) }">
            {{ scope.row.delay }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { DeepCopy } from "@/utils";
import uif_store from "@/store/uif/uif";

export default {
  name: "out_table",
  props: ["outbound_list", "isSub"],
  components: {},
  data() {
    return { abcd: true };
  },
  mounted() {},
  computed: {
    ...mapState(["config", "uif"]),
  },

  methods: {
    ...mapActions({
      ApplyCoreConfig: "uif/ApplyCoreConfig",
      SaveUIFConfig: "uif/SaveUIFConfig",
      Ping: "uif/Ping",
    }),
    Connect(cb) {
      this.SaveUIFConfig();
      this.ApplyCoreConfig();
    },
    ShareSingle(index, row) {
      this.uif.share.isSingle = true;
      this.uif.share.info = DeepCopy(row);
      this.uif.share.isOpenShare = true;
    },
    SpeedTest(index, row) {
      uif_store.actions.Ping(row);
    },
    SpeedSort(a, b) {
      a = parseInt(a.delay);
      b = parseInt(b.delay);
      if (a == -1) {
        a = 9999999;
      }
      if (b == -1) {
        b = 9999999;
      }
      return a - b;
    },
    DelayColor(delay) {
      if (delay < 0) {
        return "red";
      }
      if (delay <= 40) {
        return "#557A46";
      }
      if (delay <= 100) {
        return "#7A9D54";
      }
      if (delay <= 200) {
        return "#F0B86E";
      }
      if (delay <= 300) {
        return "#FD8D14";
      }
      if (delay <= 400) {
        return "#8C3333";
      }
    },
    DelayInfo(delay) {
      if (delay == "" || delay == undefined) {
        return "";
      }
      return delay;
    },
    HandleDetail(index, row) {
      this.uif.pannel.info = DeepCopy(row);
      this.uif.pannel.index = index;
      this.uif.pannel.isAdding = false;
      this.uif.pannel.all_list = this.outbound_list;
      if (this.uif.pannel.all_list == this.config.config.inbounds) {
        this.uif.pannel.isClient = false;
      } else {
        this.uif.pannel.isClient = true;
      }
      this.uif.pannel.isShowingJson = false;
      this.uif.pannel.isOpen = true;
    },
    TagColor(row) {
      if (row.protocol == "freedom") {
        return "success";
      } else if (row.protocol == "block") {
        return "warning";
      }
    },
    AddressAndPort(row) {
      if (row.protocol == "freedom" || row.protocol == "block") {
        return "-";
      }
      return `${row.transport.address}:${row.transport.port}`;
    },
  },
};
</script>

<style></style>
