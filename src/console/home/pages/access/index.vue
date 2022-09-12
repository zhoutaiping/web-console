<style lang="scss">
  .CardAccess{
    height: 300px;
    max-width: 660px;
    margin: 0 auto;
    margin-top: 100px;
    display: flex;
    align-items: center;
    background-repeat: no-repeat;
    background-position-x: right;
    background-image: url('/img/no-access.png');
    padding-left: 20px;

    h3{
      font-size: 20px;
      margin-bottom: 10px;
    }
  }
</style>

<template>
  <ConsolePageLayout
    :breadcrumb-visible="false"
    :header-visible="false"
  >
    <DmCard class="CardAccess">
      <h3>
        您暂时没有任何权限查看该模块
      </h3>
      <p>如有需要请联系主账号为您开通对应模块</p>
    </DmCard>
  </ConsolePageLayout>
</template>
