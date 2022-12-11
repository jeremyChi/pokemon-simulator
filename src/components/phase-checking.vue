<template>
    <div>
        <el-dialog :append-to-body="true" v-model="visible" title="队伍属性检测" width="90%" top="60px">
            <main class="main">
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <p class="title"><span class="emoji">😍</span><span v-if="phases.length == phasesWeCanDefeat.length">👍</span></p>
                        </div>
                    </template>
                    <ul class="data-list">
                        <li class="data-item phase" v-for="cname in phasesWeCanDefeat">
                            <el-popover placement="top-start" trigger="hover" width="300">
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
                            <p class="title"><span class="emoji">😱</span><span v-if="!phasesWeFeared.length">👍</span></p>
                        </div>
                    </template>
                    <ul class="data-list">
                        <li class="data-item phase" v-for="cname in phasesWeFeared">
                            <el-popover placement="top-start" trigger="hover" width="300">
                                <template #reference>
                                    <span class="name link" @click.stop="wiki(cname)" :style="`background-color: ${types.find(el=>el.chinese == cname).theme};`">{{cname}}</span>
                                </template>
                                <phase-card :phase="types.find(el=>el.chinese == cname)"></phase-card>
                            </el-popover>
                        </li>
                    </ul>
                </el-card>

            </main>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="visible = false">关闭</el-button>
                </span>
            </template>
        </el-dialog>
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
            visible: false,
        }
    },

    methods: {
        show() {
            this.visible = true;
        },
        hide() {
            this.visible = false;
        },
    },

    mounted() {},
}
</script>
<style scoped lang="scss">
.main {
    width: 100%;
    height: calc(100vh - 300px);
}

.data-list {
    display: flex;
    flex-wrap: wrap;
}

.data-item {
    .name {
        padding: 0 20px;
        font-size: 18px;
        white-space: nowrap;
        margin: 5px 10px;
        border: 1px solid;
        box-sizing: border-box;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        cursor: pointer;
        box-sizing: border-box;
    }

    &.phase .name {
        border: none;
    }

    &.active .name {
        animation: blink .8s infinite;
    }
}

.emoji {
    font-size: 3em;
}

.box-card+.box-card {
    margin-top: 20px;
}
</style>