import { addUser, userList, removeUser, updateUser, getMachine } from '@/services/api/api';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import React from 'react';
import UpdateForm from './components/UpdateForm';
import { columns } from './help/list';
import { history } from "umi";
import If from '@/components/If';

@window.connectModel('user', '@@initialState')
export default class List extends React.Component {
  actionRef: React.RefObject<any>;
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.actionRef = React.createRef();
  }

  state = {
    user: this.props.user?.initialState?.currentUser
  }

  componentDidMount(): void {

  }

  getData = async (params: { current: number; pageSize: number; douyin: string; weixin: string; name: string; }) => {
    const res = await userList(params);
    return res;
  }

  handleUpdate = async (fields: any) => {
    let res = await updateUser({ ...fields });
    if (res.success) {
      this.actionRef.current.reload();
      message.success(res.msg);
      return true;//关闭弹窗
    }
  }

  handleAdd = async (fields: any) => {
    let res = await addUser({
      ...fields,
    });
    if (res.success) {
      this.actionRef.current.reload();
      message.success(res.msg);
      return true;//关闭弹窗
    }
  }

  handleRemove = async (id: number) => {
    let res = await removeUser({
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
        <ProTable
          //headerTitle={'查询表格'}
          actionRef={this.actionRef}
          rowKey="id"
          search={{ labelWidth: 66, }}
          toolBarRender={() => [
            <UpdateForm
              btn={<Button type="primary">
                <PlusOutlined />
                添加
              </Button>}
              onSubmit={this.handleAdd}
              values={undefined}
              roleType={this.state.user.role_type}
              getMachine={getMachine}
            />,
          ]}
          request={this.getData}
          columns={[...columns, {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
              <a key={"machine_" + record.id} onClick={() => {
                if (record.role_type === 2) {
                  history.push('../machine/List?user_id=' + record.id);
                } else if (record.role_type === 1) {
                  history.push('../machine/List?user_id=0&agent_user_id=' + record.id);
                }
              }}>机器列表</a>,
              <If access="Api_statisticList" key={"statistic_" + record.id}>
                <a key={"machine_statistic_" + record.id} onClick={() => history.push('../statistic/List?user_id=' + record.id)}>统计数据</a>
              </If>,

              <UpdateForm
                key={'update__' + record.id}
                btn={<a key={"update_" + record.id}>修改</a>}
                onSubmit={this.handleUpdate}
                values={record}
                roleType={this.state.user.role_type}
                getMachine={getMachine}
              />,
              this.state.user.id !== record.id ? <Popconfirm
                key={'delete__' + record.id}
                title="确定删除吗？"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={() => this.handleRemove(record.id)}
              > <a key={"delete_" + record.id}>删除</a></Popconfirm> : undefined,
            ],
          },]}
        />
      </PageContainer>
    );
  }
}
