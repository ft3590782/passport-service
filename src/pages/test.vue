<template>
    <div>
        <h1>test</h1>
        <ul>
            <li v-tongji:click.load="item" v-for="item in list" :key="item.id">{{item.text}}</li>
        </ul>
    </div>
</template>
<script>
export default {
  data() {
    return {
      list: []
    };
  },
  created() {
    for (let i = 0; i < 1000; i++) {
      this.list.push({ id: i + 1, text: `hello my id is ${i}` });
    }
  },
  methods: {
    myclick(item) {
      console.log("myclick", item);
    }
  }
};
</script>