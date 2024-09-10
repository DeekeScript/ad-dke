import If from '@/components/If';
import { addMachine, machineList, removeMachine, updateMachine } from '@/services/api/api';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Alert, Button, Col, message, Modal, Popconfirm, Row, Tooltip } from 'antd';
import React from 'react';
import { history } from 'umi';
import UpdateForm from './components/UpdateForm';
import { columns } from './help/list';
import QRCode from 'qrcode.react';

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

    const res = await machineList(params);
    if (res.success) {
      this.setState({
        machineCount: res.machineCount,
      });
    }
    return res;
  }

  handleUpdate = async (fields: any) => {
    let res = await updateMachine({ ...fields });
    if (res.success) {
      this.actionRef.current.reload();
      message.success(res.msg);
      return true;//关闭弹窗
    }
  }

  handleAdd = async (fields: any) => {
    let res = await addMachine({
      ...fields,
    });
    if (res.success) {
      this.actionRef.current.reload();
      message.success(res.msg);
      return true;//关闭弹窗
    }
  }

  // downloads = (record: any) => {
  //   record.domain = window.location.origin + '/';
  //   const blob = new Blob([JSON.stringify(record)], {
  //     type: 'text/plain'
  //   });
  //   const aLink = document.createElement('a');
  //   aLink.style.display = 'none';
  //   aLink.href = URL.createObjectURL(blob);
  //   //console.log(URL.createObjectURL(blob));
  //   aLink.download = 'device.json';
  //   document.body.appendChild(aLink);
  //   aLink.click();
  //   document.body.removeChild(aLink);
  //   return true;
  // }

  download = (record: any, mobileStopType: int) => {
    record.domain = 'https://' + window.location.host + '/';
    let params = '';
    for (let i in record) {
      params += "&" + i + "=" + record[i];
    }

    if (mobileStopType) {
      params += '&mobileStopType=' + mobileStopType;
    }

    //window.open('/api/downloadJson?' + params.substring(1));
    return record.domain + 'api/downloadJson?' + params.substring(1);
  }

  handleRemove = async (id: number) => {
    let res = await removeMachine({
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
        {this.state.user.role_type === 1 ? <Alert style={{ marginBottom: 12 + 'px' }} type='warning' description={<span>尊敬的代理商，您好！你还可以添加 <strong>{this.state.machineCount}</strong> 台手机！</span>} /> : undefined}
        <ProTable
          //headerTitle={'查询表格'}
          actionRef={this.actionRef}
          rowKey="id"
          search={{ labelWidth: 86, }}
          toolBarRender={() => [
            <If access={'Api_addMachine'}>
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
        <Modal closable={false} footer={[
          <Button key="back" onClick={() => {
            this.setState({
              qrcodeOpen: false,
            });
          }}>
            取消
          </Button>,
        ]} okText={undefined} title="配置文件下载" open={this.state.qrcodeOpen}>
          <Col>
            <Row>
              <div style={{ textAlign: 'center', margin: 'auto 12px', width: '100%' }}>
                <a href='https://docs.qq.com/doc/DTkxnUFFGcWRmZXZL' target={'_blank'}>第一种模式，请扫码下面</a>
              </div>
              <div style={{ backgroundColor: '#FFFFFF', padding: '12px', margin: 'auto', }}>
                <QRCode
                  id="bill_qr_code_url"
                  value={this.download(this.record)} //value参数为生成二维码的链接 我这里是由后端返回
                  size={120} //二维码的宽高尺寸
                  fgColor="#000000"  //二维码的颜色
                />
              </div>
            </Row>
            <Row>
              <div style={{ textAlign: 'center', margin: 'auto 12px', width: '100%' }}>
                <a href='https://docs.qq.com/doc/DTkxnUFFGcWRmZXZL' target={'_blank'}>第二种模式，请扫码下面</a>
              </div>
              <div style={{ backgroundColor: '#FFFFFF', padding: '12px', margin: 'auto', }}>
                <QRCode
                  id="bill_qr_code_url"
                  value={this.download(this.record, 1)} //value参数为生成二维码的链接 我这里是由后端返回
                  size={120} //二维码的宽高尺寸
                  fgColor="#000000"  //二维码的颜色
                />
              </div>
            </Row>
          </Col>
        </Modal>
      </PageContainer>
    );
  }
}
