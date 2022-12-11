<template>
    <div>
        <div class="container">
            <header class="tools">
                <el-button-group>
                    <el-button type="primary" @click="pokemonDrawer=true">宝可梦列表</el-button>
                    <el-button type="primary" @click="moveDrawer=true">技能列表</el-button>
                </el-button-group>

                <el-button-group>
                    <el-button type="primary" @click="exportPokemons()">导出队伍</el-button>
                    <el-button type="primary" class="btn-import" @click="importPokemons()">导入队伍 </el-button>
                </el-button-group>
                <input class="hidden" @change="onFileChange" ref="file" id="file" type="file" />

                <el-button-group>
                    <el-button type="primary" @click="$refs['phase-checking'].show()">属性检测</el-button>
                </el-button-group>

                <el-button-group>
                    <el-button type="primary" @click="savePokemons()">保存至缓存</el-button>
                    <el-popconfirm confirm-button-text="清空" cancel-button-text="再想想" title="确认清空?" @confirm="clearPokemons()">
                        <template #reference>
                            <el-button type="danger">清空</el-button>
                        </template>
                    </el-popconfirm>
                </el-button-group>

                <el-link target="blank" href="https://www.wyaq.com/youxi/jinshouzhi/11994.html">金手指</el-link>
                <el-input style="width:12em; margin-left: auto;" clearable v-model="wikiKeyword" placeholder="键入并按回车搜索wiki" @keyup="onKeyUp" />
            </header>

            <ul class="team" :grabbing="drag">
                <draggable class="members" v-model="pokemons" @start="drag=true" @end="drag=false" item-key="id">
                    <template #item="{element:pokemon,index:i}">
                        <li class="position">
                            <div class="pokemon-card">
                                <el-icon class="btn-remove btn-remove-pokemon" @click="pokemons.splice(i,1)">
                                    <CircleCloseFilled />
                                </el-icon>
                                <section class="basic">
                                    <pokemon-card :pokemon="pokemon"></pokemon-card>
                                </section>
                                <section class="moves">
                                    <ul>
                                        <draggable v-model="pokemon.moves" @start="drag=true" @end="drag=false" item-key="id">
                                            <template #item="{element,index}">
                                                <li>
                                                    <el-icon @click="pokemon.moves.splice(index,1)" class="btn-remove btn-remove-move">
                                                        <Remove />
                                                    </el-icon>
                                                    <move-card :move="element"></move-card>
                                                    <el-divider v-if="index < pokemon.moves.length-1" />
                                                </li>
                                            </template>
                                        </draggable>
                                        <li class="btn-add-move" v-if="!pokemon.moves || pokemon.moves.length < 4">
                                            <el-button @click="chooseMove(i)" size="small" type="primary">添加技能</el-button>
                                        </li>
                                    </ul>
                                </section>
                                <section class="species-strength">
                                    <base-card :base="pokemon.base"></base-card>
                                </section>
                            </div>
                        </li>
                    </template>
                </draggable>
            </ul>

            <div class="btn-add-member" v-show="pokemons.length<6">
                <el-icon class="btn-add" @click="choosePokemon()">
                    <Plus />
                </el-icon>
            </div>

            <el-drawer size="580" @opened="$refs['pokemon-list'].reset();$refs['pokemon-list'].clearSelection()" v-model="pokemonDrawer" title="请选择宝可梦">
                <pokemon-list ref="pokemon-list" @pick="onPokemonPick" style="height: calc(100vh - 120px);" mode="select" multiple="true"></pokemon-list>
            </el-drawer>

            <el-drawer size="580" @opened="$refs['move-list'].reset();$refs['move-list'].clearSelection()" v-model="moveDrawer" title="请选择技能">
                <move-list ref="move-list" @pick="onMovePick" style="height: calc(100vh - 120px);" mode="select" multiple="true"></move-list>
            </el-drawer>
        </div>
        <wiki ref="wiki" :keyword="wikiKeyword"></wiki>
        <phase-checking ref="phase-checking" :phases="teamPhases"></phase-checking>
    </div>
</template>
<script>
import draggable from 'vuedraggable'
import pokemonList from '../components/pokemon-list.vue'
import pokemonCard from '../components/pokemon-card.vue'
import moveList from '../components/move-list.vue'
import moveCard from '../components/move-card.vue'
import baseCard from '../components/base-card.vue'
import wiki from '../components/wiki.vue'
import phaseChecking from '../components/phase-checking.vue'
export default {
    components: {
        draggable,
        pokemonList,
        pokemonCard,
        moveList,
        moveCard,
        baseCard,
        wiki,
        phaseChecking,
    },
    computed: {
        teamPhases : function(){
            let {pokemons} = this;
            let moves = pokemons.map(el=>el.moves).flat();
            let phases = moves.map(el=>el.type)
            phases = [...new Set(phases)]
            return phases;
        },
    },
    data() {
        return {
            drag: false,
            pokemons: [],
            pokemonDrawer: false,
            moveDrawer: false,
            activePokemonIndex: '',
            wikiKeyword: '',
        }
    },

    methods: {
        choosePokemon() {
            this.pokemonDrawer = true;
        },
        chooseMove(i) {
            this.activePokemonIndex = i;
            this.moveDrawer = true;
        },
        onPokemonPick(pokemons) {
            if (this.pokemons.length + pokemons.length > 6) {
                this.$message.warning('队伍成员不可超过6个')
                return
            }
            this.pokemonDrawer = false;
            this.pokemons = [...this.pokemons, ...pokemons]
        },
        onMovePick(moves) {
            let pokemon = this.pokemons[this.activePokemonIndex];
            if (moves.length + (pokemon.moves || []).length > 4) {
                this.$message.warning('技能不可超过4个')
                return
            }
            this.moveDrawer = false;
            if (!pokemon.moves) {
                pokemon.moves = [...moves]
            }
            else {
                pokemon.moves = [...pokemon.moves, ...moves]
            }
        },
        savePokemons() {
            localStorage.setItem('pokemons', JSON.stringify(this.pokemons));
            this.$message.success('保存成功');
        },
        clearPokemons() {
            this.pokemons = [];
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
            if (!file) {
                return;
            }
            let reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = function(e) {
                self.pokemons = JSON.parse(this.result)
            };
        },
        onKeyUp(e) {
            if (e.which == 13) {
                this.$refs['wiki'].show()
            }
        },
    },

    mounted() {
        let pokemonsInLocalStorage = localStorage.getItem('pokemons');

        if (pokemonsInLocalStorage) {
            pokemonsInLocalStorage = JSON.parse(localStorage.getItem('pokemons'));
            this.pokemons = pokemonsInLocalStorage
        }
    },
}
</script>
<style scoped lang="scss">
.container {
    padding: 30px;
    width: 1290px;
    margin: 0 auto;
}


.tools {
    background-color: rgba(255, 255, 255, .75);
    grid-column-start: 1;
    grid-column-end: 4;
    display: flex;
    padding: 20px;

    &>*+* {
        margin-left: 20px;
    }
}

.team {
    margin-top: 15px;
}

.members {
    display: inline-grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 15px;
}

.btn-add-member {
    background-color: rgba(255, 255, 255, .75);
    padding: 5px;
    position: relative;
    margin-top: 15px;

    .btn-add {
        font-size: 4em;
        font-weight: bold;
        cursor: pointer;
        width: 100%;
        height: 100%;
    }
}

.position {
    background-color: rgba(255, 255, 255, .75);
    padding: 5px;
    width: 400px;
    position: relative;

    .pokemon-card {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto 140px;
        grid-gap: 5px;
        height: 100%;
        position: relative;

        .btn-remove-pokemon {
            left: 10px;
            top: 10px;
        }

        section {
            background-color: #fff;
        }

        section:nth-of-type(3) {
            grid-column-start: 1;
            grid-column-end: 3;
        }

        .basic {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .moves {
            ul {
                height: 100%;
                display: flex;
                flex-direction: column;
                padding: 10px;

                li {
                    text-align: center;
                    position: relative;
                }

                .btn-remove-move {
                    right: 5px;
                    top: 5px;
                    font-size: 16px;
                }
            }

            .el-divider {
                margin: 10px 0;
            }
        }
    }
}

.btn-add-move {
    margin-top: 10px;
}

[grabbing="true"] {
    cursor: grabbing;
}
</style>