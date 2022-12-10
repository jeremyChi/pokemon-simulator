<template>
    <div>
        <div class="container">
            <ul class="team">
                <header class="tools">
                    <el-button type="primary" @click="exportPokemons()">导出队伍</el-button>
                    <div class="import-container">
                        <el-button type="primary" class="btn-import" @click="importPokemons()">导入队伍 </el-button>
                        <input class="hidden" @change="onFileChange" ref="file" id="file" type="file" />
                    </div>
                    <el-button type="primary" @click="savePokemons()">保存至缓存</el-button>
                    <el-popconfirm confirm-button-text="清空" cancel-button-text="再想想" title="确认清空?" @confirm="clearPokemons()">
                        <template #reference>
                            <el-button type="danger">清空</el-button>
                        </template>
                    </el-popconfirm>
                    <el-input style="width:12em; margin-left: auto;" clearable v-model="wikiKeyword" placeholder="键入并按回车搜索wiki" @keyup="onKeyUp" />
                </header>
                <li class="position" :key="pokemon.id" v-for="(pokemon,i) in pokemons">
                    <div class="pokemon-card">
                        <el-icon class="btn-remove btn-remove-pokemon" @click="pokemons.splice(i,1)">
                            <CircleCloseFilled />
                        </el-icon>
                        <section class="pokemon-card">
                            <pokemon-card :pokemon="pokemon"></pokemon-card>
                        </section>
                        <section class="moves">
                            <ul>
                                <li :key="move.id" v-for="(move,i) in pokemon.moves">
                                    <el-icon @click="pokemon.moves.splice(i,1)" class="btn-remove btn-remove-move">
                                        <Remove />
                                    </el-icon>
                                    <move-card :move="move"></move-card>
                                    <el-divider v-if="i < pokemon.moves.length-1" />
                                </li>
                                <li v-if="!pokemon.moves || pokemon.moves.length < 4">
                                    <el-button @click="chooseMove(i)" size="small" type="primary">添加技能</el-button>
                                </li>
                            </ul>
                        </section>
                        <section class="species-strength">
                            <base-card :base="pokemon.base"></base-card>
                        </section>
                    </div>
                </li>
                <li class="position" v-show="pokemons.length<6">
                    <el-icon class="btn-add" @click="choosePokemon()">
                        <Plus />
                    </el-icon>
                </li>
            </ul>

            <el-drawer size="580" v-model="pokemonDrawer" title="请选择宝可梦">
                <pokemon-list @pick="onPokemonPick" style="height: calc(100vh - 120px);" mode="select" multiple="true"></pokemon-list>
            </el-drawer>

            <el-drawer size="580" v-model="moveDrawer" title="请选择技能">
                <move-list @pick="onMovePick" style="height: calc(100vh - 120px);" mode="select" multiple="true"></move-list>
            </el-drawer>
        </div>
        <wiki ref="wiki" :keyword="wikiKeyword"></wiki>
    </div>
</template>
<script>
import pokemonList from '../components/pokemon-list.vue'
import pokemonCard from '../components/pokemon-card.vue'
import moveList from '../components/move-list.vue'
import moveCard from '../components/move-card.vue'
import baseCard from '../components/base-card.vue'
import wiki from '../components/wiki.vue'
export default {
    components: {
        pokemonList,
        pokemonCard,
        moveList,
        moveCard,
        baseCard,
        wiki,
    },
    computed: {},
    data() {
        return {
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
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-family: 'dinpro';
}

.btn-remove {
    position: absolute;
    cursor: pointer;
    color: red;
    font-size: 2em;
    z-index: 1;
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
    display: inline-grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 15px;

    .position {
        background-color: rgba(255, 255, 255, .75);
        padding: 5px;
        width: 400px;
        position: relative;
    }

    .btn-add {
        font-size: 4em;
        font-weight: bold;
        cursor: pointer;
        width: 100%;
        height: 100%;
    }

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
            background-color: #efefef;
        }

        section:nth-of-type(3) {
            grid-column-start: 1;
            grid-column-end: 3;
        }

        .pokemon-card {
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
                    right: 0px;
                    top: 10px;
                    font-size: 16px;
                }
            }

            .el-divider {
                margin: 10px 0;
            }
        }

    }
}
</style>