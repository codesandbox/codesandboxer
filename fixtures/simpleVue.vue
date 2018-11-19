<template>
  <p>{{ emoji }}{{ template }} Now works in Codesandboxer{{ emoji }}</p>
</template>

<script>
module.exports = {
  data: function () {
    return {
      template: 'Vue',
      emoji: '🎶'
    }
  }
}
</script>

<style scoped>
p {
  font-size: 2em;
  color: hotpink;
  text-align: center;
}
</style>