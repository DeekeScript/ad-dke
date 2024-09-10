import { getGrabTaskSetting, grabTaskSetting } from '@/services/api/api';
import { PageContainer, ProForm, ProFormDependency, ProFormDigit, ProFormDigitRange, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Alert, message } from 'antd';
import React from 'react';
import { history } from 'umi';

@window.connectModel('user', '@@initialState')
export default class List extends React.Component {
  formRef: React.RefObject<any>;
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.formRef = React.createRef();
  }

  state = {
    agent_user_id: history.location.query?.agent_user_id,
    user_id: history.location.query?.user_id,
    user: this.props.user?.initialState?.currentUser,
  }

  record = {}

  async componentDidMount(): void {
    let res = await this.getData();
    if (res.code === 0) {
      this.formRef.current.setFieldsValue({
        'machine_count': res.data.machine_count,
        'contact_count': res.data.contact_count,
        'contact_add_count': res.data.contact_add_count,
        'search_add_count': res.data.search_add_count,
        'add_contact_friend_count': res.data.add_contact_friend_count,
        'add_search_friend_count': res.data.add_search_friend_count,
        'add_friend_sec': res.data.add_friend_sec,
        'send_text': res.data.send_text,
      });
    }
  }

  getData = async () => {
    const res = await getGrabTaskSetting({});
    return res;
  }

  handleUpdate = async (fields: any) => {
    let res = await grabTaskSetting({ ...fields });
    if (res.success) {
      message.success(res.msg);
      return true;//关闭弹窗
    }
  }

  render() {
    return (
      <PageContainer>
        <Alert style={{ marginBottom: 12 + 'px' }} type='warning' description={<span>请根据实际情况配置参数！ 每台机器操作数量=每台机器微信数*每个微信能操作的数量 【当前最多支持每台手机2个微信】</span>} />
        <ProForm
          formRef={this.formRef}
          onFinish={async (values) => {
            await this.handleUpdate(values);
          }}
          style={{ backgroundColor: '#ffffff', padding: '24px' }}
        >
          <ProFormDigit
            width="md"
            name="machine_count"
            label="机器数量"
            tooltip=""
            placeholder="请输入机器数量"
          />

          <ProFormDigit
            width="md"
            name={'contact_count'}
            label="初始通讯录手机号数量/每台机器"
            tooltip=""
            placeholder="请输入初始通讯录手机号数量"
          />

          <ProFormDigit
            width="md"
            name={'contact_add_count'}
            label="通讯录每日新增数量/每台机器"
            tooltip=""
            placeholder="请输入通讯录每日新增数量"
          />

          <ProFormDigit
            width="md"
            name={'search_add_count'}
            label="搜索每日新增数量/每台机器"
            tooltip=""
            placeholder="请输入搜索每日新增数量"
          />

          <ProFormDigit
            width="md"
            name={'add_contact_friend_count'}
            label="每次添加通讯录好友数量/每台机器"
            tooltip=""
            placeholder="请输入每次添加通讯录好友数量"
          />

          <ProFormDigit
            width="md"
            name={'add_search_friend_count'}
            label="每次添加搜索好友数量/每台机器"
            tooltip=""
            placeholder="请输入每次添加搜索好友数量"
          />

          <ProFormDigit
            width="md"
            name={'add_friend_sec'}
            label="每次添加好友间隔时间（秒）"
            tooltip=""
            placeholder="请输入每次添加好友间隔时间（秒）"
          />

          <ProFormText
            width="md"
            name={'send_text'}
            label="发送请求话术"
            tooltip=""
            placeholder="请输入发送请求话术"
          />
        </ProForm>
      </PageContainer>
    );
  }
}
