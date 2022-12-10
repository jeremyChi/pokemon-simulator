<template>
    <div>
        <el-dialog :append-to-body="true" v-model="visible" :title="`搜索 “${keyword}”`" width="90%" top="60px">
            <iframe class="detail-iframe" :src="`https://wiki.52poke.com/wiki/${keyword}`" frameborder="0"></iframe>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="visible = false">关闭</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'wiki',
    props: ['keyword'],
    components: {

    },
    computed: {},
    data() {
        return {
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
.detail-iframe {
    width: 100%;
    height: calc(100vh - 300px);
}
</style>