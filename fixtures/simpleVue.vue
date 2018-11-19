<template>
  <p>{{ template }} Now works in Codesandboxer!</p>
</template>

<script>
module.exports = {
  data: function () {
    return {
      template: 'Vue'
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