import React from 'react';
import {Form} from 'antd';
import QueueAnim from 'rc-queue-anim';
const FormItem 		= Form.Item;
const InstitutionsInfoComponent = React.createClass({

	 getInitialState() {
		    return {
		      show: false,
		      text:'点击展开',
		   };
	  },

	 onClick() {
		    this.setState({
		      show: !this.state.show,
		      text: `${this.state.show ? '点击展开' : '点击收起'}`,
		    });
	 },

	render() {
		const formItemLayout = {
		      wrapperCol: { span: 24 },
		};
		return(
			<div>
				<div className="clearance"></div>
			    <div>
			    	<div style={{
			    	    width: 'calc(100% - 70px)',
			    	    float: 'left'
			    	}}>
        			   <h4 className="institution_TitleLabel" >机构介绍</h4>
			    	</div>
			    	<div className="rightImage"></div>
			        <QueueAnim component={Form} className="ant-form ant-form-horizontal" type="bottom" leaveReverse>
			          {this.state.show ? [
			            <FormItem key="item1"
			            	{...formItemLayout}>
			              		<p className="ant-form-text"
			              		    style={{width : 'calc(100% - 20px)',
			              			marginLeft : '10',
			              			marginRight : '10',
			              			marginTop : '10',
			              			textIndent : '3em',
			              			fontSize : '12',
			              			lineHeight : '2'}}>{this.props.textData}
			              		</p>
			            </FormItem>,
			          ] : null}
			        </QueueAnim>

			        <div style={{
			            	display : this.state.text == '点击收起' ? 'none' : 'block',
        			        height: '60',
        			        width: 'calc(100% - 20px)',
        			        marginLeft: '10',
        			        marginRight: '10',
        			        marginTop: '10',
        			        textIndent: '3em',
        			        fontSize: '12',
        			        lineHeight: '2',
        			        overflow: 'hidden'}}>
			        	<p>{this.props.textData}</p>
			        </div>

			        <p className="buttons">
			          <p type="primary"
			              onClick={this.onClick}
			          	style={{
			          	    marginLeft : 'calc(50% - 100px)',
        			            width : '200',
        			            marginTop : '10',
        			            fontSize : '13',
        			            color : '#c4c4c4',
        			            textAlign: 'center'}}>{this.state.text}
    			           </p>
			        </p>
			      </div>
			  <br/>
		      </div>
		)
	}
})

export default InstitutionsInfoComponent;
