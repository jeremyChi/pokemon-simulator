<template>
    <div class="fullheight">
        <div class="container fullheight">
            <el-form label-width="6em" class="search-bar" :inline="true" :model="searchForm">
                <el-form-item label="关键字">
                    <el-input style="width: 8em;" clearable v-model="searchForm.keyword" placeholder="名字/编号" />
                </el-form-item>
                <el-form-item label="属性">
                    <el-select style="width: 8em;" clearable v-model="searchForm.phase" placeholder="请选择">
                        <el-option v-for="type in types" :key="type.chinese" :label="type.chinese" :value="type.chinese" />
                    </el-select>
                </el-form-item>
                <el-form-item label="种类">
                    <el-select style="width: 8em;" clearable v-model="searchForm.category" placeholder="请选择">
                        <el-option label="物理" value="物理" />
                        <el-option label="变化" value="变化" />
                        <el-option label="特殊" value="特殊" />
                        <el-option label="极巨" value="极巨" />
                        <el-option label="超级巨" value="超级巨" />
                    </el-select>
                </el-form-item>
                <el-form-item label="PP">
                    <el-select style="width: 8em;" clearable v-model="searchForm.pp" placeholder="请选择">
                        <el-option v-for="i in 8" :label="i*5" :value="i*5" />
                    </el-select>
                </el-form-item>
                <el-form-item label="命中">
                    <el-input-number style="width: 8em;" :min="0" :max="100" v-model="searchForm.accuracyStart" :step="5" />
                    <span style="margin: 0 10px;">至</span>
                    <el-input-number style="width: 8em;" :min="0" :max="100" v-model="searchForm.accuracyEnd" :step="5" />
                </el-form-item>
                <el-form-item label="威力">
                    <el-input-number style="width: 8em;" :min="0" v-model="searchForm.powerStart" />
                    <span style="margin: 0 10px;">至</span>
                    <el-input-number style="width: 8em;" :min="0" v-model="searchForm.powerEnd" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="reset()">重置</el-button>
                </el-form-item>
            </el-form>
            <div class="selection" v-show="mode == 'select'" style="line-height: 1.4;padding: 10px;">
                已经选择了:
                <ul>
                    <li v-for="(el,i) in selection">{{el[1]}}
                        <el-icon @click="selection.splice(i,1)" class="btn-remove btn-remove-selection">
                            <CloseBold />
                        </el-icon>
                    </li>
                </ul>
            </div>
            <ul class="moves" :mode="mode">
                <li class="move" :checked="selection.map(el=>el.id).includes(move[0])" v-for="(move,i) in moves" :key="i" @click="onMoveClick(move)">
                    <el-icon class="check-layer">
                        <CircleCheck />
                    </el-icon>
                    <move-card :move="move"></move-card>
                </li>
            </ul>
            <el-pagination background :page-size="size" :current-page="page" layout="total, sizes, prev, pager, next" :total="total" @current-change="onPageChange" @size-change="onSizeChange" />
            <div class="action-bar" v-if="mode == 'select'">
                <el-button type="danger" @click="clearSelection()">清空选择</el-button>
                <el-button type="primary" @click="onSubmit()">确认选择</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import { moves } from '../dataset/moves.js'
import types from '../dataset/types.json'
import moveCard from './move-card.vue'
import {
    debounce
}
from 'lodash'
import {
    match
}
from 'pinyin-pro';
export default {
    name: 'move-list',
    props: {
        mode: {
            default: 'view',
        },
        multiple: {
            default: false,
        },
    },
    components: {
        moveCard,
    },
    watch: {
        'searchForm': {
            handler() {
                this.getMoves()
            },
            deep: true,
        },
        'page': function() {
            this.getMoves()
        },
        'size': function() {
            this.getMoves()
        },
    },
    computed: {},
    data() {
        return {
            searchForm: {},
            size: 50,
            page: 1,
            total: 0,
            selection: [],
            types,
            moves: [],
        }
    },

    methods: {
        getMoves: debounce(function() {
            let {
                keyword,
                phase,
                category,
                pp,
                accuracyStart,
                accuracyEnd,
                powerStart,
                powerEnd,

            } = this.searchForm;
            let {
                page,
                size
            } = this;
            let res = moves.filter(move => {

                let nameMatch = match(move[1], keyword || '');
                let idMatch = move[0] == keyword
                let phaseMatch = !phase || (move[4] == phase);
                let keywordMatch = !keyword || nameMatch || idMatch;
                let categoryMatch = !category || category == move[5];
                let ppMatch = !pp || +pp == move[8]
                let accuracyMatch = (!accuracyStart && !accuracyEnd) || (move[7] && (move[7] >= accuracyStart && move[7] <= accuracyEnd))
                let powerMatch = (!powerStart && !powerEnd) || (move[6] && (move[6] >= powerStart && move[6] <= powerEnd))
                return keywordMatch && phaseMatch && categoryMatch && ppMatch && accuracyMatch && powerMatch
            })

            this.total = res.length;

            this.moves = res.splice((page - 1) * size, size)
        }, 200),
        onPageChange(v) {
            this.page = v;
        },
        onSizeChange(v) {
            this.page = 1;
            this.size = v;
        },
        onMoveClick(move) {
            let {
                mode,
                multiple,
            } = this;
            let index = this.selection.findIndex(el => el.id == move[0])
            if (mode == 'select') {
                if (index < 0) {
                    if (multiple) {
                        this.selection.push(move)
                    } else {
                        this.selection = [move]
                    }
                } else {
                    this.selection.splice(index, 1)
                }
            }
        },
        onSubmit() {
            if (!this.selection.length) {
                this.$message.warning('请选择技能')
            } else {
                this.$emit('pick', this.selection)
            }
        },
        reset() {
            this.searchForm = {
                keyword: '',
                phase: '',
                category: '',
                pp: '',
                size: 20,
                page: 1,
            }
        },
        clearSelection() {
            this.selection = []
        },
    },

    mounted() {
        this.getMoves()
    },
}
</script>
<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 15px;
    background-color: #fff;
}

.moves {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(auto-fill, 180px);
    padding: 10px;
    overflow-y: auto;
}

.move {
    position: relative;
}

.action-bar {
    margin-top: 20px;
    text-align: right;
}

[mode="select"] {
    .move {
        cursor: pointer;
    }
}

[checked="true"] {
    .check-layer {
        display: inline-flex;
    }
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

.el-pagination {
    margin-top: 10px;
}

.selection {
    ul {
        display: flex;
        flex-wrap: wrap;

        li {
            padding: 5px;
            margin: 5px;
            background-color: #409eff;
            color: #fff;
        }
    }
}

.btn-remove-selection {
    font-size: 16px;
    top: -5px;
    right: -5px;
}
</style>