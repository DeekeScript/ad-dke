import { apkList, getCosSign, addApk } from '@/services/api/api';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import React from 'react';
import { columns } from './help/list';
import { Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import COS from 'cos-js-sdk-v5';

export default class List extends React.Component {
  actionRef: React.RefObject<any>;
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.actionRef = React.createRef();
  }

  state = {
    loading: false,
  }

  componentDidMount(): void {

  }

  getData = async (params: { current: number; pageSize: number; douyin: string; weixin: string; name: string; }) => {
    const res = await apkList(params);
    return res;
  }

  upload = async (fileObject, file) => {
    this.setState({
      loading: true,
    });
    let cos = new COS({
      // getAuthorization 必选参数
      getAuthorization: function (options, callback) {
        let url = '/api/getCosSign'; // url 替换成您自己的后端服务
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
        xhr.onload = function (e) {
          try {
            let data = JSON.parse(e.target.responseText);
            let credentials = data.data.credentials;
            if (!data || !credentials) {
              console.error('credentials invalid:\n' + JSON.stringify(data, null, 2));
            } else {
              callback({
                TmpSecretId: credentials.tmpSecretId,
                TmpSecretKey: credentials.tmpSecretKey,
                SecurityToken: credentials.sessionToken,
                // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
                StartTime: data.data.startTime, // 时间戳，单位秒，如：1580000000
                ExpiredTime: data.data.expiredTime, // 时间戳，单位秒，如：1580000000
              });
            }
          } catch (e) {
            console.error(e);
          }
        };
        xhr.send();
      }
    });

    let res = await getCosSign({ type: 1 });
    let _this = this;

    let names = fileObject.name.split('\\');
    if (!names || names.length === 0 || !/[a-z]+_v\d+\.\d+\.\d+\.apk/.test(names[names.length - 1]) || names[names.length - 1].indexOf(res.data.logo) !== 0) {
      _this.setState({
        loading: false,
      });
      //file.reset();
      _this.actionRef.current.reload();
      return message.error('文件名不符合规范');
    }

    cos.putObject({
      Bucket: res.data.bucket, /* 填入您自己的存储桶，必须字段 */
      Region: res.data.region,  /* 存储桶所在地域，例如ap-beijing，必须字段 */
      Key: 'apk/' + names[names.length - 1],  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
      Body: fileObject, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
      onProgress: function (progressData) {
        let progress = JSON.stringify(progressData);
        if (progress.percent == 1) {
          //message.success('上传成功');
          _this.setState({
            loading: true,
          });
        }
      }
    }, async function (err, data) {
      _this.setState({
        loading: false,
      });
      console.log(err || data);
      if (data.statusCode == 200) {
        await addApk({ value: data.Location });
        //file.reset();
        _this.actionRef.current.reload();
        message.success('成功');
      }
    });
  }

  render() {
    let _this = this;
    return (
      <PageContainer>
        <ProTable
          //headerTitle={'查询表格'}
          actionRef={this.actionRef}
          rowKey="id"
          search={false}
          toolBarRender={() => [
            <div key="uni">
              <input key="file" onChange={async (v) => {
                await _this.upload(document.getElementById('file').files[0], document.getElementById('file'));
              }} id={'file'} hidden type={'file'} />
              <Button loading={this.state.loading} key="btn" type="primary" onClick={() => {
                document.getElementById('file').click();
              }}>
                <UploadOutlined />
                上传Apk
              </Button>
            </div>,
          ]}
          request={this.getData}
          columns={[...columns]}
        />
      </PageContainer>
    );
  }
}
