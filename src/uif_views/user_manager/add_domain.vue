<template>
  <div>
    <el-card v-loading="isLoading">
      <div slot="header" class="clearfix">
        <span style="cursor: pointer">添加 / 修改域名</span>
        <el-button
          style="float: right; margin-left: 10px; padding: 3px 0"
          type="text"
          icon="el-icon-check"
          @click="SaveOrAdd()"
        >
          {{ this.$translator({ cn: "保存", en: "Save" }) }}
        </el-button>
        <el-button
          v-if="canManageDNS"
          style="float: right; margin-left: 10px; padding: 3px 0"
          type="text"
          icon="el-icon-refresh"
          @click="FlushDNSRecords()"
        >
          {{ this.$translator({ cn: "刷新 DNS", en: "Flush DNS" }) }}
        </el-button>
      </div>

      <el-form label-width="140px">
        <el-form-item :label="$translator({ cn: '顶级域名', en: 'Root Domain' })">
          <el-input
            placeholder="必填，例如 domain.com"
            v-model.trim="uif.user_manager.info.id"
          ></el-input>
        </el-form-item>

        <el-form-item :label="$translator({ cn: '订阅分发域名', en: 'Dispatch Domain' })">
          <el-input
            placeholder="必填，可自定义，例如 v.domain.com"
            v-model.trim="uif.user_manager.info.dispatch_domain"
          ></el-input>
        </el-form-item>

        <el-form-item :label="$translator({ cn: '备注', en: 'Remark' })">
          <el-input
            placeholder="选填"
            v-model.trim="uif.user_manager.info.name"
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$translator({ cn: 'Cloudflare Zone ID', en: 'Zone ID' })"
        >
          <el-input
            placeholder="可留空，保存时自动查询"
            v-model.trim="uif.user_manager.info.cloudflare_zone_id"
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$translator({ cn: 'Cloudflare Token', en: 'Cloudflare Token' })"
        >
          <el-input
            placeholder="可选；填写后优先使用域名自己的 token"
            show-password
            v-model.trim="uif.user_manager.info.cloudflare_api_token"
          ></el-input>
        </el-form-item>

        <el-form-item :label="$translator({ cn: '启用', en: 'Enabled' })">
          <el-switch
            v-model="uif.user_manager.info.enabled"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>

        <el-form-item :label="$translator({ cn: '使用量', en: 'Used' })">
          <el-input
            v-model.number="uif.user_manager.info.used"
            placeholder="默认 0"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 16px" v-loading="dnsLoading">
      <div slot="header" class="clearfix">
        <span>DNS 解析</span>
        <el-button
          v-if="canManageDNS"
          style="float: right; margin-left: 10px; padding: 3px 0"
          type="text"
          @click="openAddDNSRecord()"
        >
          {{ this.$translator({ cn: "添加记录", en: "Add Record" }) }}
        </el-button>
      </div>

      <el-alert
        v-if="!canManageDNS"
        title="先填写域名并保存，或至少填写可用域名后再刷新 DNS。"
        type="warning"
        :closable="false"
      >
      </el-alert>

      <el-table
        v-else
        :data="dnsRecords"
        stripe
        style="width: 100%"
        empty-text="暂无 DNS 记录"
      >
        <el-table-column prop="type" label="Type" width="80" align="center">
        </el-table-column>
        <el-table-column prop="name" label="Name" min-width="180">
        </el-table-column>
        <el-table-column prop="content" label="Content" min-width="220">
        </el-table-column>
          <el-table-column label="TTL" width="100" align="center">
            <template slot-scope="scope">
              {{ formatTTL(scope.row.ttl) }}
            </template>
          </el-table-column>
        <el-table-column
          label="Proxy"
          width="90"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.proxied ? 'success' : 'info'"
              effect="plain"
            >
              {{ scope.row.proxied ? "ON" : "OFF" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="Comment" min-width="160">
        </el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editDNSRecord(scope.row)">
              编辑
            </el-button>
            <el-button type="text" @click="deleteDNSRecord(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :title="dnsDialogMode === 'edit' ? '修改 DNS 记录' : '添加 DNS 记录'"
      :visible.sync="dnsDialogVisible"
      append-to-body
      width="720px"
    >
      <el-form label-width="120px" v-loading="dnsSaving">
        <el-form-item label="Type">
          <el-select v-model="dnsForm.type" style="width: 100%">
            <el-option label="A" value="A"></el-option>
            <el-option label="AAAA" value="AAAA"></el-option>
            <el-option label="CNAME" value="CNAME"></el-option>
            <el-option label="TXT" value="TXT"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Name">
          <el-input
            v-model.trim="dnsForm.name"
            :placeholder="dnsNamePlaceholder"
          ></el-input>
        </el-form-item>

        <el-form-item label="Content">
          <el-input
            v-model.trim="dnsForm.content"
            placeholder="A/AAAA 填 IP，CNAME/TXT 填对应内容"
          ></el-input>
        </el-form-item>

        <el-form-item label="TTL">
          <el-select v-model="dnsForm.ttl" style="width: 100%">
            <el-option
              v-for="item in ttlOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Proxy">
          <el-switch v-model="dnsForm.proxied"></el-switch>
        </el-form-item>

        <el-form-item label="Comment">
          <el-input
            v-model.trim="dnsForm.comment"
            placeholder="选填"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dnsDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveDNSRecord()">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  name: "add_domain",
  data() {
    return {
      isLoading: false,
      dnsLoading: false,
      dnsSaving: false,
      dnsRecords: [],
      dnsDialogVisible: false,
      dnsDialogMode: "add",
      ttlOptions: [
        { label: "自动", value: 1 },
        { label: "60 秒", value: 60 },
        { label: "120 秒", value: 120 },
        { label: "300 秒", value: 300 },
        { label: "600 秒", value: 600 },
        { label: "1800 秒", value: 1800 },
        { label: "3600 秒", value: 3600 },
        { label: "7200 秒", value: 7200 },
        { label: "86400 秒", value: 86400 },
      ],
      dnsForm: {
        record_id: "",
        type: "A",
        name: "",
        content: "",
        ttl: 1,
        proxied: false,
        comment: "",
      },
    };
  },
  mounted() {
    this.ensureDomainDefaults();
    if (this.canManageDNS) {
      this.FlushDNSRecords();
    }
  },
  computed: {
    ...mapState(["uif"]),
    canManageDNS() {
      return !!this.uif.user_manager.info.id;
    },
    dnsNamePlaceholder() {
      var domainID = this.uif.user_manager.info.id || '当前域名';
      return `@ / b / b.c，输入 b.c 会生成 b.c.${domainID}`;
    },
  },
  methods: {
    ensureDomainDefaults() {
      if (!this.uif.user_manager.info) {
        this.uif.user_manager.info = {};
      }
      if (!("enabled" in this.uif.user_manager.info)) {
        this.uif.user_manager.info.enabled = 1;
      }
      if (!("used" in this.uif.user_manager.info)) {
        this.uif.user_manager.info.used = 0;
      }
      if (!("name" in this.uif.user_manager.info)) {
        this.uif.user_manager.info.name = "";
      }
      if (!("dispatch_domain" in this.uif.user_manager.info)) {
        this.uif.user_manager.info.dispatch_domain = "";
      }
      if (this.uif.user_manager.info.remark && !this.uif.user_manager.info.name) {
        this.uif.user_manager.info.name = this.uif.user_manager.info.remark;
      }
      if (!("cloudflare_zone_id" in this.uif.user_manager.info)) {
        this.uif.user_manager.info.cloudflare_zone_id = "";
      }
      if (!("cloudflare_api_token" in this.uif.user_manager.info)) {
        this.uif.user_manager.info.cloudflare_api_token = "";
      }
    },
    createFormData(method, payloadKey, payload) {
      const formData = new URLSearchParams();
      formData.append("key", this.uif.user_manager.apiPwd);
      formData.append("method", method);
      if (payloadKey) {
        formData.append(payloadKey, JSON.stringify(payload));
      }
      return formData;
    },
    buildRecordPayload() {
      return {
        domain_id: this.uif.user_manager.info.id || "",
        zone_id: this.uif.user_manager.info.cloudflare_zone_id || "",
        zone_name: "",
        record_id: this.dnsForm.record_id || "",
        type: this.dnsForm.type,
        name: this.dnsForm.name,
        content: this.dnsForm.content,
        ttl: Number(this.dnsForm.ttl) || 1,
        proxied: !!this.dnsForm.proxied,
        comment: this.dnsForm.comment || "",
      };
    },
    formatTTL(ttl) {
      return Number(ttl) === 1 ? "自动" : `${ttl}`;
    },
    resetDNSForm() {
      this.dnsForm = {
        record_id: "",
        type: "A",
        name: "",
        content: "",
        ttl: 1,
        proxied: false,
        comment: "",
      };
    },
    SaveOrAdd() {
      if (!this.uif.user_manager.info.id) {
        this.$message({
          type: "warning",
          message: "请填写域名",
        });
        return;
      }
      if (!this.uif.user_manager.info.dispatch_domain) {
        this.$message({
          type: "warning",
          message: "请填写订阅分发域名",
        });
        return;
      }

      this.isLoading = true;
      const formData = this.createFormData(
        "updateOrNewDomain",
        "domainInfo",
        this.uif.user_manager.info,
      );
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
          if (data["res"]) {
            this.uif.user_manager.info = data["res"];
          }
          this.ensureDomainDefaults();
          this.$message({
            type: "success",
            message: "域名已保存",
          });
          this.$emit("saved");
          if (this.canManageDNS) {
            this.FlushDNSRecords();
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "保存域名失败",
          });
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    FlushDNSRecords() {
      if (!this.canManageDNS) {
        return;
      }
      this.dnsLoading = true;
      const payload = {
        domain_id: this.uif.user_manager.info.id || "",
        zone_id: this.uif.user_manager.info.cloudflare_zone_id || "",
        zone_name: "",
      };
      const formData = this.createFormData(
        "getDomainDNSRecords",
        "recordInfo",
        payload,
      );
      axios
        .post(this.uif.user_manager.apiAddress, formData)
        .then((response) => {
          var data = response["data"];
          if ("status" in data && data["status"] == 0) {
            this.dnsRecords = data["res"] || [];
          } else {
            this.$message({
              type: "error",
              message: data["res"] || "读取 DNS 失败",
            });
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "读取 DNS 失败",
          });
        })
        .finally(() => {
          this.dnsLoading = false;
        });
    },
    openAddDNSRecord() {
      this.resetDNSForm();
      this.dnsDialogMode = "add";
      this.dnsDialogVisible = true;
    },
    editDNSRecord(row) {
      this.dnsDialogMode = "edit";
      this.dnsForm = {
        record_id: row.id || "",
        type: row.type || "A",
        name: row.name || "",
        content: row.content || "",
        ttl: row.ttl || 1,
        proxied: !!row.proxied,
        comment: row.comment || "",
      };
      this.dnsDialogVisible = true;
    },
    saveDNSRecord() {
      if (!this.dnsForm.type || !this.dnsForm.name || !this.dnsForm.content) {
        this.$message({
          type: "warning",
          message: "请完整填写 DNS 记录",
        });
        return;
      }

      const method =
        this.dnsDialogMode === "edit"
          ? "updateDomainDNSRecord"
          : "addDomainDNSRecord";
      this.dnsSaving = true;
      const formData = this.createFormData(
        method,
        "recordInfo",
        this.buildRecordPayload(),
      );
      axios
        .post(this.uif.user_manager.apiAddress, formData)
        .then((response) => {
          var data = response["data"];
          if ("status" in data && data["status"] == 0) {
            this.$message({
              type: "success",
              message: this.dnsDialogMode === "edit" ? "DNS 已更新" : "DNS 已添加",
            });
            this.dnsDialogVisible = false;
            this.FlushDNSRecords();
          } else {
            this.$message({
              type: "error",
              message: data["res"] || "保存 DNS 失败",
            });
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "保存 DNS 失败",
          });
        })
        .finally(() => {
          this.dnsSaving = false;
        });
    },
    deleteDNSRecord(row) {
      this.$confirm(`确认删除 DNS 记录 ${row.name} ?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.dnsLoading = true;
          const formData = this.createFormData(
            "deleteDomainDNSRecord",
            "recordInfo",
            {
              domain_id: this.uif.user_manager.info.id || "",
              zone_id: this.uif.user_manager.info.cloudflare_zone_id || "",
              zone_name: "",
              record_id: row.id || "",
            },
          );
          return axios.post(this.uif.user_manager.apiAddress, formData);
        })
        .then((response) => {
          if (!response) {
            return;
          }
          var data = response["data"];
          if ("status" in data && data["status"] == 0) {
            this.$message({
              type: "success",
              message: "DNS 已删除",
            });
            this.FlushDNSRecords();
          } else {
            this.$message({
              type: "error",
              message: data["res"] || "删除 DNS 失败",
            });
          }
        })
        .catch((err) => {
          if (err && err !== "cancel") {
            this.$message({
              type: "error",
              message: "删除 DNS 失败",
            });
          }
        })
        .finally(() => {
          this.dnsLoading = false;
        });
    },
  },
};
</script>
