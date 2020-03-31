import React from 'react';
import { message , InputNumber , Popover , Select } from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './SchedulePrintByDay.less';
const Option = Select.Option;

/*cerp按天打印签到表*/
function SchedulePrintByDay({
    //课程信息
    courseInfo,                 //课程信息初始数据
    selectTeaContent,           //下拉列表选中内容(老师)
    selectClsContent,           //下拉列表选中内容(教室)
    data,                       //格式化老师维度排课信息/格式化教室维度信息

    //员工信息
    staffInfo,                  //员工下拉列表内容

    //教室信息
    clsRoomInfo,                //教室下拉列表内容

    //课程表时间
    startClock,                 //开始时间('有冒号')
    endClock,                   //结束时间('有冒号')
    clockArray,                 //时间段数组('有冒号')

    startTime,                  //开始时间字符串('无冒号')
    endTime,                    //结束时间字符串('无冒号')
    timeArray,                  //时间段数组('无冒号')

    //选择区
    dimension,                  //维度(1老师/2教室)

    DimensionOnChange,          //维度选择onChange事件
    SelectTeaOnChange,          //老师选择onChange事件
    SelectClsOnChange,          //教室选择onChange事件
}) {

    let renderTimeArray = [];
    renderTimeArray = clockArray.map((item,index) => {
        let item_render = '';
        if(item.substr(item.length - 2) == '00'){
            item_render = item + ' ~ ' + item.substr(0,2) + ':30'
        }else{
            if((parseFloat(item.substr(0,2)) + 1) < 10){
                item_render = item + ' ~ 0' + (parseFloat(item.substr(0,2)) + 1) + ':00'
            }else{
                item_render = item + ' ~ ' + (parseFloat(item.substr(0,2)) + 1) + ':00'
            }
        }
        return(
            <div style = {{ height : `calc((100% - 40px)/${clockArray.length})` , width : '100%' , border : '1px solid #ddd' , borderTop : '0' , display : 'flex' , justifyContent : 'center' , alignItems : 'center' , boxSizeing : 'border-box' , background : index%2 == 0 ? '#f5f5f5' : '#fff' }} key = { 'clock_' + index } className='schedule_print_by_day_time_item'>{ item_render }</div>
        )
    })

    /*格式化课程区块的top与height
     *start  课程开始时间(xx:xx)
     *end  课程结束时间(xx:xx)
     *timeArray  时间区块([7:00,7:30,8:00...])
     */
    function jusTopAndHeight(start,end,timeArray){
        //课程开始时间与结束时间(附加进制转换60=>100,非整点需转换)
        let courseStart = start.replace(':','').replace('：','') + '';
        let courseEnd = end.replace(':','').replace('：','') + '';
        if(courseStart.substr(2) != '00'){
            courseStart = parseFloat(courseStart.substr(0,2))*100 + parseFloat(courseStart.substr(2))/60*100;
        }
        if(courseEnd.substr(2) != '00'){
            courseEnd = parseFloat(courseEnd.substr(0,2))*100 + parseFloat(courseEnd.substr(2))/60*100;
        }
        //课程表开始时间与结束时间(附加进制转换60=>100,非整点需转换)
        let schStart = timeArray[0];
        let schEnd = timeArray[timeArray.length - 1];
        if(schStart.substr(2) != '00'){
            schStart = parseFloat(schStart.substr(0,2))*100 + parseFloat(schStart.substr(2))/60*100;
        }
        if(schEnd.substr(2) != '00'){
            schEnd = parseFloat(schEnd.substr(0,2))*100 + parseFloat(schEnd.substr(2))/60*100;
        }
        let top = ((parseFloat(courseStart) - parseFloat(schStart))/50/timeArray.length)*100 + '%';
        let height = ((parseFloat(courseEnd) - parseFloat(courseStart))/50/timeArray.length)*100 + '%';
        return { top , height };
    }

    //上课/补课/试听学员姓名格式化方法
    function formatStu(array,type){
        let formatArray = [];
        if(array && array.length > 0){
            return formatArray = array.map((item,index) => {
                return( <span key = { item.cpdId + type + index }>{ item.name }</span> )
            });
        }else{
            return [];
        }
    }

    //显示给用户看打印页面
    let renderItem = [];
    for(let i in data){
        let courseItem = [];
        for(let j in data[i].course){
            let top = jusTopAndHeight(data[i].course[j].startTime,data[i].course[j].endTime,timeArray).top;
            let height = jusTopAndHeight(data[i].course[j].startTime,data[i].course[j].endTime,timeArray).height;
            let stuArr = formatStu(data[i].course[j].stuArr,'_stuArr_');
            let mulStuArr = formatStu(data[i].course[j].mulStuArr,'_mulStuArr_');
            let tryStuArr = formatStu(data[i].course[j].tryStuArr,'_tryStuArr_');
            courseItem.push(
                <div style = {{ width : '100%' , position : 'absolute' , top : top , height : height , border : '1px solid #ddd' , borderRadius : '3px' , padding : '2px' , background : '#f5f5f5' , overflow : 'auto' }} key = { 'course_item_' +  data[i].course[j].cpdId }>
                    <div style = {{ display : 'flex' , flexWrap : 'wrap' }}>
                        <p style = {{ width : '50%' , textAlign : 'left' , fontWeight : '600' }}>{ data[i].course[j].courseName || '--' }</p>
                        <p style = {{ width : '50%' , textAlign : 'right' }}>
                            <span style = {{ background : '#999' , color : '#fff' , padding : '0 2px' , borderRadius : '3px' }}>
                                { (data[i].course[j].startTime || '未知') + '~' + (data[i].course[j].endTime || '未知') }
                            </span>
                        </p>
                        <p style = {{ width : '50%' , textAlign : 'left' , whiteSpace : 'nowrap' , overflow : 'hidden' , textOverflow : 'ellipsis' }}>课程:{ data[i].course[j].courseName || '--' }</p>
                        <p style = {{ width : '50%' , textAlign : 'left' , whiteSpace : 'nowrap' , overflow : 'hidden' , textOverflow : 'ellipsis' }}>教室:{ data[i].course[j].roomName || '--' }</p>
                        <p style = {{ width : '50%' , textAlign : 'left' , whiteSpace : 'nowrap' , overflow : 'hidden' , textOverflow : 'ellipsis' }}>主教:{ data[i].course[j].mtNames || '--' }</p>
                        <p style = {{ width : '50%' , textAlign : 'left' , whiteSpace : 'nowrap' , overflow : 'hidden' , textOverflow : 'ellipsis' }}>助教:{ data[i].course[j].atNames || '--' }</p>
                        <p style = {{ width : '100%' }}>{ stuArr || [] }{ mulStuArr || [] }{ tryStuArr || [] }</p>
                    </div>
                </div>
            )
        }
        renderItem.push(
            <div style = {{ width : 250 , height : '100%' ,borderRight : '1px solid #ddd' , borderBottom : '1px solid #ddd' , marginRight : i == (data.length - 1) ? 20 : 0 }} key = { 'data_' + i }>
                <div style = {{ width : '100%' , height : 40 , lineHeight : '40px' , textAlign : 'center' , borderTop : '1px solid #ddd' , borderBottom : '1px solid #ddd' , whiteSpace : 'nowrap' , overflow : 'hidden' , textOverflow : 'ellipsis' , padding : '0 5px' }}>
                    { data[i].name }
                </div>
                <div style = {{ width : '100%' , height : 'calc(100% - 40px)' , position : 'relative' }}>
                    { courseItem || [] }
                </div>
            </div>
        )
    }

    //实际打印的打印页面
    let realRender = [];
    let realPrint = Math.ceil(data.length/5);       //需要渲染的组数个数(5个为1组)
    let realRemainder = data.length - (realPrint - 1)*5;         //余数，用来进行大于5个的最后一组或者小于5个的第一组渲染
    for(let i = 0 ; i < realPrint ; i++ ){
        let realData = [];                          //需要渲染的data数组
        let realRenderItem = [];                    //渲染出的每一项
        if(i != (realPrint - 1) && realPrint > 1){  //非首页与末页
            //默认一页最多6个老师/教室
            for(let j = (i*5) ; j < (i*5+5) ; j++){
                let courseItem = [];
                for(let k in data[j].course){
                    let top = jusTopAndHeight(data[j].course[k].startTime,data[j].course[k].endTime,timeArray).top;
                    let height = jusTopAndHeight(data[j].course[k].startTime,data[j].course[k].endTime,timeArray).height;
                    let stuArr = formatStu(data[j].course[k].stuArr,'_stuArr_');
                    let mulStuArr = formatStu(data[j].course[k].mulStuArr,'_mulStuArr_');
                    let tryStuArr = formatStu(data[j].course[k].tryStuArr,'_tryStuArr_');
                    courseItem.push(
                        <div style = {{ width : 'calc(100% - 10px)' , position : 'absolute' , right : 0 , top : top , height : height , border : '1px solid #ddd' , borderRadius : '3px' , padding : '2px' , background : '#f5f5f5' , fontSize : '12px' ,overflow : 'hidden' }} key = { 'real_course_item_' +  data[j].course[k].cpdId }>
                            <div style = {{ display : 'flex' , flexWrap : 'wrap' }}>
                                <p style = {{ width : '50%' , textAlign : 'left' , fontWeight : '600' }}>{ data[j].course[k].courseName || '--' }</p>
                                <p style = {{ width : '50%' , textAlign : 'right' }}>
                                    <span style = {{ background : '#999' , color : '#fff' , padding : '0 2px' , borderRadius : '3px' }}>
                                        { (data[j].course[k].startTime || '未知') + '~' + (data[j].course[k].endTime || '未知') }
                                    </span>
                                </p>
                                <p style = {{ width : '50%' , textAlign : 'left' , whiteSpace : 'nowrap' , overflow : 'hidden' , textOverflow : 'ellipsis' }}>课程:{ data[j].course[k].courseName || '--' }</p>
                                <p style = {{ width : '50%' , textAlign : 'left' , whiteSpace : 'nowrap' , overflow : 'hidden' , textOverflow : 'ellipsis' }}>教室:{ data[j].course[k].roomName || '--' }</p>
                                <p style = {{ width : '50%' , textAlign : 'left' , whiteSpace : 'nowrap' , overflow : 'hidden' , textOverflow : 'ellipsis' }}>主教:{ data[j].course[k].mtNames || '--' }</p>
                                <p style = {{ width : '50%' , textAlign : 'left' , whiteSpace : 'nowrap' , overflow : 'hidden' , textOverflow : 'ellipsis' }}>助教:{ data[j].course[k].atNames || '--' }</p>
                                <p style = {{ width : '100%' }}>{ stuArr || [] }{ mulStuArr || [] }{ tryStuArr || [] }</p>
                            </div>
                        </div>
                    )
                }
                realRenderItem.push(
                    <div style = {{ width : 250 , height : '100%' , borderRight : '1px solid #ddd' , borderBottom : '1px solid #ddd' }} key = { 'realRender_item_' + j }>
                        <div style = {{ width : '100%' , height : 40 , lineHeight : '40px' , textAlign : 'center' , borderTop : '1px solid #ddd' , borderBottom : '1px solid #ddd' , whiteSpace : 'nowrap' , overflow : 'hidden' , textOverflow : 'ellipsis' , padding : '0 5px' }}>
                            { data[j].name }
                        </div>
                        <div style = {{ width : '100%' , height : 'calc(100% - 40px)' , position : 'relative' }}>
                            { courseItem || [] }
                        </div>
                    </div>
                )
            }
            realRender.push(
                <div className={styles.real_print_area} key = { 'real_print_area_' + i }>
                    <div style = {{ height : '100%' , display : 'flex' , flexWrap : 'nowrap' , width : `calc(150px + ${realRenderItem.length}*250px)` }} key = { 'realRender_' + i }>
                        <div style = {{ width : 150 , height : '100%'}}>
                            <div style = {{ width : '100%' , height : 40 , border : '1px solid #ddd' }}></div>
                            { renderTimeArray || [] }
                        </div>
                        { realRenderItem || [] }
                    </div>
                </div>
            )
        }else{
            for(let j = (i*5) ; j < (i*5+realRemainder) ; j++){
                let courseItem = [];
                for(let k in data[j].course){
                    let top = jusTopAndHeight(data[j].course[k].startTime,data[j].course[k].endTime,timeArray).top;
                    let height = jusTopAndHeight(data[j].course[k].startTime,data[j].course[k].endTime,timeArray).height;
                    let stuArr = formatStu(data[j].course[k].stuArr,'_stuArr_');
                    let mulStuArr = formatStu(data[j].course[k].mulStuArr,'_mulStuArr_');
                    let tryStuArr = formatStu(data[j].course[k].tryStuArr,'_tryStuArr_');
                    courseItem.push(
                        <div style = {{ width : 'calc(100% - 10px)' , position : 'absolute' , right : 0 , top : top , height : height , border : '1px solid #ddd' , borderRadius : '3px' , padding : '2px' , background : '#f5f5f5' , fontSize : '12px' , overflow : 'hidden' }} key = { 'real_course_item_' +  data[j].course[k].cpdId }>
                            <div style = {{ display : 'flex' , flexWrap : 'wrap' }}>
                                <p style = {{ width : '50%' , textAlign : 'left' , fontWeight : '600' }}>{ data[j].course[k].courseName || '--' }</p>
                                <p style = {{ width : '50%' , textAlign : 'right' }}>
                                    <span style = {{ background : '#999' , color : '#fff' , padding : '0 2px' , borderRadius : '3px' }}>
                                        { (data[j].course[k].startTime || '未知') + '~' + (data[j].course[k].endTime || '未知') }
                                    </span>
                                </p>
                                <p style = {{ width : '50%' , textAlign : 'left' , whiteSpace : 'nowrap' , overflow : 'hidden' , textOverflow : 'ellipsis' }}>课程:{ data[j].course[k].courseName || '--' }</p>
                                <p style = {{ width : '50%' , textAlign : 'left' , whiteSpace : 'nowrap' , overflow : 'hidden' , textOverflow : 'ellipsis' }}>教室:{ data[j].course[k].roomName || '--' }</p>
                                <p style = {{ width : '50%' , textAlign : 'left' , whiteSpace : 'nowrap' , overflow : 'hidden' , textOverflow : 'ellipsis' }}>主教:{ data[j].course[k].mtNames || '--' }</p>
                                <p style = {{ width : '50%' , textAlign : 'left' , whiteSpace : 'nowrap' , overflow : 'hidden' , textOverflow : 'ellipsis' }}>助教:{ data[j].course[k].atNames || '--' }</p>
                                <p style = {{ width : '100%' }}>{ stuArr || [] }{ mulStuArr || [] }{ tryStuArr || [] }</p>
                            </div>
                        </div>
                    )
                }
                realRenderItem.push(
                    <div style = {{ width : 250 , height : '100%' , borderRight : '1px solid #ddd' , borderBottom : '1px solid #ddd' }} key = { 'realRender_item_' + j }>
                        <div style = {{ width : '100%' , height : 40 , lineHeight : '40px' , textAlign : 'center' , borderTop : '1px solid #ddd' , borderBottom : '1px solid #ddd' , whiteSpace : 'nowrap' , overflow : 'hidden' , textOverflow : 'ellipsis' , padding : '0 5px' }}>
                            { data[j].name }
                        </div>
                        <div style = {{ width : '100%' , height : 'calc(100% - 40px)' , position : 'relative' }}>
                            { courseItem || [] }
                        </div>
                    </div>
                )
            }
            realRender.push(
                <div className={styles.real_print_area} key = { 'real_print_area_' + i }>
                    <div style = {{ height : '100%' , display : 'flex' , flexWrap : 'nowrap' , width : `calc(150px + ${realRenderItem.length}*250px)` }} key = { 'realRender_' + i }>
                        <div style = {{ width : 150 , height : '100%'}}>
                            <div style = {{ width : '100%' , height : 40 , border : '1px solid #ddd' }}></div>
                            { renderTimeArray || [] }
                        </div>
                        { realRenderItem || [] }
                    </div>
                </div>
            )
        }
    }

    return (
        <div className={styles.all}>
            <div className={styles.choose_area}>
                <Select
                    notFoundContent = "未找到"
                    showSearch
                    size = 'default'
                    placeholder = '请选择维度'
                    optionFilterProp="children"
                    style = {{ width : 140 , marginRight : 20 }}
                    onChange = { DimensionOnChange }
                    defaultValue = '1'>
                    <Option value = '1' key = 'tea'>老师</Option>
                    <Option value = '2' key = 'cls'>教室</Option>
                </Select>
                <Select
                    mode = 'multiple'
                    notFoundContent = "未找到"
                    showSearch
                    allowClear
                    size = 'default'
                    placeholder = { dimension == '1' ? '请选择老师' : dimension == '2' ? '请选择教室' : '' }
                    optionFilterProp="children"
                    value = { dimension == '1' ? selectTeaContent : dimension == '2' ? selectClsContent : [] }
                    style = {{ width : 'auto' , minWidth : 180 }}
                    onChange = { dimension == '1' ? SelectTeaOnChange : dimension == '2' ? SelectClsOnChange : null }>
                    { dimension == '1' && staffInfo && staffInfo.length > 0 ? staffInfo.map(function(item,index){
                            return(
                                <Option value = { item.userId + '-' + item.userName } key = { item.userId + '' }>{ item.userName  }</Option>
                            )
                        })
                        :
                      dimension == '2' && clsRoomInfo && clsRoomInfo.length > 0 ? clsRoomInfo.map(function(item,index){
                            return(
                                <Option value = { item.id + '-' + item.name } key = { item.id + '' }>{ item.name  }</Option>
                            )
                        })
                        :
                        []
                    }
                </Select>
            </div>
            {/*给用户看的打印页面*/}
            <div className={styles.print_area}>
                <div style = {{ width : `calc(130px + 250px*${data.length})` , height : '100%' , display : 'flex' , flexWrap : 'nowrap' , marginBottom : 20 }}>
                    <div style = {{ width : 130 , height : '100%'}}>
                        <div style = {{ width : '100%' , height : 40 , border : '1px solid #ddd' }}></div>
                        { renderTimeArray || [] }
                    </div>
                    { renderItem || [] }
                </div>
            </div>
            {/*实际打印的页面*/}
            <div style = {{ display : 'block' }} id = 'schedule_print_by_day'>
                { realRender || [] }
            </div>
        </div>
    );
}

export default SchedulePrintByDay;
