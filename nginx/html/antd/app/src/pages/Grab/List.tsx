import If from '@/components/If';
import { addGrabTask, grabTaskList, removeGrabTask, updateGrabTask } from '@/services/api/api';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Alert, Button, Popconfirm, message } from 'antd';
import React from 'react';
import { history } from 'umi';
import UpdateForm from './components/UpdateForm';
import { columns } from './help/list';

@window.connectModel('user', '@@initialState')
export default class List extends React.Component {
  actionRef: React.RefObject<any>;
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.actionRef = React.createRef();
  }

  state = {
    agent_user_id: history.location.query?.agent_user_id,
    user_id: history.location.query?.user_id,
    user: this.props.user?.initialState?.currentUser,
    machineCount: 0,
    qrcodeOpen: false,
  }

  record = {}

  componentDidMount(): void {

  }

  getData = async (params: { current: number; pageSize: number; douyin: string; weixin: string; name: string; }) => {
    if (this.state.agent_user_id) {
      params['agent_user_id'] = this.state.agent_user_id;
    }

    if (this.state.user_id) {
      params['user_id'] = this.state.user_id;
    }

    const res = await grabTaskList(params);
    return res;
  }

  handleUpdate = async (fields: any) => {
    let res = await updateGrabTask({ ...fields });
    if (res.success) {
      this.actionRef.current.reload();
      message.success(res.msg);
      return true;//关闭弹窗
    }
  }

  handleAdd = async (fields: any) => {
    let res = await addGrabTask({
      ...fields,
    });
    if (res.success) {
      this.actionRef.current.reload();
      message.success(res.msg);
      return true;//关闭弹窗
    }
  }

  handleRemove = async (id: number) => {
    let res = await removeGrabTask({
      id: id,
    });
    console.log(res);
    if (res.success) {
      this.actionRef.current.reload();
      message.success(res.msg);
    }
  }

  render() {
    return (
      <PageContainer>
        {this.state.user.role_type === 1 ? <Alert style={{ marginBottom: 12 + 'px' }} type='warning' description={<span>请将任务的关键词尽可能细分，比如：装修可以拆分为“武汉装修”、“武汉装饰”、“宜昌装修”、“武汉江夏装修”等</span>} /> : undefined}
        <ProTable
          //headerTitle={'查询表格'}
          actionRef={this.actionRef}
          rowKey="id"
          search={{ labelWidth: 86, }}
          toolBarRender={() => [
            <If access={'Api_addGrabTask'}>
              <UpdateForm
                btn={<Button type="primary">
                  <PlusOutlined />
                  添加
                </Button>}
                onSubmit={this.handleAdd}
                values={undefined}
              />
            </If>,
          ]}
          request={this.getData}
          columns={[...columns, {
            title: '操作',
            width: 120,
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
              <If key={'upd_' + record.id} access="Api_updateMachine">
                <UpdateForm
                  key={'update__' + record.id}
                  btn={<a key={"update_" + record.id}>修改</a>}
                  onSubmit={this.handleUpdate}
                  values={record}
                  roleType={this.state.user.role_type}
                />
              </If>
              ,
              <If key={'del_' + record.id} access="Api_removeMachine">
                <Popconfirm
                  key={'delete__' + record.id}
                  title="确定删除吗？"
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                  onConfirm={() => this.handleRemove(record.id)}
                > <a key={"delete_" + record.id}>删除</a></Popconfirm>
              </If>,
            ],
          },]}
        />
      </PageContainer>
    );
  }
}
