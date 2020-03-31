import {

} from '../../../../../services/cerp/print-file/follow-course-print/FollowCoursePrint';
import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

/*按课程打印签到表(暂时不用)*/
export default {

    namespace: 'followCoursePrint',

    state: {
        dataSource : {},                //该课程数据
        rowNum : 30,                    //行数，默认30
        listData : [],                  //列表数据
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname == '/follow_course_print'){
                    let data = JSON.parse(query.data);
                    let {
                        stuArr,     //上课学员数组
                        mulStuArr,  //补课学员数组
                        tryStuArr   //视听学员数组
                    } = data;
                    let formatArr = [];
                    function formatStuArr(stuArr,type,formatArr){
                        if(stuArr && stuArr.length > 0){
                            stuArr.map((item,index) => {
                                formatArr.push({
                                    name : item.name,
                                    nickname : item.nickname,
                                    sex : item.sex,
                                    type
                                })
                            });
                            return formatArr;
                        }
                    }
                    formatArr = formatStuArr(stuArr,'上课',formatArr);
                    formatArr = formatStuArr(mulStuArr,'补课',formatArr);
                    formatArr = formatStuArr(tryStuArr,'试听',formatArr);
                    dispatch({
                        type:'updateState',
                        payload:{
                            rowNum : formatArr.length || 0,
                            dataSource : data || {},
                            listData : formatArr || []
                        }
                    })
                }
            });
        },
    },

    effects: {

    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload };
        },
    },
};
