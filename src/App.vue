<template>
    <div id="app">
        <el-menu :default-active="activeIndex" class="menu" mode="horizontal" @select="handleSelect">
            <el-menu-item index="/team">队伍</el-menu-item>
            <el-menu-item index="/pokemon-list">宝可梦</el-menu-item>
            <el-menu-item index="/move-list">技能</el-menu-item>
            <el-input style="width:12em; margin-left: auto;align-self: center; margin-right: 20px;" clearable v-model="wikiKeyword" placeholder="键入并按回车搜索百科" @keyup="onKeyUp" />
        </el-menu>
        <RouterView ref="view" class="router-view" />
        <wiki ref="wiki" :keyword="wikiKeyword"></wiki>
    </div>
</template>

<script>
import wiki from './components/wiki.vue'
export default {
    name: 'app',
    components: {
        wiki,
    },
    data: function() {
        return {
            activeIndex: '',
            wikiKeyword: '',
        }
    },
    methods: {
        handleSelect(index) {
            this.$router.push(index)
        },
        onKeyUp(e) {
            if (e.which == 13) {
                this.$refs['wiki'].show()
            }
        },
    },
    mounted() {
        setTimeout(() => {
            let {
                path
            } = this.$route;
            this.activeIndex = path
        }, 500);
    },
}
</script>

<style scoped lang="scss">
#app {
    height: 100vh;
    display: flex;
    flex-direction: column;

    .menu {
        flex-shrink: 0;
    }

    .router-view {
        flex-grow: 1;
        overflow-y: auto;
    }
}
</style>