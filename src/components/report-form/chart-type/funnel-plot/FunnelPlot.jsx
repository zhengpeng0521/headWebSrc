import React from 'react';
import { Popover } from 'antd';
import QueueAnim from 'rc-queue-anim';
import { arrayMax } from '../../../../utils/arrayUtils';
import { NullData , ProgressBar } from '../../../common/new-component/NewComponent';
import styles from './FunnelPlot.less';

/*漏斗图*/
function FunnelPlot({
    currentKernel,                  //当前浏览器内核
    loading,                        //加载状态
    data,                           //销售漏斗报表数据
    LegendItemOnClick,              //legend点击事件
}){

    //background : currentKernel + gradientType + '-gradient(' + gradientAngle + render + ')'

    let colorArr =['rgba(228,83,60,1)' , 'rgba(239,160,58,1)' , 'rgba(234,212,59,1)' , 'rgba(100,194,162,1)' , 'rgba(78,176,217,1)' , 'rgba(63,138,232,1)' , 'rgba(130,82,219,1)'];

    let colorArrOpa = ['rgba(228,83,60,.6)' , 'rgba(239,160,58,.6)' , 'rgba(234,212,59,.6)' , 'rgba(100,194,162,.6)' , 'rgba(78,176,217,.6)' , 'rgba(63,138,232,.6)' , 'rgba(130,82,219,.6)'];

    let dataRender = [];
    let legendRender = [];
    if(data && data.length > 0){
        /*渲染漏斗图正文*/
        let dataValue = [];
        for(let i in data){
            dataValue.push( !isNaN(parseFloat(data[i].num)) ? parseFloat(data[i].num) : 0 )
        }
        //找到最大值作为宽度百分之百
        let maxNum = arrayMax(dataValue);
        dataRender = data.map((item,index) => {
            if(!item.click){
                return(
                    <div style={{ width : `${!isNaN(parseFloat(item.num)) ? parseFloat(item.num)/maxNum*100 : 2 }%` , background : `${currentKernel}linear-gradient(90deg,${colorArrOpa[index%colorArrOpa.length]},${colorArr[index%colorArr.length]})` }}
                        key = { 'dataRender_' + index }
                        className={styles.funnel_plot_item}
                        data-intro={ `${item.name}（${!isNaN(parseFloat(item.num)) ? parseFloat(item.num) : 0}）` }>
                    </div>
                );
            }
        })
        /*渲染漏斗图legend*/
        legendRender = data.map((item,index) => {
            if(!item.click){
                return(
                    <div className={styles.funnel_plot_legend_item} key = { 'legend_' + index } onClick = {() => LegendItemOnClick(item.key,!item.click)}>
                        <div style={{ background : `${currentKernel}linear-gradient(90deg,${colorArrOpa[index%colorArrOpa.length]},${colorArr[index%colorArr.length]})` }}></div>
                        <Popover placement="top" content={ item.name + '：' + item.num } trigger="hover">
                            <div>
                                { item.name.length > 5 ? item.name.substr(0,4) + '...：' : item.name + '：' }
                                { !isNaN(parseFloat(item.num)) ? parseFloat(item.num) : 0 }
                            </div>
                        </Popover>
                    </div>
                );
            }else{
                return(
                    <div className={styles.funnel_plot_legend_item_disabeld} key = { 'legend_' + index } onClick = {() => LegendItemOnClick(item.key,!item.click)}>
                        <div style={{ background : '#ddd' }}/>
                        <div style={{ color : '#ddd' }}>
                            { item.name.length > 5 ? item.name.substr(0,4) + '...：' : item.name + '：' }
                            { !isNaN(parseFloat(item.num)) ? parseFloat(item.num) : 0 }
                        </div>
                    </div>
                );
            }
        })
    }

    return(
        <div className={styles.all}>
            { !!data && data.length > 0 && !loading ?
                <QueueAnim type={[ 'right' , 'right' ]} delay={100} className={styles.funnel_plot} appear = { false } >
                    { dataRender || [] }
                </QueueAnim>
                :
                null
            }
            { !!data && data.length > 0 && !loading ?
                <div className={styles.funnel_plot_legend}>
                    { legendRender || [] }
                </div>
                :
                null
            }
            { !loading ?
                (!!data && data.length > 0 ?
                null
                :
                <NullData height='100%'/>)
                :
                <ProgressBar height='100%' content = '统计中'/>
            }
        </div>
    )
}

export default FunnelPlot;
