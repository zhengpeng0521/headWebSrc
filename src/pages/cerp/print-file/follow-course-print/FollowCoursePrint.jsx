import React from 'react';
import { message , Button } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { do_print } from '../../../../utils/printUtils';
import FollowCoursePrintComponent from '../../../../components/cerp/print-file/follow-course-print/FollowCoursePrint';

/*cerp按课程打印签到表*/
function FollowCoursePrint({ dispatch , followCoursePrint }) {

    let {
        dataSource,                 //该课程数据
        rowNum,                     //行数，默认30
        listData,                   //列表数据
    } = followCoursePrint

    function Print(){
        let inputNum = document.getElementById('cerp_follow_course_print_change_rows');
        let inputNumP = inputNum.parentNode;
        inputNumP.removeChild(inputNum);
        do_print('cerp_follow_course_print');
        inputNumP.appendChild(inputNum);
    }

    //改变行数
    function RowNumOnChange(num){
        let no = 0;
        if(num > 100 ){
            no = 100;
        }else{
            no = num;
        }
        dispatch({
            type:'followCoursePrint/updateState',
            payload:{
                rowNum : no || 0,
            }
        })
    }

    let FollowCoursePrintComponentProps = {
        dataSource,                 //该课程数据
        rowNum,                     //行数，默认30
        listData,                   //列表数据

        RowNumOnChange,             //改变行数
    }

    return (
        <div style = {{ overflow : 'hidden' }}>
            <Button type='primary' onClick = { Print } style = {{ position : 'absolute' , right : 11 , top : 13 }}>打印签到表</Button>
            <FollowCoursePrintComponent {...FollowCoursePrintComponentProps}/>
        </div>
    );
}

function mapStateToProps({ followCoursePrint }) {
    return { followCoursePrint };
}

export default connect(mapStateToProps)(FollowCoursePrint);
