import {
  DrawerForm,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form } from 'antd';
import React from 'react';

export type UpdateFormProps = {
  onSubmit: (values: any) => Promise<void>;
  values: any;
  btn: any,
};
const UpdateForm: React.FC<UpdateFormProps> = (props: any) => {
  const [form] = Form.useForm();
  return (
    <DrawerForm
      title={props.values ? '编辑' : '添加'}
      form={form}
      preserve={false}
      trigger={
        props.btn
      }
      layout={'horizontal'}
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      onFinish={async (data) => {
        data.id = props.values?.id || 0;
        return props.onSubmit(data);
      }}
      width={"450px"}
    >
      <ProFormTextArea
        name="desc"
        labelCol={{ span: 4 }}
        label="话术内容"
        initialValue={props.values?.desc || ''}
        extra={
          <div>
            <span>让人一看就懂，机器却看不懂</span><a target={'_blank'} href='https://docs.qq.com/doc/DTkpJVmZ3WUtDYlJW'>【点击查看方法】</a>
            <p>多条话术使用空行隔开即可！</p>
          </div>
        }
        fieldProps={{
          rows: 12,
        }}
      />
      <ProFormSelect
        name={'level'}
        labelCol={{ span: 4 }}
        initialValue={props.values?.level}
        extra={<div><span>混淆之后，一句话可以生成多个变种，绕过风控系统检测</span></div>}
        label="混淆等级"
        options={[
          { label: '不使用', value: 0 },
          { label: '推荐', value: 1 },
          { label: '高级', value: 2 },
          { label: 'VIP[联系管理员开通]', disabled: true, value: 3 },
        ]} />
    </DrawerForm>
  );
};
export default UpdateForm;
