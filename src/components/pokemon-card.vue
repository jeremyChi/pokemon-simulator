<template>
    <div>
        <div class="container">
            <section class="basic">
                <img class="avatar" :src="`/src/dataset/images/${`${pokemon.id}`.padStart(3,0)}.png`">
                <!-- <img class="avatar" :src="`https://img.pokemondb.net/sprites/home/normal/2x/${pokemon.name.english.toLowerCase()}.jpg`"> -->
                <el-popover placement="top-end" title="宝可梦详情" :width="300" trigger="hover">
                    <template #reference>
                        <span @click.stop="wiki(pokemon.name.chinese)" class="pokemon-name link">{{pokemon.name.chinese}} <small>[{{`${`${pokemon.id}`.padStart(3,0)}`}}]</small> </span>
                    </template>
                    <base-card :base="pokemon.base"></base-card>
                </el-popover>

                <ul class="type">
                    <li @click.stop="wiki(type)" class="type-tag link" :style="`background-color: ${types.find(el=>el.english == type).theme};`" v-for="type in pokemon.type" :key="type">
                        <el-popover placement="top-start" trigger="hover" width="300">
                            <template #reference>
                                {{types.find(el=>el.english == type).chinese}}
                            </template>
                            <phase-card :phase="types.find(el=>el.english == type)"></phase-card>
                        </el-popover>
                    </li>
                </ul>
            </section>
            <wiki ref="wiki" :keyword="wikiKeyword"></wiki>
        </div>
    </div>
</template>
<script>
import wiki from '../components/wiki.vue'
import types from '../dataset/types.json'
import baseCard from './base-card.vue'
import phaseCard from './phase-card.vue'
export default {
    name: 'pokemon-card',
    props: ['pokemon', 'showDetail'],
    components: {
        wiki,
        baseCard,
        phaseCard,
    },
    computed: {},
    data() {
        return {
            wikiKeyword: '',
            types,
        }
    },

    methods: {
        wiki(input) {
            this.wikiKeyword = input ? input : this.wikiKeyword;
            this.$refs['wiki'].show()
        },
    },

    mounted() {},
}
</script>
<style scoped lang="scss">
.basic {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    padding: 10px;

    .avatar {
        height: 100px;
    }

    .pokemon-name {
        margin-top: 10px;
        font-size: 18px;
        font-weight: bold;
        color: #000;

        small {
            font-size: 12px;
        }
    }

    .type {
        margin-top: 10px;
        display: flex;
        align-items: center;

        .type-tag {
            padding: 5px 10px;
            color: #fff;
            font-size: 14px;

            &+.type-tag {
                margin-left: 5px;
            }
        }
    }
}

</style>