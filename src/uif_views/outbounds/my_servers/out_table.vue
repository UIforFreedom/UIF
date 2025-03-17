<template>
  <div class="app-container">
    <el-table
      :data="outbound_list"
      stripe
      style="width: 100%"
      :max-height="isSub ? '500' : '20000'"
      @sort-change="handleSortChange"
    >
      <el-table-column
        :label="$translator({ cn: '启用', en: 'Enabled' })"
        min-width="65"
        align="center"
        sortable
        prop="enabled"
      >
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enabled" @change="Connect"> </el-switch>
        </template>
      </el-table-column>

      <el-table-column
        prop="tag"
        :label="$translator({ cn: '名字', en: 'Name' })"
        min-width="270"
        align="left"
      >
        <template slot-scope="scope">
          <el-tag effect="dark" :type="nameColor(scope.row)">
            {{ scope.row.tag }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="tag"
        :label="$translator({ cn: '地址', en: 'Address' })"
        min-width="180"
        align="center"
      >
        <template slot-scope="scope">
          {{ AddressAndPort(scope.row) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="protocol"
        :label="$translator({ cn: '代理协议', en: 'Proxy' })"
        width="133"
        sortable
        align="center"
      >
        <template slot-scope="scope">
          <el-tag effect="plain" type="info" disable-transitions>{{
            ShowProtocol(scope.row)
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

      <el-table-column
        :label="$translator({ cn: '操作', en: 'Action' })"
        width="90"
        align="center"
      >
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-button type="primary" size="mini">
              {{ $translator({ cn: "操作", en: "Action" }) }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                @click.native="ShareSingle(scope.$index, scope.row)"
                icon="el-icon-share"
                >{{
                  $translator({ cn: "分享", en: "Share" })
                }}</el-dropdown-item
              >

              <el-dropdown-item
                icon="el-icon-edit-outline"
                @click.native="HandleDetail(scope.$index, scope.row)"
                >{{
                  $translator({ cn: "配置", en: "Config" })
                }}</el-dropdown-item
              >

              <!--
              <el-dropdown-item
                @click.native="SpeedTest(scope.$index, scope.row)"
                >{{ $translator({ cn: "检测", en: "Test" }) }}</el-dropdown-item
              >
              -->

              <el-dropdown-item
                divided
                @click.native="SpeedTest(scope.$index, scope.row)"
                icon="el-icon-odometer"
                >{{
                  $translator({ cn: "延迟", en: "Test Delay" })
                }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>

      <el-table-column
        :label="$translator({ cn: '测速', en: 'Speed' })"
        width="100"
        sortable
        :sort-method="SpeedSort"
        align="center"
        prop="delay"
      >
        <template slot-scope="scope">
          <div :style="{ color: $delayColor(scope.row.delay) }">
            <i class="el-icon-loading" v-if="scope.row.delay == ' '"></i>
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
import { v4 as uuidv4 } from "uuid";

export default {
  name: "out_table",
  props: ["outbound_list", "isSub"],
  components: {},
  data() {
    return {};
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
    handleSortChange({ column, prop, order }) {
      this.outbound_list.sort((a, b) => {
        var m = a[prop] > b[prop];
        if ("sortMethod" in column) {
          m = column.sortMethod(a, b) > 0;
        }
        if (order === "ascending") {
          m = !m;
        }
        return m ? -1 : 1;
      });
      this.SaveUIFConfig();
    },
    Connect(cb) {
      this.SaveUIFConfig();
      this.ApplyCoreConfig();
    },
    TestIPInfo(row) {},
    ShareSingle(index, row) {
      this.uif.share.isSingle = true;
      this.uif.share.info = DeepCopy(row);
      this.uif.share.isOpenShare = true;
    },
    SpeedTest(index, row) {
      uif_store.actions.TestNode([row]);
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
    ShowProtocol(row) {
      if (row.transport.protocol != "tcp") {
        return `${row.protocol}(${row.transport.protocol})`;
      } else if (["hysteria2", "tuic", "hysteria"].includes(row.protocol)) {
        return `${row.protocol}(quic)`;
      }
      return row.protocol;
    },
    DelayInfo(delay) {
      if (delay == "" || delay == undefined) {
        return "";
      }
      return delay;
    },
    HandleDetail(index, row) {
      if (!("id" in row)) {
        row["id"] = uuidv4();
      }
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
    nameColor(row) {
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
