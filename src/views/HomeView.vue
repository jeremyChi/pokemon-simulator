<template>
    <div class="container">
        <aside>
            <h1 class="title">
                <span>精灵</span>
                <el-button type="primary" size="small" @click="exportPokemons()">导出队伍</el-button>
                <div class="import-container">
                    <el-button type="primary" class="btn-import" size="small" @click="importPokemons()">导入队伍 </el-button>
                    <input @change="onFileChange" ref="file" id="file" type="file" />
                </div>
                <el-button type="primary" size="small" @click="savePokemons()">保存</el-button>
                <el-button type="danger" size="small" @click="clearPokemons()">清空</el-button>
                <el-input style="margin-left: auto;" clearable v-model="keyword" placeholder="键入并按回车搜索" @keyup="onKeyUp" />
            </h1>

            <ul class="pokemons">
                <li class="pokemon" v-for="(pokemon,i) in pokemons">
                    <el-dropdown class="action">
                        <span class="el-dropdown-link">
                            操作
                            <el-icon class="el-icon--right">
                                <arrow-down />
                            </el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="setName(pokemon)">重命名</el-dropdown-item>
                                <el-dropdown-item divided @click="searchAvatar(pokemon)">搜索头像</el-dropdown-item>
                                <el-dropdown-item @click="setAvatar(pokemon)">设置头像</el-dropdown-item>
                                <el-dropdown-item divided @click="search(pokemon.name)">百科</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <div class="avatar" :mode="mode" :slotsfullfilled="pokemon.slots.filter(el=>el?.name).length == pokemon.slots.length" :skillexist="!!pokemon.slots.map(el=>el?.name).includes(activeSkill?.name)" :progress="pokemon.slots.filter(el=>!!el).length" @click="onAvatarClick(pokemon)">
                        <el-image style="width: 100%; height: 100%" v-if="pokemon.avatar" :src="pokemon.avatar" />
                    </div>
                    <span class="pokemon-name" v-if="pokemon.name">
                        <el-link class="link" @click="search(pokemon.name)">{{pokemon.name}}</el-link>
                    </span>
                    <span class="pokemon-name unnamed" v-else>未命名</span>
                    <ul class="slots">
                        <li class="slot" v-for="(slot,index) in pokemon.slots">
                            <el-select class="txt-select" :theme="getTheme(slot)" placeholder="请选择" v-model="pokemons[i].slots[index]" clearable value-key="name">
                                <el-option-group class="colorfull" label="战斗技能">
                                    <el-option :style="`background-color: ${el.theme};`" :value="el" :label="el.name" v-for="el in phases"></el-option>
                                </el-option-group>
                                <el-option-group label="工具技能">
                                    <el-option :disabled="!!(pokemons[i].slots.find(e=>e&&e.name == el.name))" :value="el" :label="el.name" v-for="el in toolSkills"></el-option>
                                </el-option-group>
                            </el-select>
                        </li>
                    </ul>
                </li>
            </ul>
        </aside>
        <main>
            <section class="options">
                <h1 class="title">配置 <el-link target="blank" href="https://www.wyaq.com/youxi/jinshouzhi/11994.html">金手指</el-link>
                </h1>
                <div class="card-group">
                    <el-card class="box-card">
                        <template #header>
                            <div class="card-header">
                                <span>工具技能用途</span>
                            </div>
                        </template>
                        <label>
                            <input type="radio" v-model="toolSkillUsage" value="tool-and-fight">
                            可用来攻击
                        </label>
                        <label>
                            <input type="radio" v-model="toolSkillUsage" value="tool-only">
                            仅用作工具
                        </label>
                    </el-card>
                    <el-card class="box-card">
                        <template #header>
                            <div class="card-header">
                                <span>姿态</span>
                            </div>
                        </template>
                        <label>
                            <input type="radio" v-model="position" value="attack">
                            进攻
                        </label>
                        <label>
                            <input type="radio" v-model="position" value="defence">
                            防守
                        </label>
                    </el-card>
                </div>
            </section>
            <section class="result-panel">
                <h1 class="title">预览</h1>
                <div class="card-group">
                    <el-card class="box-card">
                        <template #header>
                            <div class="card-header">
                                <span>已选择的工具技能</span><span v-if="(toolSkills.length) == (pickedToolSkills.length)">👍</span>
                                <div class="skill-assign-tip" v-if="mode == 'skill-assign'">
                                    <el-button type="danger" size="small" @click="cancelSkillAssign()">取消技能分配</el-button>
                                </div>
                            </div>
                        </template>

                        <ul class="data-list">
                            <li class="data-item" :class="{'phase' : toolSkillUsage == 'tool-and-fight', 'active' : activeSkill?.name == el.name}" v-for="el in toolSkills" @click="handleAssignToolSkill(el)">
                                <label>
                                    <input class="hidden" disabled type="checkbox" :value="el" v-model="pickedToolSkills">
                                    <span class="name" :theme="getTheme(el)" style="color: #000;">{{el.name}}</span>
                                </label>
                            </li>
                        </ul>
                    </el-card>
                    <el-card class="box-card">
                        <template #header>
                            <div class="card-header">
                                <p class="title" v-if="position == 'attack'"><span class="emoji">😍</span><span v-if="phases.length == phasesWeCanDefeat.length">👍</span></p>
                                <p class="title" v-else><span class="emoji">😱</span><span v-if="phasesWeFeared.length == 0">👍</span></p>
                            </div>
                        </template>
                        <ul class="data-list">
                            <li class="data-item phase" v-for="phase in phases">
                                <label @click="search(phase.name)">
                                    <input class="hidden" disabled v-if="position == 'attack'" type="checkbox" :value="phase.name" v-model="phasesWeCanDefeat">
                                    <input class="hidden" disabled v-else type="checkbox" :value="phase.name" v-model="phasesWeFeared">
                                    <el-popover trigger="hover" width="500">
                                        <template #reference>
                                            <span class="name" :theme="phase.theme">{{phase.name}}</span>
                                        </template>
                                        <div class="phase-info-panel">
                                            <div class="card-group">
                                                <el-card class="box-card">
                                                    <template #header>
                                                        <div class="card-header">
                                                            <span class="emoji">😍</span>
                                                        </div>
                                                    </template>
                                                    <ul class="data-list">
                                                        <li class="data-item phase" @click="search(el)" v-for="el in phase.beGoodAt">
                                                            <span class="name" :theme="phases.find(e=>e.name == el).theme || null">{{el}}</span>
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
                                                        <li class="data-item phase" @click="search(el)" v-for="el in phase.beAfraidOf">
                                                            <span class="name" :theme="phases.find(e=>e.name == el).theme || null">{{el}}</span>
                                                        </li>
                                                    </ul>
                                                </el-card>
                                            </div>
                                        </div>
                                    </el-popover>
                                </label>
                            </li>
                        </ul>
                    </el-card>
                </div>
            </section>
        </main>
        <el-dialog v-model="dialogVisible" :title="`搜索 “${keyword}”`" width="90%" top="60px">
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
import {
    ArrowDown
}
from '@element-plus/icons-vue'
let emptyPokemons = [{
    name: '',
    avatar: '',
    slots: [null, null, null, null, ],
}, {
    name: '',
    avatar: '',
    slots: [null, null, null, null, ],
}, {
    name: '',
    avatar: '',
    slots: [null, null, null, null, ],
}, {
    name: '',
    avatar: '',
    slots: [null, null, null, null, ],
}, {
    name: '',
    avatar: '',
    slots: [null, null, null, null, ],
}, {
    name: '',
    avatar: '',
    slots: [null, null, null, null, ],
}]
export default {
    components: {
        ArrowDown
    },
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
            mode: '',
            activeSkill: null,
            keyword: '',
            dialogVisible: false,
            toolSkillUsage: 'tool-and-fight',
            position: 'attack',
            pokemons: emptyPokemons,
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
                },{
                    name: '头突',
                    type: 'tool',
                    phase: '一般',
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
            this.keyword = input ? input : this.keyword;
            this.dialogVisible = true;
        },
        searchAvatar(pokemon) {
            window.open(`https://cn.bing.com/images/search?q=宝可梦 ${pokemon.name}&qft=+filterui:photo-transparent&form=IRFLTR&first=1&tsc=ImageHoverTitle`)
        },
        savePokemons() {
            localStorage.setItem('pokemons', JSON.stringify(this.pokemons));
        },
        clearPokemons() {
            this.pokemons = emptyPokemons;
        },
        downFile(content, filename) {
            var ele = document.createElement('a'); // 创建下载链接
            ele.download = filename; //设置下载的名称
            ele.style.display = 'none'; // 隐藏的可下载链接
            // 字符内容转变成blob地址
            var blob = new Blob([content]);
            ele.href = URL.createObjectURL(blob);
            // 绑定点击时间
            document.body.appendChild(ele);
            ele.click();
            // 然后移除
            document.body.removeChild(ele);
        },
        exportPokemons() {
            this.$messageBox.prompt('', '设置文件名', {
                confirmButtonText: '导出',
                cancelButtonText: '取消',
            }).then(({
                value
            }) => {
                this.downFile(JSON.stringify(this.pokemons), `${value||'队伍配置'}.json`)
            }).catch(() => {

            })
        },
        importPokemons() {
            this.$refs['file'].click()
        },
        onFileChange(event) {
            let self = this;
            let file = event.target.files[0];
            let reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = function(e) {
                self.pokemons = JSON.parse(this.result)
            };
        },
        getTheme(slot) {
            let {
                toolSkillUsage,
                phases
            } = this;
            let res = null;
            if (slot) {
                if (slot.type == 'tool') {
                    res = toolSkillUsage == 'tool-and-fight' ? phases.find(phase => phase.name == slot.phase).theme : null;
                }
                else {
                    res = slot.theme
                }
            }
            return res;
        },
        onAvatarClick(pokemon) {
            if (this.mode == 'skill-assign') {
                this.assignToolSkill(pokemon)
            }
            else {
                this.setAvatar(pokemon)
            }
        },
        setAvatar(pokemon) {
            this.$messageBox.prompt('', '设置个头像吧！', {
                confirmButtonText: '设置',
                cancelButtonText: '取消',
                inputValue: pokemon.avatar,
            }).then(({
                value
            }) => {
                pokemon.avatar = value
            }).catch(() => {

            })
        },
        setName(pokemon) {
            this.$messageBox.prompt('', '给宝可梦什么名字？', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                inputValue: pokemon.name,
            }).then(({
                value
            }) => {
                pokemon.name = value
            }).catch(() => {

            })
        },
        handleAssignToolSkill(skill) {
            if (this.pokemons.some(pokemon => {
                    return pokemon.slots.filter(pokemon => pokemon && pokemon.name).length != pokemon.slots.length
                })) {
                this.mode = 'skill-assign';
                this.activeSkill = skill;
                this.$message.warning('点击左侧精灵球以分配')
            }
            else {
                this.$message.warning('所有精灵技能已满，无法分配')
            }

        },
        assignToolSkill(pokemon) {
            let emptySlotIndex = pokemon.slots.findIndex(el => !el || !el.name);
            if (emptySlotIndex < 0) {
                this.$message.warning('该精灵技能槽已满')
            }
            else {
                pokemon.slots[emptySlotIndex] = this.activeSkill;
                this.cancelSkillAssign()
            }
        },
        cancelSkillAssign() {
            this.mode = '';
            this.activeSkill = null;
        },
        onKeyUp(e) {
            if (e.which == 13) {
                this.search()
            }
        },
    },

    mounted() {
        let pokemonsInLocalStorage = localStorage.getItem('pokemons');

        if (pokemonsInLocalStorage) {
            pokemonsInLocalStorage = JSON.parse(localStorage.getItem('pokemons'));
            pokemonsInLocalStorage.forEach((el, i) => {
                el.slots = el.slots.map(slot => {
                    return this.toolSkills.find(skill => skill.name == slot.name) || this.phases.find(skill => skill.name == slot.name) || null
                })
            })
            this.pokemons = pokemonsInLocalStorage
        }
    },
}
</script>
<style scoped lang="scss">
* {
    margin: 0;
    padding: 0;
    line-height: 1;
}

ul {
    list-style-type: none;
}

.container {
    display: flex;
    padding: 15px;
}

.hidden {
    display: none;
}

aside {
    margin-right: 15px;

    .title {
        display: flex;
        align-items: center;

        &>* {
            margin-left: 10px;
            flex-shrink: 0;
        }

        .el-input {
            width: 11.2em;
        }
    }
}

section+section {
    margin-top: 15px;
}

aside,
section {
    padding: 15px;
    border-radius: 10px;
    background: rgba(255, 255, 255, .9);
}

main {
    flex-grow: 1;
}

label {
    cursor: pointer;
}

input:checked+* {
    opacity: 1;
    font-weight: bold;
}

input:not(:checked)+* {
    opacity: .3;
}

.pokemons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;

    .pokemon {
        text-align: center;
        position: relative;
    }

    .action {
        position: absolute;
        right: 10px;
        top: 10px;

        .el-dropdown-link {
            cursor: pointer;
            color: var(--el-color-primary);
            display: flex;
            align-items: center;
        }
    }
}


.pokemon-name {
    width: 10em;
    text-align: center;
    font-size: 16px;
    padding: 5px;
    margin-bottom: 10px;
    display: inline-block;

    &,
    ::v-deep .el-link__inner {
        color: #000;
        font-size: 16px;
        font-weight: bold;
    }

    &.unnamed {
        color: #ccc;
    }
}

.pokemons .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin: 10px auto;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 5px solid;
    overflow: hidden;
    cursor: pointer;

    &[mode="skill-assign"] {
        &[skillexist="false"][slotsfullfilled="false"] {
            animation: blink .8s infinite;
        }

        &[skillexist="true"],
        &[slotsfullfilled="true"] {
            pointer-events: none;
        }
    }

    &:before {
        content: '';
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 0;
        background-image: url('@/assets/pokemon-ball.png');
        background-size: 100% auto;
        background-position: bottom;
    }

    &[progress='1']:before {
        height: 25%;
    }

    &[progress='2']:before {
        height: 50%;
    }

    &[progress='3']:before {
        height: 75%;
    }

    &[progress='4']:before {
        height: 100%;
    }
}

.pokemon .slots {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px 10px;
    width: 260px;
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

.card-group {
    display: flex;
    align-items: center;
    margin-top: 20px;
}

.box-card+.box-card {
    margin-left: 20px;
}


.detail-iframe {
    width: 100%;
    height: calc(100vh - 300px);
}

.import-container {
    display: flex;
    position: relative;

    input {
        position: absolute;
        width: 100%;
        left: 0;
        height: 100%;
        top: 0;
        visibility: hidden;
    }
}


.el-select-group {
    .el-select-dropdown__item {
        &.selected {
            box-shadow: 0 0 10px #000;
        }

        margin: 5px;
    }


}

.colorfull .el-select-dropdown__item {
    color: #fff;
}


::v-deep .el-input__inner {
    font-size: 16px;
}

[theme] {
    color: #fff !important;

    ::v-deep {
        .el-input__inner {
            color: #fff;
        }

        .el-input__wrapper {
            box-shadow: none;
        }
    }
}

[theme='#9099a1'] {
    background-color: #9099a1;

    ::v-deep .el-input__wrapper {
        background-color: #9099a1;
    }
}

[theme='#cc406a'] {
    background-color: #cc406a;

    ::v-deep .el-input__wrapper {
        background-color: #cc406a;
    }
}

[theme='#8ea8de'] {
    background-color: #8ea8de;

    ::v-deep .el-input__wrapper {
        background-color: #8ea8de;
    }
}

[theme='#A96AC8'] {
    background-color: #A96AC8;

    ::v-deep .el-input__wrapper {
        background-color: #A96AC8;
    }
}

[theme='#D87844'] {
    background-color: #D87844;

    ::v-deep .el-input__wrapper {
        background-color: #D87844;
    }
}

[theme='#C5B68B'] {
    background-color: #C5B68B;

    ::v-deep .el-input__wrapper {
        background-color: #C5B68B;
    }
}

[theme='#91C02E'] {
    background-color: #91C02E;

    ::v-deep .el-input__wrapper {
        background-color: #91C02E;
    }
}

[theme='#5368AC'] {
    background-color: #5368AC;

    ::v-deep .el-input__wrapper {
        background-color: #5368AC;
    }
}

[theme='#598A9D'] {
    background-color: #598A9D;

    ::v-deep .el-input__wrapper {
        background-color: #598A9D;
    }
}

[theme='#FD9C54'] {
    background-color: #FD9C54;

    ::v-deep .el-input__wrapper {
        background-color: #FD9C54;
    }
}

[theme='#4F8FD5'] {
    background-color: #4F8FD5;

    ::v-deep .el-input__wrapper {
        background-color: #4F8FD5;
    }
}

[theme='#61BB5A'] {
    background-color: #61BB5A;

    ::v-deep .el-input__wrapper {
        background-color: #61BB5A;
    }
}

[theme='#F3D23B'] {
    background-color: #F3D23B;

    ::v-deep .el-input__wrapper {
        background-color: #F3D23B;
    }
}

[theme='#F97178'] {
    background-color: #F97178;

    ::v-deep .el-input__wrapper {
        background-color: #F97178;
    }
}

[theme='#76CFC0'] {
    background-color: #76CFC0;

    ::v-deep .el-input__wrapper {
        background-color: #76CFC0;
    }
}

[theme='#0A6DC2'] {
    background-color: #0A6DC2;

    ::v-deep .el-input__wrapper {
        background-color: #0A6DC2;
    }
}

[theme='#5A5265'] {
    background-color: #5A5265;

    ::v-deep .el-input__wrapper {
        background-color: #5A5265;
    }
}

[theme='#EB8FE6'] {
    background-color: #EB8FE6;

    ::v-deep .el-input__wrapper {
        background-color: #EB8FE6;
    }
}

.emoji {
    font-size: 3em;
}

.skill-assign-tip {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #c45656;

    &>* {
        margin-left: 5px;
    }
}

@keyframes blink {
    from {
        opacity: 1;
    }

    50% {
        opacity: .2;
    }

    to {
        opacity: 1;
    }
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>