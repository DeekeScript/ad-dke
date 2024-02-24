import If from '@/components/If';
import { addVideoRule, videoRuleList, removeVideoRule, updateVideoRule } from '@/services/api/api';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import React from 'react';
import UpdateForm from './components/VideoRuleUpdateForm';
import { columns } from './help/videoRule';

@window.connectModel('user', '@@initialState')
export default class VideoRule extends React.Component {
  actionRef: React.RefObject<any>;
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.actionRef = React.createRef();
  }

  state = {
    user: this.props.user?.initialState?.currentUser,
    columns: columns,
  }

  componentDidMount(): void {
    if (this.state.user.role_type !== 2) {
      let tmp = [];
      let i = 0;
      for (let t of columns) {
        i++;
        if (i === columns.length - 1) {
          tmp.push({
            title: '用户',
            dataIndex: 'userName',
            search: false,
          });
        }
        tmp.push(t);
      }
      this.setState({
        columns: tmp,
      });
    }
  }

  getData = async (params: { current: number; pageSize: number; douyin: string; weixin: string; name: string; }) => {
    const res = await videoRuleList(params);
    return res;
  }

  handleUpdate = async (fields: any) => {
    let res = await updateVideoRule({ ...fields });
    if (res.success) {
      this.actionRef.current.reload();
      message.success(res.msg);
      return true;//关闭弹窗
    }
  }

  handleAdd = async (fields: any) => {
    let res = await addVideoRule({
      ...fields,
    });
    if (res.success) {
      this.actionRef.current.reload();
      message.success(res.msg);
      return true;//关闭弹窗
    }
  }

  handleRemove = async (id: number) => {
    let res = await removeVideoRule({
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
          search={{ labelWidth: 42, }}
          toolBarRender={() => [
            <If key={'unique'} access={'Api_addVideoRule'}>
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
          columns={[...this.state.columns, {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            fixed: 'right',
            width: 100,
            render: (_, record) => [
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
