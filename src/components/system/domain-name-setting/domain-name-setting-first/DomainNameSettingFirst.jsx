import React from 'react';
import { Form , Checkbox , Button , Input } from 'antd';
import styles from './DomainNameSettingFirst.less';
const formItemLayout = {
    labelCol : { span: 7 },
    wrapperCol : { span: 12 }
};

/*域名设置 第一步 申请*/
function DomainNameSettingFirst({
    firstStepLoading,                   //页面加载状态
    firstStepSubmitButtonLoading,       //申请使用按钮加载状态
    FirstStepApplyForSubmit,            //申请使用点击提交
    form : {
		getFieldDecorator,
        validateFieldsAndScroll,
        validateFields,
        getFieldsValue,
        getFieldValue,
        getFieldError,
        setFieldsValue,
        resetFields,
	}
}) {

    function submit(e){
        e.preventDefault();
        validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }
            if(!values.agree){
                return message.warn('请同意规则方可申请');
            }
            FirstStepApplyForSubmit({ hostName : values.hostName });
        });
    }

    function checkDomainName(rule, value, callback) {
        if(!/^[^ ]+$/.test(value)) {
            callback('域名中不能包含空格');
        }else if(!/^[A-Za-z0-9]{5,20}$/.test(value)){
            callback('域名必须是5~20字母或数字');
        }else{
            callback();
        }
	}

    return(
        <div className={styles.all}>
            <div className={styles.special}>
                <div className={styles.special_name}>独立域名特点：</div>
                <div className={styles.special_content}>
                    <div>1.拥有机构自己独立的登录站点</div>
                    <div>2.可以根据自身的需要设置登录站点的风格</div>
                    <div>3.登录页拥有自己的品牌LOGO和品牌背景图</div>
                </div>
            </div>
            <div className={styles.domain}>
                <div className={styles.domain_name}>输入自己需要3级域名的名称：</div>
                <div className={styles.domain_content}>
                    <Form.Item>
                        {getFieldDecorator('hostName',{
                            rules: [
                                { required : true , message: '域名不能为空' , /*whitespace : true*/ },
                                { validator : checkDomainName }
                            ],
                        })(
                            <Input placeholder = '域名名称' style = {{ width : 200 , marginRight : 5 }} size = 'default'/>
                        )}
                    </Form.Item>
                    <p>.saas.ishanshan.com</p>
                </div>
                <div className={styles.domain_explain}>请输入5~20位字母或数字</div>
            </div>
            <div className={styles.domain_rules}>
                <div className={styles.domain_rules_name}>闪闪saas子域名注册及使用规则：</div>
                <div className={styles.domain_rules_content}>
                    <div>
                        用户通过闪闪saas系统可申请闪闪子域名，申请成功之后可在服务期间内使用。申请和使用前，请仔细阅读本规则，并同意受本规则约束。
                    </div>
                    <div>
                        1.域名定义
                    </div>
                    <div className={styles.text_indent_2}>
                        闪闪子域名是指用户在遵守本规则的前提下，根据其个性化需求在“saas.ishanshan.com”的域名下申请三级子域名，其展现形式如“****.saas.ishanshan.com”，“****”为用户依据本规则自行设定的内容。
                    </div>
                    <div>
                        2.域名申请
                    </div>
                    <div className={styles.text_indent_2}>
                        2.1.申请子域名的用户需符合如下条件：
                    </div>
                    <div className={styles.text_indent_4}>1）闪闪saas系统用户</div>
                    <div className={styles.text_indent_4}>2）子域名申请符合本规则要求</div>
                    <div>2.2.子域名规则</div>
                    <div className={styles.text_indent_2}>
                        子域名不得使用国家或者地区名称、外国地名、国际组织名称、行政区划名称的全称或者缩写；不得违反法律法规的规定及国家政策的相关内容；不得侵犯他人包括知识产权在内的各项合法权益；不得申请域名开展不正当竞争等违法违规行为；不得违反闪闪saas平台公示的各项规则及服务政策，不得损害闪闪及其关联公司的合法权益。否则，闪闪有权随时暂停用户使用子域名服务。
                    </div>
                    <div>
                        2.3.申请规范
                    </div>
                    <div className={styles.text_indent_2}>
                        子域名的字符数应大于等于5位且小于20位，域名由字母（A-Z，a－z，大小写等价）、数字（0－9）组成。
                    </div>
                    <div>2.4.域名审核</div>
                    <div className={styles.text_indent_2}>
                        子域名申请后闪闪有权抽查审核，子域名不得重复；子域名申请成功后不能修改，用户资质不符合平台约定或存在侵权情形除外。
                    </div>
                    <div>
                        3.域名的所有权及使用保留，闪闪所有子域名归闪闪所有。用户对子域名的使用权不得出租、出借或以其他任何形式对外转让；闪闪与用户的合作终止的，用户对该子域名的使用权亦随之终止。</div>
                    <div>
                        4.免责声明
                    </div>
                    <div className={styles.text_indent_2}>
                        因用户申请及使用闪闪子域名违反国家法律、法规、国家政策或侵犯他人合法权益（包括但不限于知识产权）的，用户应当独立承担全部法律责任，因此导致闪闪及其关联公司利益受损的，用户应当全额赔偿。
                    </div>
                </div>
                <Form.Item className={styles.domain_rules_agree}>
                    {getFieldDecorator('agree')(
                        <Checkbox>同意以上规则</Checkbox>
                    )}
                </Form.Item>
            </div>
            <Button type = 'primary' style = {{ width : 110 }} onClick = { submit } disabled = { firstStepSubmitButtonLoading } loading = { firstStepSubmitButtonLoading }>申请使用</Button>
        </div>
    );
}

export default Form.create()(DomainNameSettingFirst);
