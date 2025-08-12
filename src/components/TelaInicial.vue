<script>
export default {
  data() {
    return {
      botaoClicado: false,
    }
  },
  methods: {
    clicarBotao() {
      console.log('True')
      this.botaoClicado = true
      this.$router.push('/jogo')
    },
  },
}
</script>

<template>
    <header class="cabecalho">
        
        <h1>Bem vindo a Aventura das Gotas</h1>
        <p>Esse jogo vai te ajudar a entender melhor sobre os ciclos da água!</p>
        <p>Clique no botão "Jogar" para iniciar o jogo</p>
        
        <button class="botaoCabecalho" @click="clicarBotao()">Jogar</button>
    </header>
</template>


<style @scoped>
.cabecalho {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.botaoCabecalho {
    background-color: #0077B6;
    color: #caf0f8;
    border: none;
    width: 5rem;
    height: 2.5rem;
    border-radius: 3px;
}

.botaoCabecalho:hover {
    cursor: pointer;
    background-color: #0096C7;
}
</style>
