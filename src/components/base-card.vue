<template>
    <div style="height: 100%;">
        <div class="container species-strength">
            <ul>
                <li v-for="(v,k) in base" :key="k">
                    <span class="value">{{v}}</span>
                    <div class="bar"><span class="inner" :style="`height: ${v/255*100}%;background-color: ${theme[k]};`"></span></div>
                    <span class="name">{{k}}</span>
                </li>
                <li>
                    <span class="value total">{{Object.values(base).reduce((m,n)=>m+n)}}</span>
                    <small class="name">总和</small>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    name: 'base-card',
    props: ['base'],
    components: {},
    computed: {},
    data() {
        return {
            theme: {
                "HP": '#8AC654',
                "Atk": '#F8CB3C',
                "Def": '#D98837',
                "SpA": '#59C3D0',
                "SpD": '#5890CD',
                "Spe": '#A456D0'
            },
        }
    },

    methods: {

    },

    mounted() {},
}
</script>
<style scoped lang="scss">
.species-strength {
    height: 100%;

    ul {
        display: flex;
        justify-content: space-around;
        height: 100%;
        min-height: 140px;
        padding: 15px 0;

        li {

            width: 3em;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .value {
                margin-bottom: 5px;
            }

            .bar {
                flex-grow: 1;
                width: 10px;
                background-color: #ddd;
                margin-bottom: 5px;
                position: relative;

                .inner {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    left: 0;
                    background-color: blue;
                }
            }
        }
    }
}

.total {
    font-weight: bold;
    font-size: 1.2em;
}
</style>