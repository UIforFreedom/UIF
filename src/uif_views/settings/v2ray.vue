<template>
  <div class="content">
    <div style="background-color: red"></div>
    <div style="background-color: blue"></div>
    <div style="background-color: blue"></div>
  </div>
</template>

<style>
.content {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.content div {
  height: 100px;
  min-width: 300px;
  width: 400px;
}
</style>
<style>
.content {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.content img {
  height: 140px;
  width: 400px;
}
.rounded-button {
  border-radius: 20px;

  border: 2px solid black;
  background-color: transparent;
  color: black;

  width: 125px;
  height: 30px;
  cursor: pointer;
  display: block;
  margin-left: 10px;
}
.newTab {
  display: flex;
  margin-top: -10px;
  justify-content: center;
}
</style>

<script>
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      flush_frequen: "type_1",
    };
  },
  computed: {},
  created() {},
  methods: {},
};
</script>
