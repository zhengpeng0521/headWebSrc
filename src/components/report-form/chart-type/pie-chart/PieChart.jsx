import React from 'react';
import createG2 from 'g2-react';
import { Stat } from 'g2';
import { NullData , ProgressBar } from '../../../common/new-component/NewComponent';

/*名单来源表*/
function PieChart({
    loading,
    data
}){

    let Chart = createG2(chart => {
        // 重要：绘制饼图时，必须声明 theta 坐标系
        chart.coord('theta', {
            radius: 0.68 // 设置饼图的大小
        });
        chart.legend('name', {
            position: 'bottom',
            itemWrap: true,
            formatter: function(val) {
                for(let i in data) {
                    if(data[i].name === val) {
                        //return val + ': ' + data[i].value + '%';
                        return val + '：' + data[i].value + '';
                    }
                }
            }
        });
        chart.tooltip(true, {
            custom: true, // 开启 tooltip 自定义模板功能
            html:  '<div class="ac-tooltip" style="position:absolute;border-radius:5px;border:1px dotted #ddd;padding:10px;background:#fff"><table class="ac-list custom-table"></table></div>', // tooltip 的 html 外层模板，可支持类似 jquery 的使用，直接传入 dom id，如 "#c1"
            itemTpl: '<div style="color:{color}">{name}：{value}</div>', // 使用 html 时每一个显示项的模板，默认支持 index, color, name, value 这四个变量。
            offset: 10, // 偏移量，设置tooltip 显示位置距离 x 轴方向上的偏移
            //customFollow: false // 设置 tooltip 是否跟随鼠标移动，默认为 true，跟随。
        });
        chart.intervalStack()
        .position(Stat.summary.percent('value'))
        .color('name',['#7e83e6','#7eace6','#7ccee2','#65e1ce','#67e298','#7edd3a','#c2e136','#e0d535','#e6ae42','#e6693d','#dc64ad','#b364dc','#9664dc'])      //颜色
        .label('name*value*',function(name,value){
            return `${name}（${value}）`;
        });
        chart.render();
//        chart.on('plotclick',function(ev){
//
//        })

        // 设置默认选中
        let geom = chart.getGeoms()[0]; // 获取所有的图形
        let items = geom.getData(); // 获取图形对应的数据
        //geom.setSelected(items[1]); // 设置选中
    })

    if(!loading){
        if(!!data && data.length > 0){
            return(
                <Chart
                    data = { data }
                    width = { 900 }
                    height = { 380 }
                    plotCfg = {{ margin : [20,0,40,0] }}
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

export default PieChart;
