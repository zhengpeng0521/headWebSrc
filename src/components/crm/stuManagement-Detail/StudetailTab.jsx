import React from 'react';
import { Button , Popover } from 'antd';
import styles from './StudetailTab.less';


/*详细信息*/
function Detail({
    studentDetailInfo,           //选中leads名单查看详情时当前人的信息
}){
    let NewstudentDetailInfo = {};
    let conaddress = '';
    let community = '';
    let schaddress = '';
    let month = '';
    if ( studentDetailInfo ) {
        NewstudentDetailInfo.name     = studentDetailInfo.name;         //姓名
        NewstudentDetailInfo.sex      = studentDetailInfo.sex;          //性别
        NewstudentDetailInfo.birthday = studentDetailInfo.birthday;     //生日
        NewstudentDetailInfo.grade    = studentDetailInfo.grade;        //年级
        NewstudentDetailInfo.remark   = studentDetailInfo.remark;       //备注
        NewstudentDetailInfo.month    = studentDetailInfo.month;        //月龄
        NewstudentDetailInfo.age      = studentDetailInfo.age;          //年龄
        NewstudentDetailInfo.parents  = studentDetailInfo.parents;      //家长
        NewstudentDetailInfo.mobile   = studentDetailInfo.mobile;       //手机号
		NewstudentDetailInfo.constellation = studentDetailInfo.constellation;      //星座
		NewstudentDetailInfo.nation = studentDetailInfo.nation;                    //民族
		NewstudentDetailInfo.speciality = studentDetailInfo.speciality;            //特长
		NewstudentDetailInfo.hobby = studentDetailInfo.hobby;                      //爱好
		NewstudentDetailInfo.bloodType = studentDetailInfo.bloodType;              //血型
		NewstudentDetailInfo.socialSecurityNum = studentDetailInfo.socialSecurityNum;  //社保号码
		NewstudentDetailInfo.intentionName = studentDetailInfo.intentionName;          //学员类型
		NewstudentDetailInfo.secondChannelName = studentDetailInfo.secondChannelName;  //二级来源

        if( studentDetailInfo.conaddress  == '' || studentDetailInfo.conaddress == undefined || studentDetailInfo.conaddress == null ){
            conaddress = '';
        }else{
            conaddress = studentDetailInfo.conaddress;
        }
        if( studentDetailInfo.community == '' || studentDetailInfo.community == undefined || studentDetailInfo.community == null ){
            community = '';
        }else{
            community = studentDetailInfo.community;
        }
        if( studentDetailInfo.schaddress == '' || studentDetailInfo.schaddress == undefined || studentDetailInfo.schaddress == null ){
            schaddress = '';
        }else{
            schaddress = studentDetailInfo.schaddress;
        }
        //NewstudentDetailInfo.conaddress  = conaddress + community +schaddress;
        NewstudentDetailInfo.conaddress  = conaddress;
        NewstudentDetailInfo.channelName = studentDetailInfo.channelName;
        NewstudentDetailInfo.orgName     = studentDetailInfo.orgName;

        if ( studentDetailInfo.month == '' || studentDetailInfo.month == undefined || studentDetailInfo.month == null ){
            month = '0';
        }else{
            if ( studentDetailInfo.month == 0 ){
                month = '0';
            }else{
                month = studentDetailInfo.month + '';
            }
        }
        NewstudentDetailInfo.month = month;
        var sex = "男";
        if (studentDetailInfo.sex == 1){
            sex = "男";
        }else if ( studentDetailInfo.sex == 2 ) {
            sex = "女";
        }else{
			sex = '--'
		}
        NewstudentDetailInfo.sex = sex;
    }

    //需要从员工详情中筛选并渲染的内容
    let expect = [
		{ label : '姓名', value : 'name' },
        { label : '性别', value : 'sex'},
        { label : '生日', value : 'birthday'},
        { label : '月龄', value : 'month'},
        { label : '年龄', value : 'age'},
		{ label : '年级', value : 'grade' },
        { label : '星座', value : 'constellation'},
        { label : '民族', value : 'nation'},
        { label : '特长', value : 'speciality'},
        { label : '爱好', value : 'hobby'},
        { label : '血型', value : 'bloodType'},
        { label : '社保号码', value : 'socialSecurityNum'},
        { label : '手机号', value : 'mobile'},
        { label : '学员类型', value : 'intentionName'},
        { label : '地址', value : 'conaddress'},
        { label : '一级来源', value : 'channelName'},
        { label : '二级来源', value : 'secondChannelName'},
		{ label : '备注', value : 'remark' }
	];

    //详情信息渲染
    function detailRender( expect, target ){
        let arr = [];
        for( let i in expect ){
            if(expect[i].value == 'mobile'){
                arr.push(
                    <p key = { i }>
                        <span>{ expect[i].label }：</span>
                        <Popover placement="top" content={ !!target[expect[i].value] || target[expect[i].value] === 0 ? target[expect[i].value] + '' : '--' } trigger="click">
                            <a>查看</a>
                        </Popover>
                    </p>
                )
            }else{
                arr.push(
                    <p key = { i }>
                        <span>{ expect[i].label }：</span>
                        <Popover placement="topLeft" content={ !!target[expect[i].value] || target[expect[i].value] === 0 ? target[expect[i].value] + '' : '--' } trigger="hover">
                            <span>{ !!target[expect[i].value] || target[expect[i].value] === 0 ? target[expect[i].value] + '' : '--' }</span>
                        </Popover>
                    </p>
                )
            }
        }
        return arr;
    }

    let detail = detailRender(expect, NewstudentDetailInfo);
    return(
        <div className={styles.leads_detail_inner}>
            <div className={styles.leads_detail_inner_img}>
                <img src={
                        !!studentDetailInfo && !!studentDetailInfo.headimgurl ?
                            studentDetailInfo.headimgurl :
                        !!studentDetailInfo && studentDetailInfo.sex == '2' ?
                        'https://img.ishanshan.com/gimg/img/ad8cc625441146bdf8e373dec1cd600f' :
                        !!studentDetailInfo && studentDetailInfo.sex == '1' ?
                        'https://img.ishanshan.com/gimg/img/d75fdb312bbaca043a97d24c5453a337' :
                        'https://img.ishanshan.com/gimg/img/6f1436b4c39b3afb25e5ac00509a5e64'
                    }
                    style = {{ width : 80 , height : 80 , borderRadius : '50%' }}/>
            </div>
            <div className={styles.leads_detail_inner_message}>
                { detail || [] }
            </div>
        </div>
    );
}

export default Detail;
