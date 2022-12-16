<template>
    <div style="height: 100%;">
        <div class="container ">
            <div class="phase-info-panel">
                <div class="card-group">
                    <el-card class="box-card">
                        <template #header>
                            <div class="card-header">
                                <span class="emoji">😍</span>
                            </div>
                        </template>
                        <ul class="data-list">
                            <li class="data-item phase" :key="el" v-for="el in phase?.beGoodAt">
                                <span class="name link" @click.stop="wiki(el)" :style="`background-color: ${types.find(i=>i.chinese == el).theme};`">{{el}}</span>
                            </li>
                        </ul>
                    </el-card>
                    <el-card class="box-card">
                        <template #header>
                            <div class="card-header">
                                <span class="emoji">😱</span>
                            </div>
                        </template>
                        <ul class="data-list">
                            <li class="data-item phase" :key="el" v-for="el in phase.beAfraidOf">
                                <span class="name link" @click.stop="wiki(el)" :style="`background-color: ${types.find(i=>i.chinese == el).theme};`">{{el}}</span>
                            </li>
                        </ul>
                    </el-card>
                </div>
            </div>
        </div>
        <wiki ref="wiki" :keyword="wikiKeyword"></wiki>
    </div>
</template>
<script>
import types from '../dataset/types.json'
import wiki from '../components/wiki.vue'
export default {
    name: 'phase-card',
    props: ['phase'],
    components: {
        wiki,
    },
    computed: {},
    data() {
        return {
            types,
            wikiKeyword: '',
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
.data-list {
    display: flex;
    flex-wrap: wrap;
}

.data-item {
    .name {
        padding: 5px 10px;
        font-size: 14px;
        white-space: nowrap;
        margin: 5px;
        border: 1px solid;
        box-sizing: border-box;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        box-sizing: border-box;
    }

}

.box-card+.box-card {
    margin-top: 20px;
}

.emoji {
    font-size: 2em;
}
</style>