<template>
  <div>
    <div>{{ emoji }}</div>
    <p>Codesandboxer now works with {{ template }}</p>
    <div>{{ emoji }}</div>
  </div>
</template>

<script>
module.exports = {
  data: function() {
    return {
      template: 'Vue',
      emoji: '🎶',
    };
  },
};
</script>

<style scoped>
div,
p {
  color: hotpink;
  text-align: center;
}
div {
  font-size: 1.2em;
}
p {
  font-size: 2em;
}
</style>
