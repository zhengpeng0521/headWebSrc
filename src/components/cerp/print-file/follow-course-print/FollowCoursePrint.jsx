import React from 'react';
import { message , InputNumber , Popover } from 'antd';
import QueueAnim from 'rc-queue-anim';
import thead from './thead.json';
import styles from './FollowCoursePrint.less';

/*cerp按课程打印签到表*/
function FollowCoursePrint({
    dataSource,                 //该课程数据
    rowNum,                     //行数，默认30
    listData,                   //列表数据

    RowNumOnChange,             //改变行数
}) {

    let {
        courseName,             //课程名称
        clsName,                //班级名称
        cpdId,                  //排课编号
        mtNames,                //主教
        atNames,                //助教
        roomName,               //教室名称
        orgName,                //所属机构
        studyDate,              //上课日期
        startTime,              //上课时间
        endTime,                //下课时间
        mulNum,                 //补课人数
        num,                    //上课人数
        tryNum,                 //试听人数
    } = dataSource;

    //头部课程信息格式化DIV
    function FormatDiv({
        children
    }){
        return(
            <div style = {{ width : 'calc(100%/3)' , height : 20 , lineHeight : '20px' , padding : '0 10px' , display : 'inline-block' , textAlign : 'center' , overflow : 'hidden' , whiteSpace : 'nowrap' , textOverflow : 'ellipsis' }}>
                { children }
            </div>
        )
    }

    let th = [];
    for(let i in thead){
        th.push(
            <div key = { 'thead_' + i }
                style = {{
                    width : thead[i].width ,
                    height : 25 ,
                    lineHeight : '25px' ,
                    textAlign : 'center' ,
                    borderLeft : i == 0 ? '1px solid #ddd' : 0 ,
                    borderRight : '1px solid #ddd' ,
                    backgroundColor : '#f5f5f5',
                    overflow : 'hidden',
                    textOverflow : 'ellipsis',
                    whiteSpace : 'nowrap',
                    padding : '0 5px'
                }}>
                { thead[i].name }
            </div>
        )
    }

    let tr = [];
    for(let i = 0 ; i < rowNum ; i++){
        let tr_item = [];
        for(let j in thead){
            tr_item.push(
                <div key = { 'trow_item_' + j }
                    style = {{
                        width : thead[j].width ,
                        height : 25 ,
                        lineHeight : '25px' ,
                        textAlign : 'center' ,
                        borderLeft : j == 0 ? '1px solid #ddd' : 0 ,
                        borderRight : '1px solid #ddd' ,
                        borderBottom : '1px solid #ddd' ,
                        backgroundColor : i%2 == 0 ? '#fff' : '#f5f5f5',
                        overflow : 'hidden',
                        textOverflow : 'ellipsis',
                        whiteSpace : 'nowrap',
                        padding : '0 5px'
                    }}>
                    { thead[j].name == '序号' ? i + 1 : '' }
                </div>
            )
        }
        for(let k in listData[i]){
            for(let l in thead){
                if(k == thead[l].id){
                    tr_item.splice(l,1,
                        <div key = { 'trow_item_' + l }
                            style = {{
                                width : thead[l].width ,
                                height : 25 ,
                                lineHeight : '25px' ,
                                textAlign : 'center' ,
                                borderLeft : l == 0 ? '1px solid #ddd' : 0 ,
                                borderRight : '1px solid #ddd' ,
                                borderBottom : '1px solid #ddd' ,
                                backgroundColor : i%2 == 0 ? '#fff' : '#f5f5f5',
                                overflow : 'hidden',
                                textOverflow : 'ellipsis',
                                whiteSpace : 'nowrap',
                                padding : '0 5px'
                            }}>
                            { thead[l].id == 'num' ? i + 1 : listData[i][k] }
                        </div>
                    )
                    break;
                }
            }
        }
        tr.push(
            <div key = { 'trow_' + i } style = {{ width : '100%' , display : 'flex' }}>
                { tr_item || [] }
            </div>
        )
    }

    return (
        <div className={styles.all}>
            <div className={styles.print_area} id = 'cerp_follow_course_print'>
                <div style = {{ width : '100%' , height : '100%' }}>
                    <div style = {{ height : 80 , backgroundColor : '#f5f5f5' , width : '100%' , marginBottom : 10 , padding : '10px 0'}}>
                        <div style = {{ height : 'calc(100%/3)' , width : '100%' , display : 'flex' }}>
                            <FormatDiv>课程名称:{ courseName || '--' }</FormatDiv>
                            <FormatDiv>班级:{ clsName || '--' }</FormatDiv>
                            <FormatDiv>编号:{ cpdId + '' || '--' }</FormatDiv>
                        </div>
                        <div style = {{ height : 'calc(100%/3)' , width : '100%' , display : 'flex' }}>
                            <FormatDiv>
                                <Popover placement="top" content={ `主教:${ mtNames || '--' } / 助教:${ atNames || '--' }` } trigger="hover">
                                    老师:{ ( mtNames || '--' ) + '/' + ( atNames || '--' ) }
                                </Popover>
                            </FormatDiv>
                            <FormatDiv>教室:{ roomName || '--' }</FormatDiv>
                            <FormatDiv>所属中心:{ orgName || '--' }</FormatDiv>
                        </div>
                        <div style = {{ height : 'calc(100%/3)' , width : '100%' , display : 'flex' }}>
                            <FormatDiv>日期:{ studyDate || '--' }</FormatDiv>
                            <FormatDiv>时间:{ ( startTime || '--' ) + '~' + ( endTime || '--' ) }</FormatDiv>
                            <FormatDiv>
                                <Popover placement="top" content={ `上课人数:${ num || 0 } / 补课人数:${ mulNum || 0 } / 试听人数:${ tryNum || 0 }` } trigger="hover">
                                    人数:{ ( num || 0 ) + '/' + ( mulNum || 0 ) + '/' + ( tryNum || 0 ) }
                                </Popover>
                            </FormatDiv>
                        </div>
                    </div>
                    <div style = {{ position : 'relative' , marginBottom : 10 , height : 30 }}>
                        <div style = {{ margin : '0 auto' , height : '100%' , lineHeight : '30px' , textAlign : 'center' , fontSize : '18px' , fontWeight : 700 }}>会员签到</div>
                        <div id = 'cerp_follow_course_print_change_rows' className={styles.cerp_follow_course_print_change_rows}>
                            行数：<InputNumber placeholder = '自定义行数' value = { rowNum } onChange = { RowNumOnChange } min = { 0 } step = { 1 } max = { 100 } size = 'small'/>
                        </div>
                    </div>
                    <div style = {{ display : 'flex' , borderTop : '1px solid #ddd' , borderBottom : '1px solid #ddd' }}>
                        { th || [] }
                    </div>
                    <div>
                        { tr || [] }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FollowCoursePrint;
