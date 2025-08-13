<script>
export default {
  name: 'TelaInicial',
  data() {
    return {
      titulo: 'Bem-vindo',
      etapasCount: 0,
      erro: null,
      carregando: true
    }
  },
  methods: {
    async carregarPreview() {
      try {
        const res = await fetch('/jogo.json')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        this.titulo = data.titulo || 'Jogo'
        this.etapasCount = Array.isArray(data.etapas) ? data.etapas.length : 0
      } catch (e) {
        this.erro = 'Não foi possível carregar o jogo. Verifique o arquivo /public/jogo.json.'
        console.error(e)
      } finally {
        this.carregando = false
      }
    },
    iniciar() {
      this.$router.push({ name: 'Jogo' })
    }
  },
  mounted() {
    this.carregarPreview()
  }
}
</script>

<template>
  <div class="app" style="display:flex; flex-direction:column; gap:16px;">
    <div class="h1">{{ titulo }}</div>

    <p v-if="carregando" class="small">Carregando informações do jogo…</p>
    <p v-else-if="erro" class="small" style="color:#fca5a5;">{{ erro }}</p>
    <p v-else>
      Este jogo tem <strong>{{ etapasCount }}</strong> etapas. Arraste cada descrição para o alvo correto.
    </p>

    <div style="display:flex; gap:8px; align-items:center; flex-wrap: wrap;">
      <button class="btn" @click="iniciar">Iniciar Jogo</button>
    </div>
  </div>
</template>
