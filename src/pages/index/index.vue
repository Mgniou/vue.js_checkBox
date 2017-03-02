<template>
    <div class="controls">
        <div class="header">
            <input class="j-role-parent" type="checkbox" v-model="jsonData.checked" @click='checkedAll($event)'>
            <h4 style="display: inline-block">权限管理</h4>
        </div>
        <ul class="conBox" v-for='group in permList'>
            <div class="j-role-item">
                <li class="titleLi">
                    <input class="j-role-parent" type="checkbox" v-model="group.checked" :value='group.fungid' @click='checkedGroupAll($event)'>
                    <h5 style="display: inline-block;">{{group.groupname}}</h5>
                </li>
                <div class="row-fluid">
                    <ul class="dl-horizontal" v-for='value in group.functionList'>
                        <input class="j-role-child" type="checkbox" v-model="value.checked" :value='value.funid' @click="watchCheck($event)">
                        <span style="display: inline-block;">{{value.funname}}</span>
                    </ul>
                </div>
            </div>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    import json from "./data.json";
    export default {
        data: function () {
            return {
                permList: [],
                jsonData: {}
            };
        },

        //方法
        methods: {
            //全选
            checkedAll: function (e) {
                let $this = $(e.target);
                let ischk = $this.prop('checked');
                let permList = this.permList;
                // 第一次循环, 找到当前勾选的功能组, 第二次循环, 赋值对应功能列表的checked
                for (let i = 0; i < permList.length; i++) {
                    if (ischk) {    // 为true, 就是全选勾选, 添加该功能组的勾选
                        permList[i].checked = true;
                        let funList = permList[i].functionList;
                        for (let j = 0; j < funList.length; j++) {
                            funList[j].checked = true;
                        }
                    } else {    // 全选未勾选, 去除该功能组的勾选
                        permList[i].checked = false;
                        let funList = permList[i].functionList;
                        for (let j = 0; j < funList.length; j++) {
                            funList[j].checked = false;
                        }
                    }
                }
            },
            // 组全选, 用jQuery做
            checkedGroupAll: function (e) {
                let $this = $(e.target);
                let groupVal = $this.val();
                let ischk = $this.prop('checked');
                let permList = this.permList;
                let groupArr = [];
                // 第一次循环, 找到当前勾选的功能组, 第二次循环, 赋值对应功能列表的checked
                for (let i = 0; i < permList.length; i++) {
                    groupArr.push(permList[i].checked);
                    if (permList[i].fungid === parseInt(groupVal)) {
                        if (ischk) {    // 为true, 就是全选勾选, 添加该功能组的勾选
                            permList[i].checked = true;
                            let funList = permList[i].functionList;
                            for (let j = 0; j < funList.length; j++) {
                                funList[j].checked = true;
                            }
                        } else {    // 全选未勾选, 去除该功能组的勾选
                            permList[i].checked = false;
                            let funList = permList[i].functionList;
                            for (let j = 0; j < funList.length; j++) {
                                funList[j].checked = false;
                            }
                        }
                    }
                }
                //控制总得全选反选
                let cheLen = groupArr.length,
                    checkedLen = cheLen;
                for (let k = 0; k < cheLen; k++) {
                    if (groupArr[k] === false) {
                        checkedLen = checkedLen - 1;
                    }
                }
                if (checkedLen === cheLen) {
                    this.jsonData.checked = true;
                } else {
                    this.jsonData.checked = false;
                }
            },
            // 存在反选, 用jQuery做
            watchCheck: function(e) {
                let $this = $(e.target);
                let ischk = $this.prop('checked');
                let funVal = $this.val();
                let permList = this.permList;
                let checkedArr = [];
                // 2次循环, 找到functionList里面跟当前选择funid对应值得对象, 判断是否要勾选功能组的checked
                for (let i = 0; i < permList.length; i++) {
                    let funList = permList[i].functionList;
                    let funLength = funList.length;
                    let chooseLength = 0;
                    for (let j = 0; j < funList.length; j++) {
                        if (funList[j].funid === parseInt(funVal)) {
                            if (ischk) {
                                funList[j].checked = true;
                                chooseLength = chooseLength + 1;
                            } else {
                                funList[j].checked = false;
                            }
                        } else if (funList[j].checked == true) {
                            chooseLength = chooseLength + 1;
                        }

                        //将所有选框的选中状态push进数组checkedArr
                        checkedArr.push(funList[j].checked);
                    }
                    if (funLength != 0 && funLength == chooseLength) {
                        permList[i].checked = true;
                    } else {
                        permList[i].checked = false;
                    }
                }
                //控制总得全选反选
                let cheLen = checkedArr.length,
                    checkedLen = cheLen;
                for (let k = 0; k < cheLen; k++) {
                    if (checkedArr[k] === false) {
                        checkedLen = checkedLen - 1;
                    }
                }
                if (checkedLen === cheLen) {
                    this.jsonData.checked = true;
                } else {
                    this.jsonData.checked = false;
                }
            },
        },
        created: function () {
            this.jsonData = json;
            this.permList = json.obj;
        },
        mounted: function () {

        }
    }
</script>

