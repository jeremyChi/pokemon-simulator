<template>
    <div>
        <div class="container">
            <section class="basic">
                <p class="move-name">
                    <el-tooltip class="box-item" effect="dark" placement="top-start">
                        <template #content>
                            <div class="move-desc">{{move[11]}}</div>
                        </template>
                        <span class="title link" @click.stop="wiki(move[1])">{{move[1]}} </span>
                    </el-tooltip>
                    <el-popover :show-after="400" :hide-after="40" placement="top-start" trigger="hover" width="300">
                        <template #reference>
                            <small @click.stop="wiki(move[4])" class="type-tag link" :style="`background-color: ${types.find(el=>el.chinese == move[4])?.theme};`">
                                {{move[4]}}
                            </small>
                        </template>
                        <phase-card :phase="types.find(el=>el.chinese == move[4])"></phase-card>
                    </el-popover>
                </p>
                <ul class="details">
                    <li class="detail-item">
                        <span class="label">种类: </span>
                        <span class="value" :category="move[5]">{{move[5]}}</span>
                    </li>
                    <li class="detail-item">
                        <span class="label">威力: </span>
                        <span class="value">{{move[6] || '-'}}</span>
                    </li>
                    <li class="detail-item">
                        <span class="label">PP: </span>
                        <span class="value">{{move[8]}}</span>
                    </li>
                    <li class="detail-item">
                        <span class="label">命中: </span>
                        <span class="value">{{move[7] || '-'}}</span>
                    </li>
                </ul>
            </section>
            <wiki ref="wiki" :keyword="wikiKeyword"></wiki>
        </div>
    </div>
</template>
<script>
import wiki from '../components/wiki.vue'
import types from '../dataset/types.json'
import phaseCard from './phase-card.vue'
export default {
    name: 'move-card',
    props: ['move'],
    components: {
        wiki,
        phaseCard,
    },
    computed: {},
    data() {
        return {
            wikiKeyword: '',
            types,
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
.basic {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    padding: 10px;
    border: 1px solid #c2c2c2;

    .move-name {
        color: #000;

        .title {
            font-size: 16px;
            font-weight: bold;
        }

        small {
            font-size: 12px;
        }
    }

    .type-tag {
        padding: 2px 5px;
        color: #fff;
        font-size: 14px;
        margin-left: 5px;
    }

    .details {
        margin-top: 15px;
        display: grid;
        grid-template-columns: auto auto;
        grid-gap: 10px 5px;
        font-size: 14px;
        width: 100%;

        .detail-item:nth-of-type(even) {
            text-align: right;
        }

        .value {
            font-weight: bold;
        }
    }

    [category] {
        font-size: 12px;
        padding: 2px 5px;
        font-weight: normal !important;
    }

    [category="物理"] {
        color: #FFCC00;
        background-color: #CC2200;
    }

    [category="变化"] {
        color: #EEEEEE;
        background-color: #999999;
    }

    [category="特殊"] {
        color: #BBEEFF;
        background-color: #2266CC;
    }
}

.move-desc {
    max-width: 300px;
    line-height: 1.4;
    font-size: 14px;
}
</style>