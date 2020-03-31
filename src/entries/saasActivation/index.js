import './index.html';
import dva from 'dva';
import 'antd/dist/antd.min.css';
import '../../utils/request';
import '../index/index.css';
import './index.css';
import '../../assets/iconfont/iconfont.css';
import { message } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

message.config({
  duration: 3,
});

const app = dva();

app.model(require('../../models/saasActivationModel/activationModel'));

app.router(require('./router'));

app.start('#saasActivation');
