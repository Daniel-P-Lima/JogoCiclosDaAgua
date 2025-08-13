<script>
export default {
    name: 'Jogo',
    data() {
        return {
            titulo: 'Jogo',
            alvos: [],
            cards: [],
            hoverTarget: null,
            feedback: ''
        }
    },
    computed: {
        pontuacao() {
            return this.cards.filter(c => c.locked).length
        },
        total() {
            return this.cards.length
        },
        terminou() {
            return this.total > 0 && this.pontuacao === this.total
        },
        poolCards() {
            return this.cards.filter(c => !c.placed)
        }
    },
    methods: {
        async CarregaJogo() { // Carrega o jogo.json
            const res = await fetch('/jogo.json')
            const data = await res.json()

            this.titulo = data.titulo || 'Jogo'

            this.alvos = data.etapas.map((etapa, i) => ({ // Mapeia etapas do json 
                id: `t${i + 1}`,
                nome: etapa.nome
            }))

            const alvoIdByNome = Object.fromEntries(this.alvos.map(a => [a.nome, a.id]))

            this.cards = data.etapas.map((etapa, i) => ({
                id: `c${i + 1}`,
                text: etapa.descricao,
                alvoNome: etapa.nome,
                alvoIdCorreto: alvoIdByNome[etapa.nome],
                locked: false,
                placed: null,
                ruim: false
            }))
            
            this.cards.sort(() => Math.random() - 0.5) // Cartas em posições aleatórias

        },

        onDragStart(ev, card) {
            if (card.locked) { 
                ev.preventDefault(); 
                return 
            }
            ev.dataTransfer.setData('text/plain', card.id)
            ev.dataTransfer.effectAllowed = 'move'
        },

        onDragOver(ev, targetId) {
            ev.preventDefault()
            this.hoverTarget = targetId
            ev.dataTransfer.dropEffect = 'move'
        },

        onDragLeave() {
            this.hoverTarget = null
        },

        onDrop(ev, targetId) {
            ev.preventDefault()
            const cardId = ev.dataTransfer.getData('text/plain')
            const card = this.cards.find(c => c.id === cardId)
            this.hoverTarget = null
            if (!card || card.locked) return

            if (card.alvoIdCorreto === targetId) {
                card.locked = true
                card.placed = targetId
            } else {
                card.placed = null
                card.ruim = true
                setTimeout(() => { card.ruim = false }, 300)
            }
        },

        returnToPool(ev) {
            ev.preventDefault()
            const cardId = ev.dataTransfer.getData('text/plain')
            const card = this.cards.find(c => c.id === cardId)
            if (!card || card.locked) return
            card.placed = null
        },

        cardsInTarget(targetId) {
            return this.cards.filter(c => c.placed === targetId)
        },

        reiniciaJogo() {
            this.cards = this.cards.map(c => ({ ...c, locked: false, placed: null, ruim: false }))
            this.hoverTarget = null
        },

        irTelaInicial() {
            this.$router.push({ name: 'TelaInicial' })
        }
    },
    mounted() {
        this.CarregaJogo()
    }
}
</script>

<template>
    <div class="app">
        <div class="cabecalho">
            <div class="h1">{{ titulo }}</div>
            <div class="pontuacao">Pontuação: {{ pontuacao }} / {{ total }}</div>
        </div>

        <div class="campo">
            <!-- Alvos -->
            <div class="zone">
                <div class="zonaTitulo">
                    <h3>
                        Arraste as descrições para o alvo correto
                    </h3>
                </div>
                <div class="alvos">
                    <div v-for="t in alvos" :key="t.id">
                        <div class="zonaTitulo">{{ t.nome }}</div>
                        <div class="dropzone" :class="{ hover: hoverTarget === t.id }"
                            @dragover="onDragOver($event, t.id)" @dragleave="onDragLeave" @drop="onDrop($event, t.id)">
                            <div class="cards">
                                <div v-for="c in cardsInTarget(t.id)" :key="c.id" class="card"
                                    :class="{ locked: c.locked }" draggable="false">
                                    {{ c.text }}
                                    <div class="meta">Correto</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Final -->
                <div v-if="terminou" class="final">
                    <div style="font-weight:700; margin-bottom:4px;">Parabéns! Você terminou o jogo! </div>
                    <div class="small">Sua pontuação final: {{ pontuacao }} de {{ total }}</div>
                </div>

                <div class="rodape">
                    <button class="botao" @click="reiniciaJogo">Reiniciar</button>
                    <button class="botao secundario" @click="irTelaInicial">Voltar</button>
                </div>
            </div>

            <!-- Pool -->
            <div class="pool" @dragover.prevent @drop="returnToPool">
                <div class="zonaTitulo">Cartas</div>
                <div class="cards">
                    <div v-for="c in poolCards" :key="c.id" class="card" :class="{ locked: c.locked, ruim: c.ruim }"
                        draggable="true" @dragstart="onDragStart($event, c)">
                        {{ c.text }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.zonaTitulo {
    margin-bottom: 2rem;
}

.alvos {
    margin-bottom: 2rem;
}
</style>