<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>{{ uif.share.info.tag }}</span>
    </div>
    <el-form label-width="100px">
      <el-row :gutter="5">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
          <el-tooltip :disabled="uif.showToolTip" placement="top">
            <div slot="content">分享方式</div>
            <el-form-item label="方式">
              <el-select
                placeholder="必填"
                style="width: 100%"
                v-model="share_style"
              >
                <el-option label="UIF原始数据" value="完整文本"></el-option>
                <el-option label="二维码" value="二维码"></el-option>
              </el-select>
            </el-form-item>
          </el-tooltip>
        </el-col>

        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="6"
          v-if="share_style == '完整文本'"
        >
          <el-button type="text" @click="Copy">复制文本</el-button>
        </el-col>
      </el-row>

      <el-row :gutter="5" v-if="share_style == '二维码'">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
          <el-tooltip :disabled="uif.showToolTip" placement="top">
            <div slot="content">右键“图片另存为”，可以保存图片</div>
            <el-form-item label="xx 的二维码">
              <vue-qrcode :value="share_info"></vue-qrcode>
            </el-form-item>
          </el-tooltip>
        </el-col>
      </el-row>

      <el-row :gutter="5" v-if="share_style == '完整文本'">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="分享文本">
            <el-input
              v-model="share_info"
              readonly
              type="textarea"
              :rows="uif.share.isSingle ? 5 : 15"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import VueQrcode from "vue-qrcode";
import { Base64 } from "js-base64";

export default {
  components: { VueQrcode },
  data() {
    return {
      share_info: "https://github.com/UIforFreedom/UIF",
      share_style: "完整文本",
    };
  },
  computed: {
    ...mapState(["uif"]),
  },
  created() {
    var res = [];
    if (this.uif.share.isSingle) {
      res.push("uif://" + Base64.encode(JSON.stringify(this.uif.share.info)));
    } else {
      for (var item in this.uif.share.info.outbounds) {
        item = this.uif.share.info.outbounds[item];
        res.push("uif://" + Base64.encode(JSON.stringify(item)));
      }
    }
    this.share_info = res.join("\n");
  },
  methods: {
    ...mapActions({}),
    Copy() {
      var t = this;
      this.$copyText(this.share_info).then(
        function (e) {
          t.$message({
            showClose: true,
            message: "文本已复制到剪切板",
            type: "success",
          });
        },
        function (e) {}
      );
    },
  },
};
</script>
