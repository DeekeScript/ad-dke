import {
  DrawerForm,
  ProFormDigitRange,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form } from 'antd';
import React from 'react';

export type UpdateFormProps = {
  onSubmit: (values: any) => Promise<void>;
  values: any;
  btn: any,
};
const UserRuleUpdateForm: React.FC<UpdateFormProps> = (props: any) => {
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
      width={"600px"}
    >
      <ProFormText name="name" rules={[
        { required: true, message: '名称不能为空' },
      ]} labelCol={{ span: 5 }} label="名称" initialValue={props.values?.name || ''} />
      <ProFormSelect label={'性别'} options={[
        { label: '男', value: 1 },
        { label: '女', value: 2 },
        { label: '未知', value: 3 },
      ]}
        mode='multiple'
        name={'gender'}
        rules={[
          { required: true, message: '性别不能为空' },
        ]}
        initialValue={props.values?.gender && JSON.parse(props.values?.gender)}
        labelCol={{ span: 5 }}
      />
      <ProFormDigitRange
        label="年龄区间"
        name="age_range"
        labelCol={{ span: 5 }}
        separator="-"
        separatorWidth={60}
        initialValue={[props.values?.min_age, props.values?.max_age]}
        extra={'不填或者都填0表示不限制'}
      />

      <ProFormSelect
        mode='multiple'
        name="province_id"
        initialValue={props.values?.province_id ? JSON.parse(props.values?.province_id) : undefined}
        labelCol={{ span: 5 }}
        label="IP限制"
        rules={[
          { required: true, message: ' IP限制不能为空' }
        ]}
        request={async () => {
          let res = await props.getProvince();
          if (res.success) {
            let r = res.data.map((item) => {
              return { label: item.name, value: item.id };
            });
            r.unshift({ label: '不限制', value: 0 });
            return r;
          }
        }}
        extra={'如果用户的IP满足此要求，才会对此用户进行操作'}
      />

      <ProFormSelect label={'个人号'} options={[
        { label: '不限', value: 0 },
        { label: '是', value: 1 },
        { label: '否', value: 2 },
      ]}
        name={'is_person'}
        rules={[
          { required: true, message: '个人号不能为空' },
        ]}
        initialValue={props.values?.is_person}
        labelCol={{ span: 5 }}
      />

      <ProFormSelect label={'开通橱窗'} options={[
        { label: '不限', value: 0 },
        { label: '是', value: 1 },
        { label: '否', value: 2 },
      ]}
        name={'open_window'}
        rules={[
          { required: true, message: '开通橱窗不能为空' },
        ]}
        initialValue={props.values?.open_window}
        labelCol={{ span: 5 }}
      />

      <ProFormSelect label={'团购达人'} options={[
        { label: '不限', value: 0 },
        { label: '是', value: 1 },
        { label: '否', value: 2 },
      ]}
        name={'is_tuangou'}
        rules={[
          { required: true, message: '团购达人不能为空' },
        ]}
        initialValue={props.values?.is_tuangou}
        labelCol={{ span: 5 }}
      />

      <ProFormDigitRange
        label="获赞数区间"
        name="zan_range"
        labelCol={{ span: 5 }}
        separator="-"
        separatorWidth={60}
        initialValue={[props.values?.min_zan, props.values?.max_zan]}
        extra={'不填或者都填0表示不限制'}
      />
      <ProFormDigitRange
        label="关注数区间"
        name="focus_range"
        labelCol={{ span: 5 }}
        separator="-"
        separatorWidth={60}
        initialValue={[props.values?.min_focus, props.values?.max_focus]}
        extra={'不填或者都填0表示不限制'}
      />
      <ProFormDigitRange
        label="粉丝数区间"
        name="fans_range"
        labelCol={{ span: 5 }}
        separator="-"
        separatorWidth={60}
        initialValue={[props.values?.min_fans, props.values?.max_fans]}
        extra={'不填或者都填0表示不限制'}
      />
      <ProFormDigitRange
        label="作品数区间"
        name="works_range"
        labelCol={{ span: 5 }}
        separator="-"
        separatorWidth={60}
        initialValue={[props.values?.min_works, props.values?.max_works]}
        extra={'不填或者都填0表示不限制'}
      />
      <ProFormTextArea tooltip={'简介包含关键词'} label={'包含关键词'} labelCol={{ span: 5 }} initialValue={props.values?.contain || ''} name={'contain'} extra={<div>多个关键词使用中文逗号（，）或者英文逗号（,）隔开即可！<a target={'_blank'} href='https://docs.qq.com/doc/DTk9sQ1RMdnZsaU5P'>点击查看详细规则</a></div>} />
      <ProFormTextArea tooltip={'简介不包含关键词'} label={'不包含关键词'} labelCol={{ span: 5 }} initialValue={props.values?.no_contain || ''} name={'no_contain'} extra={<div>多个关键词使用中文逗号（，）或者英文逗号（,）隔开即可！<a target={'_blank'} href='https://docs.qq.com/doc/DTk9sQ1RMdnZsaU5P'>点击查看详细规则</a></div>} />
    </DrawerForm>
  );
};
export default UserRuleUpdateForm;
