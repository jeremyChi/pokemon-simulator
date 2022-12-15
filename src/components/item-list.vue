<template>
    <div class="fullheight">
        <div class="container fullheight">
            <el-form label-width="6em" class="search-bar" :inline="true" :model="searchForm">
                <el-form-item label="关键字">
                    <el-input style="width: 8em;" clearable v-model="searchForm.keyword" placeholder="名字/编号" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="reset()">重置</el-button>
                </el-form-item>
            </el-form>
            <div class="selection" v-show="mode == 'select'" style="line-height: 1.4;padding: 10px;">
                已经选择了:
                <ul>
                    <li v-for="(el,i) in selection">{{el[0]}}
                        <el-icon @click="selection.splice(i,1)" class="btn-remove btn-remove-selection">
                            <CloseBold />
                        </el-icon>
                    </li>
                </ul>
            </div>
            <ul class="items" :mode="mode">
                <li class="item" :checked="selection.map(el=>el[0]).includes(item[0])" v-for="(item,i) in items" :key="i" @click="onItemClick(item)">
                    <el-icon class="check-layer">
                        <CircleCheck />
                    </el-icon>
                    <item-card :item="item"></item-card>
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
import {
    items
}
from '../dataset/items.js'
import {
    debounce
}
from 'lodash'
import itemCard from './item-card.vue'
import {
    match
}
from 'pinyin-pro';
export default {
    name: 'item-list',
    props: {
        mode: {
            default: 'view',
        },
        multiple: {
            default: false,
        },
    },
    components: {
        itemCard,
    },
    watch: {
        'searchForm': {
            handler() {
                this.getItems()
            },
            deep: true,
        },
        'page': function() {
            this.getItems()
        },
        'size': function() {
            this.getItems()
        },
    },
    computed: {},
    data() {
        return {
            searchForm: {
                keyword: '',
            },
            size: 50,
            page: 1,
            total: 0,
            selection: [],
            items: [],
        }
    },

    methods: {
        getItems: debounce(function() {
            let {
                keyword,

            } = this.searchForm;
            let {
                page,
                size
            } = this;
            let res = items.filter(item => {
                let nameMatch = match(item[0], keyword || '');
                let keywordMatch = !keyword || nameMatch;
                return keywordMatch;
            })

            this.total = res.length;
            this.items = res.splice((page - 1) * size, size)
        }, 200),
        onPageChange(v) {
            this.page = v;
        },
        onSizeChange(v) {
            this.page = 1;
            this.size = v;
        },
        onItemClick(item) {
            let {
                mode,
                multiple,
            } = this;
            let index = this.selection.findIndex(el => el.id == item[0])
            if (mode == 'select') {
                if (index < 0) {
                    if (multiple) {
                        this.selection.push(item)
                    }
                    else {
                        this.selection = [item]
                    }
                }
                else {
                    this.selection.splice(index, 1)
                }
            }
        },
        onSubmit() {
            if (!this.selection.length) {
                this.$message.warning('请选择技能')
            }
            else {
                this.$emit('pick', this.selection)
            }
        },
        reset() {
            this.searchForm = {
                keyword: '',
            }
        },
        clearSelection() {
            this.selection = []
        },
    },

    mounted() {
        this.getItems()
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

.items {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(auto-fill, 180px);
    padding: 10px;
    overflow-y: auto;
}

.item {
    position: relative;
}

.action-bar {
    margin-top: 20px;
    text-align: right;
}

[mode="select"] {
    .item {
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