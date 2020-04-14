//顶部导航
Vue.component('myheader', {
    template: '<header class="curHeader border-b-eee"><a v-if="isback" href="javascript:;" class="goBack"></a><h1>{{name}}</h1></header>',
    props: [
        'name',
        'isback'
    ],
    methods: {
        // 组件中的方法
    }
})
// 默认弹框
Vue.component('defalutmodal', {
    template: '<div class="maskBox" v-show="modalshow"><div class="defalutModal"><div class=" mesDiv around-center">{{promptmes}}</div><div class="around-center"><p class="btns" @click="leftbtnfun">{{leftbtnmes}}</p> <p class="btns r_btn" @click="rightbtnfun">{{rightbtnmes}}</p></div></div> </div>',
    props: [
        'modalshow',
        'promptmes',
        'leftbtnmes',
        'rightbtnmes',
    ],
    methods: {
        // 组件中的方法
        leftbtnfun: function (e) {
            this.$emit("leftbtnfun");
        },
        rightbtnfun: function (e) {
            this.$emit("rightbtnfun");
        }
    }
})
// 打电话弹框
Vue.component('callmodal', {
    template: '<div class="maskBox" v-show="callmodalshow"><div class="defalutModal"><div class="mesDiv w-column-center"><div class="callImg coverImg m-t-30r m-b-20r"></div><p class="color-000">{{phonumber}}</p></div><div class="around-center"><p class="btns" @click="canclecall">取消</p> <p class="btns r_btn" @click="callphone">立即拨打</p></div></div> </div>',
    props: [
        'callmodalshow',
        'phonumber',
    ],
    methods: {
        // 组件中的方法
        canclecall: function (e) {
            this.$emit("canclecall");
        },
        callphone: function (e) {
            this.$emit("callphone");
        }
    }
})
// 提示弹窗弹框
Vue.component('tipsmodal', {
    template: ' <div class="maskBox" v-show="tipmodalshow"><div class="defalutModal"><div class="hgt_full flex_column p-t-20r"><div class="flex_1 overflow_auto center p_both20r"><p class="color-000 ">{{tipsmes}}</p></div><div class="around-center tipsbtn m-t-20r" @click="tipsbtnok"><p class="color-000">{{tipsbtn}}</p></div></div></div></div>',
    props: [
        'tipmodalshow',
        'tipsmes',
        'tipsbtn',
    ],
    methods: {
        // 组件中的方法
        tipsbtnok: function (e) {
            this.$emit("tipsbtnok");
        }
    }
})
//底部导航
Vue.component('myfooter', {
    template: '<div class="around-center footerNavArea"><a v-for="(item,idx) in footerData" v-bind:href="idx==index?\'javascript:;\':item.url" class="column-center-b footerNav"><img class="navPic" v-bind:src="idx==index?item.acsrc:item.src"/><span v-bind:class="idx==index?\'navAc\':\'\'">{{item.name}}</span></a></div>',
    props: [
        'index'
    ],
    data: function () {
        return {
            footerData: [
                { src: '../img/slice/icon_footer1.png', url: '', acsrc: '../img/slice/icon_footer1a.png', name: '首页' },
                { src: '../img/slice/icon_footer2.png', url: '', acsrc: '../img/slice/icon_footer2a.png', name: '排行榜' },
                { src: '../img/slice/icon_footer3.png', url: '', acsrc: '../img/slice/icon_footer3a.png', name: '分享推广' },
                { src: '../img/slice/icon_footer4.png', url: '', acsrc: '../img/slice/icon_footer4a.png', name: '个人中心' }
            ]
        }
    },
    methods: {
        // 组件中的方法
    }
})

//富文本
Vue.component('richtext', {
    template: '<div class="fwContent" v-html="content"></div>',
    props: [
        'content'
    ],
    methods: {
        // 组件中的方法
    }
})

//暂无数据
Vue.component('nodata', {
    template:'  <div v-if="nodata" class="noData text-center">'+
                    '<img class="wid15rem" src="../img/slice/icon-nodata.png"/>'+
                    '<p class="color-999 font20r m-t-15r">{{nodatamsg}}</p>'+
                '</div>',
    props: {
        nodatamsg:{
            type:String,
            default:"暂无数据",
        } ,
        nodata:{
            type:Boolean,
            default:false,
        }
        },
    methods: {
        // 组件中的方法
    }
})


//返回顶部
Vue.component('back_top', {
    template:'  <div class="go-top wid07rem hgt07rem hide btPosition">'+
                    '<img class="wid100" src="../img/slice/go-top.png" />'+
                '</div>',
    props: {
    
        },
    methods: {
        // 组件中的方法
    }
})

//顶部
Vue.component('common_head', {
    template:'  <div class="c-nav">'+
    '<div class="container navFlex">'+
    '   <div class="flexItem">'+
    '       <img  class="logo" src="../img/slice/logo2.png" />'+
    '   </div>'+
    '   <div class="center-end flex_1">'+
    '       <div class="flexItem hiden">'+
    '           <img class="btnImg" src="../img/slice/icon_person.png" />'+
    '       </div>'+
    '       <div class="flexItem hiden">'+
    '           <img @click="showNav" class="btnImg navBtn" src="../img/slice/icon_more.png" />'+
    '       </div>'+
    '  </div>'+
    '   <div class="flexItem show">'+
    '       <ul>'+
    '           <li v-for="(item,idx) in headData"><a v-bind:href="idx==activeindex?\'javascript:;\':item.url" v-bind:class="idx==activeindex?\'navAc\':\'\'" >{{item.name}} <div v-if="item.child" class="hoverLists"><a :href="child.url" v-for="child in item.child" class="hoverlist">{{child.name}}</a></div>    </a></li>'+
    '       </ul>'+
    '   </div>'+
    '</div>'+
    
    '</div>',
    props: [
        'activeindex'
    ],
    data: function () {
        return {
            headData: [
                { url: '',  name: '首页' },
                { url: '',  name: '企业介绍' },
                { url: '',  name: '产品展示',child:[
                    {url: '',  name: '汽车安全性能检测设备'},
                    {url: '',  name: '汽车综合性能检测设备'},
                    {url: '',  name: '汽车排放测试设备'},
                    {url: '',  name: '4S站及修理厂用设备'},
                    {url: '',  name: '摩托车检测设备'},
                    {url: '',  name: '汽车摩托车混检设备'},
                    {url: '',  name: '汽车制造厂用检测设备'},
                    {url: '',  name: '仪器仪表'},
                ]},
                { url: '',  name: '生产工艺' },
                { url: '',  name: '服务支持' ,child:[
                    {url: '',  name: '常见问题解答'},
                    {url: '',  name: '设备规格书'},
                    {url: '',  name: '标准法规'},
                    {url: '',  name: '工具软件'},
                    {url: '',  name: '其他'}
                ]},
                { url: '',  name: '人才招聘' },
                { url: '',  name: '新闻动态' },
                { url: '',  name: '联系我们' },
                { url: '',  name: '注册/登录',child:[
                    {url: '',  name: '高级用户'},
                    {url: 'javascript:;',  name: '退出登录'}
                ]},
                { url: 'javascript:;',  name: '中/ENG' },
            ]
        }
    },
    methods: {
        // 组件中的方法
        showNav:function(){
            var toggle = true;
            if (toggle) {
                $('.navBtn').css("border", "1px solid #b0ccf3");
                toggle = false
            } else {
                $('.navBtn').css("border", "1px solid transparent");
                toggle = true;
            }
            $(".show").slideToggle(300);
        }
    }
})
//底部
Vue.component('common_foot', {
    template:'  <div class="footer">'+
    '<div class="footArea footer around-center">'+
    '    <div class="l-pad30">'+
    '       <div class="text-center font14r">'+
    '           <a href="#" class="wid10rem  inline_div text-center">首页</a>'+
    '           <i>|</i>'+
    '           <a href="#" class="wid10rem inline_div text-center">企业介绍</a>'+
    '           <i>|</i>'+
    '           <a href="#" class="wid10rem inline_div text-center">产品展示</a>'+
    '           <i>|</i>'+
    '           <a href="#" class="wid10rem inline_div text-center">生产工艺</a>'+
    '           <i>|</i>'+
    '           <a href="#" class="wid10rem inline_div text-center">服务支持</a>'+
    '           <i>|</i>'+
    '           <a href="#" class="wid10rem inline_div atext-center">人才招聘</a>'+
    '           <i>|</i>'+
    '           <a href="#" class="wid10rem inline_div text-center">新闻动态</a>'+
    '           <i>|</i>'+
    '           <a href="#" class="wid10rem inline_div text-center">联系我们</a>'+
    '       </div>'+
    '       <div class="color-999 font12r text-center p-v-05r">版权所有：成都新成汽车检测设备有限公司 蜀ICP备10019569号 舜津科技提供网站建设【后台管理】</div>'+
    '       <div class="text-center">'+
    '           <img class="wid02rem vertical_mid" src="../img/slice/beian.png" alt="" srcset="">'+
    '           <i class="color-999 font12r">川公网安备 51011402000228号</i>'+
    '       </div>'+
    '   </div>'+
    '</div>'+
    '</div>',
    props: {
    
        },
    methods: {
        // 组件中的方法
    }
})