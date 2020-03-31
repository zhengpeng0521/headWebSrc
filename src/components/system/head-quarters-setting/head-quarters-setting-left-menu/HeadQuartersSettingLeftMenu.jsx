import React from 'react';
import styles from './HeadQuartersSettingLeftMenu.less';

function HeadQuartersSettingLeftMenu({
    dp,                             //dispatch方法
    leftMenu,                       //左边菜单项
}){

    //左侧menu点击事件
    function MenuOnChoose(chooseMenuItem){
        dp('headQuartersSetting/updateState',{ chooseMenuItem })
        //先将所有choose置为false
        leftMenu.map((item,index) => { item.choose = false });
        //将选中项choose置为true(i和len两个变量是在for循环的第一个声明中，二者只会初始化一次)
        for(let i = 0 , len = leftMenu.length ; i < len ; i++){
            if(leftMenu[i].id == chooseMenuItem.id){ leftMenu[i].choose = true ; dp('headQuartersSetting/updateState',{ leftMenu }) ; break ; }
        }
        console.log(chooseMenuItem, 'chooseMenuItem')
        switch(chooseMenuItem.id){
            case 'role' : dp('headQuartersSetting/SearchAllRoleList') ; break ;
            case 'head_detail' : dp('headQuartersSetting/HeadDetailQuery') ; break ;
            case 'brand' : dp('headQuartersSetting/BrandGetStatus') ; break ;
            case 'security_setting' : dp('securitySettingsModel/getCheckPhoneNum') ; break ;
            case 'domain' : dp('headQuartersSetting/DomainGetApplyStatus') ; break ;
            case 'structure' : dp('headQuartersSetting/GetTreeStuOrCou' , { treeType : chooseMenuItem.id , treeLimit : 5 }) ; break ;
            case 'courseware' : dp('headQuartersSetting/GetTreeStuOrCou' , { treeType : chooseMenuItem.id , treeLimit : 2 }) ; break ;
			case 'accounts' : dp('accountCardModel/queryList',{pageSize : 20}) ; break ;
            case 'leadRecycle' : dp('leadRecordNoRule/timeOutDetail') ; break ;
            case 'leadDup' : dp('headQuartersSetting/getLeadsDup') ; break ;
            case 'secondSource' : dp('headQuartersSetting/getDeptList', { key: 'second' }); break;
            case 'firstSource' : dp('headQuartersSetting/getDeptList', { key: 'first' }); break;
            // case 'finance' : dp('headQuartersSetting/getFinance', {isInit:true}); break;
            case 'filelog' : console.log('id===');dp('filelogModel/GetTableList' , {pageSize : 20}); break;  // 操作日志
            case 'finance' : dp('headQuartersSetting/getFinance', {isInit:true}); dp('headQuartersSetting/getFinanceSet'); break;
        }
    }
    return(
        <div className = { styles.all }>
            { leftMenu && leftMenu.map((item,index) => <div key = { item.id } className = { styles.menu_item } style = { !!item.choose ? { backgroundColor : '#E0F0FF' } : null } onClick = {() => MenuOnChoose(item)}>{ item.name }</div>) }
        </div>
    )
}

export default HeadQuartersSettingLeftMenu;
