<template>
    <div>
        <div class="container">
            <el-form label-width="6em" class="search-bar" :inline="true" :model="searchForm">
                <el-form-item label="关键字">
                    <el-input style="width: 8em;" clearable v-model="searchForm.keyword" placeholder="名字/编号" />
                </el-form-item>
                <el-form-item label="世代">
                    <el-select style="width: 8em;" clearable v-model="searchForm.gen" placeholder="请选择">
                        <el-option v-for="gen in 7" :key="gen" :label="gen" :value="gen" />
                    </el-select>
                </el-form-item>
                <el-form-item label="第一属性">
                    <el-select style="width: 8em;" clearable v-model="searchForm.firstPhase" placeholder="请选择">
                        <el-option v-for="type in types" :key="type.english" :label="type.chinese" :value="type.english" />
                    </el-select>
                </el-form-item>
                <el-form-item label="第二属性">
                    <el-select style="width: 8em;" clearable v-model="searchForm.secondPhase" placeholder="请选择">
                        <el-option v-for="type in types" :key="type.english" :label="type.chinese" :value="type.english" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="reset()">重置</el-button>
                </el-form-item>
            </el-form>
            <div class="selection" style="line-height: 1.4;padding: 10px;">
                已经选择了:
                <ul>
                    <li v-for="(el,i) in selection">{{el.name.chinese}} <el-icon @click="selection.splice(i,1)" class="btn-remove btn-remove-selection">
                            <Remove />
                        </el-icon>
                    </li>
                </ul>
            </div>
            <ul class="pokemons" :mode="mode">
                <li class="pokemon" :checked="selection.map(el=>el.id).includes(pokemon.id)" v-for="(pokemon,i) in pokemons" :key="pokemon.id" @click="onPokemonClick(pokemon)">
                    <el-icon class="check-layer">
                        <CircleCheck />
                    </el-icon>
                    <pokemon-card :pokemon="pokemon"></pokemon-card>
                </li>
            </ul>
            <el-pagination background :page-size="size" :current-page="page" small layout="total, sizes, prev, pager, next" :total="total" @current-change="onPageChange" @size-change="onSizeChange" />
            <div class="action-bar" v-if="mode == 'select'">
                <el-button type="danger" @click="clearSelection()">清空选择</el-button>
                <el-button type="primary" @click="onSubmit()">确认选择</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import pokedex from '../dataset/pokedex.json'
import types from '../dataset/types.json'
import pokemonCard from './pokemon-card.vue'
export default {
    name: 'pokemon-list',
    props: {
        mode: {
            default: 'view',
        },
        multiple: {
            default: false,
        },
    },
    components: {
        pokemonCard,
    },
    computed: {
        pokemons: function() {
            let {
                keyword,
                firstPhase,
                secondPhase,
                gen,
            } = this.searchForm;
            let {
                page,
                size
            } = this;
            let genRange = this.getGenRange(gen)

            let res = pokedex.filter(pokemon => {
                let {
                    name,
                    id,
                    type,
                } = pokemon;

                let nameMatch = name.chinese.indexOf(keyword) > -1
                let idMatch = id == keyword
                let firstPhaseMatch = !firstPhase || (type[0] == firstPhase);
                let secondPhaseMatch = !secondPhase || (type[1] == secondPhase);
                let keywordMatch = !keyword || nameMatch || idMatch;

                let genMatched = !gen || (id >= genRange[0] && id <= genRange[1]);

                return keywordMatch && firstPhaseMatch && secondPhaseMatch && genMatched
            })

            this.total = res.length;

            return res.splice((page - 1) * size, size)
        },
    },
    data() {
        return {
            searchForm: {},
            size: 20,
            page: 1,
            total: 0,
            selection: [],
            types,
            genEndPoint: [151, 251, 386, 493, 649, 721, 809],
        }
    },

    methods: {
        onPageChange(v) {
            this.page = v;
        },
        onSizeChange(v) {
            this.page = 1;
            this.size = v;
        },
        onPokemonClick(pokemon) {
            let {
                mode,
                multiple,
            } = this;
            let index = this.selection.findIndex(el => el.id == pokemon.id)
            if (mode == 'select') {
                if (index < 0) {
                    if (multiple) {
                        this.selection.push(pokemon)
                    } else {
                        this.selection = [pokemon]
                    }
                } else {
                    this.selection.splice(index, 1)
                }
            }
        },
        onSubmit() {
            if (!this.selection.length) {
                this.$message.warning('请选择精灵')
            } else {
                this.$emit('pick', this.selection)
            }
        },
        getGenRange(gen) {
            let {
                genEndPoint
            } = this;

            if (!gen) {
                return [1, 809]
            }

            let start = (genEndPoint[gen - 2] || 0) + 1;
            let end = genEndPoint[gen - 1];
            return [start, end]
        },
        reset() {
            this.searchForm = {
                keyword: '',
                gen: '',
                firstPhase: '',
                secondPhase: '',
                size: 20,
                page: 1,
            }
        },
        clearSelection(){
            this.selection = []
        },
    },

    mounted() {},
}
</script>
<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.pokemons {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(auto-fill, 160px);
    padding: 10px;
    overflow-y: auto;
}

.pokemon {
    position: relative;
}

.action-bar {
    margin-top: 20px;
    text-align: right;
}

[mode="select"] {
    .pokemon {
        cursor: pointer;
    }
}

[checked="true"] {
    .check-layer {
        display: inline-flex;
    }
}

.el-pagination {
    margin-top: 10px;
}

.check-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(255, 255, 255, .7);
    z-index: 1;
    font-size: 3em;
    color: #337ecc;
    display: none;
}

.selection {
    ul {
        display: flex;
        flex-wrap: wrap;

        li {
            padding: 5px;
            margin: 5px;
            background-color: #efefef;
        }
    }
}

.btn-remove-selection {
    font-size: 16px;
    top: -5px;
    right: -5px;
}
</style>