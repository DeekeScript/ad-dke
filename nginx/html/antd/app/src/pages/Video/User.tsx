import { videoDouyinList, removeVideoDouyin, addVideoDouyin, updateVideoDouyin } from '@/services/api/api';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Alert, Button, message, Popconfirm } from 'antd';
import React from 'react';
import { columns } from './help/user';
import DouyinUpdateForm from './components/DouyinUpdateForm';
import { history } from "umi";

export default class User extends React.Component {
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
    params.video_id = history.location?.query.id || 0;
    const res = await videoDouyinList(params);
    return res;
  }

  handleUpdate = async (fields: any) => {
    let res = await updateVideoDouyin({ ...fields });
    if (res.success) {
      this.actionRef.current.reload();
      message.success(res.msg);
      return true;//关闭弹窗
    }
  }

  handleAdd = async (fields: any) => {
    let res = await addVideoDouyin({
      ...fields,
    });
    if (res.success) {
      this.actionRef.current.reload();
      message.success(res.msg);
      return true;//关闭弹窗
    }
  }

  handleRemove = async (id: number) => {
    let res = await removeVideoDouyin({
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
        <Alert style={{ marginBottom: 12 + 'px' }} type={'warning'} description={'本系统数据主要是为了客户调整任务，为防止用户倒卖数据，系统只储存近7天的数据！'}></Alert>
        <ProTable
          actionRef={this.actionRef}
          rowKey="id"
          scroll={{ x: 2200 }}
          search={{ labelWidth: 68, }}
          toolBarRender={() => [
            <DouyinUpdateForm
              key={'add'}
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
            width: 100,
            render: (_, record) => [
              <DouyinUpdateForm
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
