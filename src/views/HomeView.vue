<template>
    <div class="container">
        <aside>
            <h1 class="title">
                <span>精灵</span>
                <el-input v-model="keyword" placeholder="输入关键字并按回车搜索" @change="search(keyword)" />
            </h1>
            <ul class="pokemons">
                <li class="pokemon" :progress="pokemon.slots.filter(el=>!!el).length" v-for="(pokemon,i) in pokemons">
                    <div class="avatar">
                        <span class="pokemon-name">
                            <input type="text">
                        </span>
                    </div>
                    <ul class="slots">
                        <li class="slot" v-for="(slot,index) in pokemon.slots">
                            <el-select class="txt-select" placeholder="请选择" v-model="pokemons[i].slots[index]" clearable value-key="name">
                                <el-option-group label="工具技能">
                                    <el-option :disabled="!!(pokemons[i].slots.find(e=>e&&e.name == el.name))" :value="el" :label="el.name" v-for="el in toolSkills"></el-option>
                                </el-option-group>

                                <el-option-group label="战斗技能">
                                    <el-option :style="`color: ${el.theme};`" :value="el" :label="el.name" v-for="el in phases"></el-option>
                                </el-option-group>

                            </el-select>
                        </li>
                    </ul>
                </li>
            </ul>
        </aside>
        <section>
            <header class="options">
                <h1 class="title">配置</h1>
                <div class="option-item">
                    <p class="title">工具技能用途:</p>
                    <label>
                        <input type="radio" v-model="toolSkillUsage" value="tool-only">
                        仅用作工具
                    </label>
                    <label>
                        <input type="radio" v-model="toolSkillUsage" value="tool-and-fight">
                        可用来攻击
                    </label>
                </div>

                <div class="option-item">
                    <p class="title">姿态:</p>
                    <label>
                        <input type="radio" v-model="position" value="attack">
                        进攻
                    </label>
                    <label>
                        <input type="radio" v-model="position" value="defence">
                        防守
                    </label>
                </div>
            </header>

            <main class="result-panel">
                <h1 class="title">预览</h1>
                <div class="result-item">
                    <p class="title">已选择的工具技能(剩余:{{(toolSkills.length)-(pickedToolSkills.length)}}):</p>
                    <ul class="data-list">
                        <li class="data-item" v-for="el in toolSkills">
                            <label>
                                <input class="hidden" disabled type="checkbox" :value="el" v-model="pickedToolSkills">
                                <span class="name" style="color: #000;">{{el.name}}</span>
                            </label>
                        </li>
                    </ul>
                </div>
                <div class="result-item">
                    <p class="title" v-if="position == 'attack'">擅于击败(剩余:{{(phases.length)-(phasesWeCanDefeat.length)}}):</p>
                    <p class="title" v-else>害怕碰到(剩余:{{phasesWeFeared.length}}):</p>
                    <ul class="data-list">
                        <li class="data-item phase" v-for="phase in phases">
                            <label @click="search(phase.name)">
                                <input class="hidden" disabled v-if="position == 'attack'" type="checkbox" :value="phase.name" v-model="phasesWeCanDefeat">
                                <input class="hidden" disabled v-else type="checkbox" :value="phase.name" v-model="phasesWeFeared">
                                <el-popover trigger="hover" width="300">
                                    <template #reference>
                                        <span class="name" :style="`background-color: ${phase.theme};`">{{phase.name}}</span>
                                    </template>
                                    <div class="phase-info-panel">
                                        <p class="title">擅于击败:</p>
                                        <ul class="data-list">
                                            <li class="data-item phase" v-for="el in phase.beGoodAt">
                                                <span class="name" :style="`background-color: ${phases.find(e=>e.name == el).theme};`">{{el}}</span>
                                            </li>
                                        </ul>
                                        <p class="title">害怕碰到:</p>
                                        <ul class="data-list">
                                            <li class="data-item phase" v-for="el in phase.beAfraidOf">
                                                <span class="name" :style="`background-color: ${phases.find(e=>e.name == el).theme};`">{{el}}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </el-popover>
                            </label>
                        </li>
                    </ul>
                </div>
            </main>
        </section>
        <el-dialog v-model="dialogVisible" title="搜索详情" width="90%">
            <iframe class="detail-iframe" :src="`https://wiki.52poke.com/wiki/${keyword}`" frameborder="0"></iframe>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">关闭</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
export default {
    computed: {
        pickedSkills: function() {
            return this.pokemons.map(el => el.slots).flat().filter(el => !!el)
        },
        pickedToolSkills: function() {
            return this.pickedSkills.filter(el => el && el.type == 'tool')
        },

        pickedPhaseSkills: function() {
            return this.pickedSkills.filter(el => el && el.type != 'tool')
        },
        pickedPhases: function() {
            let res = []
            let {
                toolSkillUsage
            } = this;
            if (toolSkillUsage == 'tool-only') {
                res = this.pickedPhaseSkills.map(el => el.name)
            }
            else {
                res = this.pickedSkills.map(el => {
                    return el.type == 'tool' ? el.phase : el.name
                })
            }
            return [...new Set(res)]
        },
        phasesWeCanDefeat: function() {
            return [...new Set(this.pickedPhases.map(el => {
                return this.phases.find(phase => phase.name == el).beGoodAt
            }).flat())]
        },

        phasesWeFeared: function() {
            let weFeared = [...new Set(this.pickedPhases.map(el => {
                return this.phases.find(phase => phase.name == el).beAfraidOf
            }).flat())];
            return [...new Set([...weFeared].filter(x => !new Set(this.phasesWeCanDefeat).has(x)))]
        },
    },
    data() {
        return {
            keyword: '',
            dialogVisible: false,
            toolSkillUsage: 'tool-only',
            position: 'attack',
            pokemons: [{
                slots: [null, null, null, null, ],
            }, {
                slots: [null, null, null, null, ],
            }, {
                slots: [null, null, null, null, ],
            }, {
                slots: [null, null, null, null, ],
            }, {
                slots: [null, null, null, null, ],
            }, {
                slots: [null, null, null, null, ],
            }],
            toolSkills: [{
                    name: '旋涡',
                    type: 'tool',
                    phase: '水',
                },
                {
                    name: '冲浪',
                    type: 'tool',
                    phase: '水',
                },
                {
                    name: '攀瀑',
                    type: 'tool',
                    phase: '水',
                },
                {
                    name: '飞天',
                    type: 'tool',
                    phase: '飞行',
                },
                {
                    name: '居合斩',
                    type: 'tool',
                    phase: '一般',
                },
                {
                    name: '闪光',
                    type: 'tool',
                    phase: '一般',
                },
                {
                    name: '挖洞',
                    type: 'tool',
                    phase: '地面',
                },
                {
                    name: '怪力',
                    type: 'tool',
                    phase: '一般',
                },
                {
                    name: '碎岩',
                    type: 'tool',
                    phase: '格斗',
                },
            ],
            phases: [{
                name: '一般',
                theme: '#9099a1',
                beGoodAt: [],
                beAfraidOf: ['格斗', ],
            }, {
                name: '格斗',
                theme: '#cc406a',
                beGoodAt: ['一般', '岩石', '钢', '冰', '恶', ],
                beAfraidOf: ['飞行', '超能力', '妖精', ],
            }, {
                name: '飞行',
                theme: '#8ea8de',
                beGoodAt: ['格斗', '虫', '草', ],
                beAfraidOf: ['岩石', '草', '冰', ],
            }, {
                name: '毒',
                theme: '#A96AC8',
                beGoodAt: ['草', '妖精', ],
                beAfraidOf: ['地面', '超能力', ],
            }, {
                name: '地面',
                theme: '#D87844',
                beGoodAt: ['毒', '岩石', '钢', '火', '电', ],
                beAfraidOf: ['水', '草', '冰', ],
            }, {
                name: '岩石',
                theme: '#C5B68B',
                beGoodAt: ['飞行', '虫', '火', '冰', ],
                beAfraidOf: ['格斗', '地面', '钢', '水', '草', ],
            }, {
                name: '虫',
                theme: '#91C02E',
                beGoodAt: ['草', '超能力', '恶', ],
                beAfraidOf: ['飞行', '岩石', '火', ],
            }, {
                name: '幽灵',
                theme: '#5368AC',
                beGoodAt: ['幽灵', '超能力', ],
                beAfraidOf: ['幽灵', '恶', ],
            }, {
                name: '钢',
                theme: '#598A9D',
                beGoodAt: ['岩石', '冰', '妖精', ],
                beAfraidOf: ['格斗', '地面', '火', ],
            }, {
                name: '火',
                theme: '#FD9C54',
                beGoodAt: ['虫', '钢', '草', '冰', ],
                beAfraidOf: ['地面', '岩石', '水', ],
            }, {
                name: '水',
                theme: '#4F8FD5',
                beGoodAt: ['地面', '岩石', '火', ],
                beAfraidOf: ['草', '电', ],
            }, {
                name: '草',
                theme: '#61BB5A',
                beGoodAt: ['地面', '岩石', '水', ],
                beAfraidOf: ['飞行', '毒', '虫', '火', '冰', ],
            }, {
                name: '电',
                theme: '#F3D23B',
                beGoodAt: ['飞行', '水', ],
                beAfraidOf: ['地面', ],
            }, {
                name: '超能力',
                theme: '#F97178',
                beGoodAt: ['格斗', '毒', ],
                beAfraidOf: ['虫', '幽灵', '恶', ],
            }, {
                name: '冰',
                theme: '#76CFC0',
                beGoodAt: ['飞行', '地面', '草', '龙', ],
                beAfraidOf: ['格斗', '岩石', '钢', '火', ],
            }, {
                name: '龙',
                theme: '#0A6DC2',
                beGoodAt: ['龙', ],
                beAfraidOf: ['冰', '龙', '妖精', ],
            }, {
                name: '恶',
                theme: '#5A5265',
                beGoodAt: ['幽灵', '超能力', ],
                beAfraidOf: ['格斗', '虫', '妖精', ],
            }, {
                name: '妖精',
                theme: '#EB8FE6',
                beGoodAt: ['格斗', '龙', '恶', ],
                beAfraidOf: ['毒', '钢', ],
            }, ]
        }
    },

    methods: {
        search(input) {
            this.keyword = input;
            this.dialogVisible = true;
        },
    },

    mounted() {

    },
}
</script>
<style scoped>
* {
    margin: 0;
    padding: 0;
}

ul {
    list-style-type: none;
}

.container {
    display: flex;
    padding: 30px;
}

aside {
    padding: 30px;
    border: 1px solid #666;
    border-radius: 10px;
    margin-right: 30px;
}

aside .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

aside .title span {
    flex-shrink: 0;
}

aside .title .el-input {
    width: 16em;
}

aside,
header,
main {
    padding: 30px;
    border: 1px solid #666;
    border-radius: 10px;
}

main {
    margin-top: 30px;
}

section {
    flex-grow: 1;
}

label {
    cursor: pointer;
}

.hidden {
    display: none;
}


input:checked+* {
    opacity: 1;
    font-weight: bold;
    border: 3px solid #000 !important;
}

input:not(:checked)+* {
    opacity: .7;
}

.pokemons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 30px;
}

.pokemon .avatar {
    position: relative;
    overflow: hidden;
}

.pokemon .avatar .pokemon-name {
    position: relative;
    z-index: 1;
    text-align: center;
}

.pokemon-name input {
    width: 6em;
    text-align: center;
}

.pokemon .avatar:before {
    content: '';
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    background-color: #ccc;
}

.pokemon[progress='1'] .avatar:before {
    height: 25%;
}

.pokemon[progress='2'] .avatar:before {
    height: 50%;
}

.pokemon[progress='3'] .avatar:before {
    height: 75%;
}

.pokemon[progress='4'] .avatar:before {
    height: 100%;
}

.pokemon .slots {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
}

.pokemons .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 1px solid #000;
    margin: 10px auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.data-list {
    display: flex;
    flex-wrap: wrap;
}

.data-item .name {
    padding: 2px 10px;
    border-radius: 10px;
    font-size: 14px;
    white-space: nowrap;
    margin: 5px;
    border: 1px solid;
    box-sizing: border-box;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
}

.data-item.phase .name {
    border: none;
}

.option-item,
.result-item {
    margin: 20px 0;
}

.txt-select {
    width: 100px;
}

.detail-iframe {
    width: 100%;
    height: 60vh;
}
</style>