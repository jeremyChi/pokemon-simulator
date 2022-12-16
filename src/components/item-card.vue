<template>
    <div>
        <div class="container">
            <section class="main">
                <p class="item-name">
                    <el-tooltip class="box-item" effect="dark" placement="top-start">
                        <template #content>
                            <div class="item-desc">{{item[3]}}</div>
                        </template>
                        <span class="title link" @click.stop="wiki(item[0])">{{item[0]}} </span>
                    </el-tooltip>
                    <small>&nbsp;{{item[4]}}</small>
                </p>
            </section>
            <wiki ref="wiki" :keyword="wikiKeyword"></wiki>
        </div>
    </div>
</template>
<script>
import wiki from '../components/wiki.vue'
export default {
    name: 'item-card',
    props: ['item'],
    components: {
        wiki,
    },
    computed: {},
    data() {
        return {
            wikiKeyword: '',
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
.main {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    padding: 10px;
    border: 1px solid #c2c2c2;

    .item-name {
        color: #000;

        .title {
            font-size: 16px;
            font-weight: bold;
        }

        small {
            font-size: 12px;
        }
    }

    .details {
        margin-top: 10px;
        display: grid;
        grid-template-columns: auto;
        grid-gap: 10px;
        font-size: 14px;
        width: 100%;

        .value {
            display: -webkit-box;
            overflow: hidden;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 1.2em;
            height: 2.4em;
        }
    }
}

.item-desc {
    max-width: 300px;
    line-height: 1.4;
    font-size: 14px;
}
</style>