import { videoCommentList, removeVideoComment } from '@/services/api/api';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Alert, message, Popconfirm } from 'antd';
import React from 'react';
import { columns } from './help/comment';
import { history } from "umi";

export default class Comment extends React.Component {
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
    const res = await videoCommentList(params);
    return res;
  }

  handleRemove = async (id: number) => {
    let res = await removeVideoComment({
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
          search={{ labelWidth: 68, }}
          scroll={{ x: 2400 }}
          toolBarRender={() => [

          ]}
          request={this.getData}
          columns={[...columns, {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            fixed: 'right',
            width: 80,
            render: (_, record) => [
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
