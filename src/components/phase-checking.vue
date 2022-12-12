<template>
    <div>
        <main class="main">
            <el-card class="box-card">
                <template #header>
                    <div class="card-header">
                        <p class="title"><span class="emoji">😍</span><span>[{{phasesWeCanDefeat.length}}]</span><span v-if="types.length == phasesWeCanDefeat.length">👍</span></p>
                    </div>
                </template>
                <ul class="data-list">
                    <li class="data-item phase" v-for="cname in phasesWeCanDefeat">
                        <el-popover :show-after="400" :hide-after="40" placement="top-start" trigger="hover" width="300">
                            <template #reference>
                                <span class="name link" @click.stop="wiki(cname)" :style="`background-color: ${types.find(el=>el.chinese == cname).theme};`">{{cname}}</span>
                            </template>
                            <phase-card :phase="types.find(el=>el.chinese == cname)"></phase-card>
                        </el-popover>
                    </li>
                </ul>
            </el-card>
            <el-card class="box-card">
                <template #header>
                    <div class="card-header">
                        <p class="title"><span class="emoji">😱</span><span>[{{phasesWeFeared.length}}]</span><span v-if="!phasesWeFeared.length">👍</span></p>
                    </div>
                </template>
                <ul class="data-list">
                    <li class="data-item phase" v-for="cname in phasesWeFeared">
                        <el-popover :show-after="400" :hide-after="40" placement="top-start" trigger="hover" width="300">
                            <template #reference>
                                <span class="name link" @click.stop="wiki(cname)" :style="`background-color: ${types.find(el=>el.chinese == cname).theme};`">{{cname}}</span>
                            </template>
                            <phase-card :phase="types.find(el=>el.chinese == cname)"></phase-card>
                        </el-popover>
                    </li>
                </ul>
            </el-card>
        </main>
    </div>
</template>
<script>
import phaseCard from './phase-card.vue'
import wiki from '../components/wiki.vue'
import types from '../dataset/types.json'
export default {
    name: 'phase-checking',
    props: ['phases'],
    components: {
        phaseCard,
        wiki,
    },
    computed: {
        phaseInstances: function() {
            return this.phases.map(ename => this.types.find(type => type.english == ename))
        },
        phasesWeCanDefeat: function() {
            return [...new Set(this.phaseInstances.map(type => type.beGoodAt).flat())]
        },

        phasesWeFeared: function() {
            let weFeared = [...new Set(this.phaseInstances.map(type => type.beAfraidOf).flat())];
            return [...new Set([...weFeared].filter(x => !new Set(this.phasesWeCanDefeat).has(x)))]
        },
    },
    data() {
        return {
            types,
        }
    },

    methods: {

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
        margin: 5px 10px;
        border: 1px solid;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        cursor: pointer;
        box-sizing: border-box;
    }
}

.emoji {
    font-size: 2em;
}

.box-card+.box-card {
    margin-top: 20px;
}
</style>