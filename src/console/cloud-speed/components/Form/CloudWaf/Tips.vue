<template>
  <div>
    <p>如需具体配置，请跳转至
      <router-link
        :to="{
          name: 'cloud-speed.router.websiteList__waf',
          params: { id: domainId },
          query: $route.query
      }">精准访问控制</router-link>
    </p>
  </div>
</template>
