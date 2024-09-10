import { addAgent, agentList, removeAgent, updateAgent } from '@/services/api/api';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import React from 'react';
import UpdateForm from './components/UpdateForm';
import { columns } from './help/list';
import { history } from "umi";

export default class List extends React.Component {
  actionRef: React.RefObject<any>;
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.actionRef = React.createRef();
  }

  state = {

  }

  componentDidMount(): void {

  }

  getData = async (params: { current: number; pageSize: number; douyin: string; weixin: string; name: string; }) => {
    const res = await agentList(params);
    return res;
  }

  handleUpdate = async (fields: any) => {
    let res = await updateAgent({ ...fields });
    if (res.success) {
      this.actionRef.current.reload();
      message.success(res.msg);
      return true;//关闭弹窗
    }
  }

  handleAdd = async (fields: any) => {
    let res = await addAgent({
      ...fields,
    });
    if (res.success) {
      this.actionRef.current.reload();
      message.success(res.msg);
      return true;//关闭弹窗
    }
  }

  handleRemove = async (id: number) => {
    let res = await removeAgent({
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
          scroll={{ x: 1800 }}
          rowKey="id"
          search={{ labelWidth: 80, }}
          toolBarRender={() => [
            <UpdateForm
              btn={<Button type="primary">
                <PlusOutlined />
                添加
              </Button>}
              onSubmit={this.handleAdd}
              values={undefined}
            />,
          ]}
          request={this.getData}
          columns={[...columns, {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            fixed: 'right',
            width: 240,
            render: (_, record) => [
              <a key={"machine_" + record.id} onClick={() => history.push('/machine/List?agent_user_id=' + record.user_id)}>机器列表</a>,
              <a key={"statistic_" + record.id} onClick={() => history.push('/statistic/List?agent_user_id=' + record.user_id)}>统计数据</a>,
              <UpdateForm
                key={'update__' + record.id}
                btn={<a key={"update_" + record.id}>修改</a>}
                onSubmit={this.handleUpdate}
                values={record}
              />,
              <Popconfirm
                key={'delete__' + record.id}
                title="确定删除吗？"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={() => this.handleRemove(record.id)}
              > <a key={"delete_" + record.id}>删除</a></Popconfirm>,
            ],
          },]}
        />
      </PageContainer>
    );
  }
}
