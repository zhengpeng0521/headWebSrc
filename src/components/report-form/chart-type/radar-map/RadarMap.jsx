import React from 'react';
import createG2 from 'g2-react';
import { Stat } from 'g2';
import { arrayMax } from '../../../../utils/arrayUtils';
import { NullData , ProgressBar } from '../../../common/new-component/NewComponent';

/*名单来源表*/
function RadarMap({
    loading,
    data,
    color,
}){

    let sumNum = 0;         //计算总数
    let dataValue = [];
    for(let i in data){
        //计算总数
        sumNum += parseFloat(data[i].value);

        //找出最大值作为雷达图最大值
        dataValue.push( !isNaN(parseFloat(data[i].value)) ? parseFloat(data[i].value) : 0 )

        //格式化数据
        data[i].value = !isNaN(parseFloat(data[i].value)) ? parseFloat(data[i].value) : 0
    }

    let maxNum = arrayMax(dataValue);   //找出最大值作为雷达图最大值
    let Chart = createG2(chart => {
        chart.col('value', {
            min: 0,
            max: maxNum,
            tickCount: 5            //雷达图分几格
        });
        chart.animate(false);
        chart.tooltip(true, {
            custom: true, // 开启 tooltip 自定义模板功能
            html:  '<div class="ac-tooltip" style="position:absolute;border-radius:5px;border:1px dotted #ddd;padding:10px;background:#fff"><table class="ac-list custom-table"></table></div>', // tooltip 的 html 外层模板，可支持类似 jquery 的使用，直接传入 dom id，如 "#c1"
            itemTpl: '<div style="color:{color}">{name}：{value}</div>', // 使用 html 时每一个显示项的模板，默认支持 index, color, name, value 这四个变量。
            offset: 10, // 偏移量，设置tooltip 显示位置距离 x 轴方向上的偏移
            //customFollow: false // 设置 tooltip 是否跟随鼠标移动，默认为 true，跟随。
        });
        chart.coord('polar');
        chart.legend('id', { // 配置具体字段对应的图例属性
            title: null,
            position: 'bottom',
            formatter:  function(val) {
                return `${val}（${sumNum}）`;
            }, // 格式化图例项的文本显示
        });
        chart.axis('name',{ // 设置坐标系栅格样式
            line: null
        });
        chart.axis('value',{ // 设置坐标系栅格样式
            grid: {
                type: 'polygon' //圆形栅格，可以改成
            }
        });
        chart.line().position('name*value').color('id',color);
        chart.point().position('name*value').color('id',color).shape('circle');
        chart.area().position('name*value').color('id',color);
        chart.render();
    })

    if(!loading){
        if(!!data && data.length > 0){
            return(
                <Chart
                    data = { data }
                    width = { 900 }
                    height = { 380 }
                    plotCfg = { data && data.length % 4 == 0 ? { margin : [60,0,60,0] } : { margin : [60,0,30,0] }}
                    forceFit = { true } />
            );
        }else{
            return(
                <NullData height = '100%'/>
            );
        }
    }else{
        return(
            <ProgressBar height = '100%' content = '统计中'/>
        );
    }
}

export default RadarMap;
