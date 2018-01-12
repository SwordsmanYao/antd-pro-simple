import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Layout, Form, Input, Button, Table, Modal, Radio } from 'antd';
import { Select } from 'antd';

import DisplayTree from '../../../components/DisplayTree';
import styles from './index.less';

const FormItem = Form.Item;

const { Sider, Content } = Layout;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;


@connect(state => ({
  selectedKeys: state.menu.selectedKeys,
  treeList: state.menu.treeList,
  currentNode: state.menu.currentNode,
}))
@Form.create({
  onFieldsChange(props, changedFields) {
    console.log('onFieldsChange', changedFields);
    props.dispatch({
      type: 'menu/saveNode',
      payload: changedFields,
    });
  },
  mapPropsToFields(props) {
    // console.log('mapPropsToFields', props.currentNode);
    return {
      Name: Form.createFormField({
        ...props.currentNode.Name,
      }),
      Path: Form.createFormField({
        ...props.currentNode.Path,
      }),
      SortCode: Form.createFormField({
        ...props.currentNode.SortCode,
      }),
      IconName: Form.createFormField({
        ...props.currentNode.IconName,
      }),
      Category: Form.createFormField({
        ...props.currentNode.Category,
      }),
      Description: Form.createFormField({
        ...props.currentNode.Description,
      }),
      IsDisplayed: Form.createFormField({
        ...props.currentNode.IsDisplayed,
      }),
    };
  },
  onValuesChange(_, values) {
    console.log(values);
  },
})
export default class Menu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false, // 新建的模态框是否显示
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/fetchTree',
    });
    dispatch({
      type: 'menu/fetchMenuList',
    });
  }

  // 点击树节点时触发
  onSelect = (selectedKeys) => {
    console.log('selected', selectedKeys);
    const { dispatch } = this.props;
    console.log(dispatch);
    dispatch({
      type: 'menu/saveSelectedKeys',
      payload: selectedKeys,
    });
  }

  // 设置模态框显示/隐藏
  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
  }

  // 新建
  handleNew = () => {
    this.setModalVisible(true);
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/clearCurrentNode',
    });
  }
  // 修改
  handleEdit = () => {
    this.setModalVisible(true);
    // fetch detail
  }

  // 表单提交
  handleSubmit = (e) => {
    const { form, dispatch, selectedKeys } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('values', values);
        dispatch({
          type: 'menu/commitMenu',
          payload: {
            ...values,
            MenuID: 8,
            ParentID: selectedKeys[0],
          },
        }).then((s) => {
          console.log('s', s);
        });
        this.setModalVisible(false);
      }
    });
  }

  render() {
    const { selectedKeys, treeList } = this.props;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 8 },
      },
    };

    const dataSource = [{
      UniqueID: '1',
      Name: '测试',
      Path: 'test',
      IconName: 'ttest',
      Description: '234234234',
    }, {
      UniqueID: '2',
      Name: '测试',
      Path: 'test',
      IconName: 'ttest',
      Description: '234234234',
    }];

    const columns = [{
      title: '名称',
      dataIndex: 'Name',
      key: 'Name',
    }, {
      title: '路径',
      dataIndex: 'Path',
      key: 'Path',
    }, {
      title: '图标',
      dataIndex: 'IconName',
      key: 'IconName',
    }, {
      title: '描述',
      dataIndex: 'Description',
      key: 'Description',
    }];

    return (
      <Layout className={styles.layout}>
        <Sider width={250} style={{ background: '#fff' }}>
          {
            treeList && treeList.length > 0 &&
              <DisplayTree
                treeList={[{
                  id: '0',
                  name: '菜单管理',
                  children: treeList,
                }]}
                expandedKeys={selectedKeys}
                onSelect={this.onSelect}
                selectedKeys={selectedKeys}
              />
          }
        </Sider>
        <Content style={{ background: '#fff', marginLeft: 10, padding: 30 }}>
          <div className={styles.toolbar}>
            <Button onClick={this.handleNew}>新建</Button>
            <Modal
              title="菜单"
              visible={this.state.modalVisible}
              onOk={this.handleSubmit}
              onCancel={() => this.setModalVisible(false)}
            >
              <Form>
                <FormItem
                  {...formItemLayout}
                  label="名称"
                >
                  {getFieldDecorator('Name', {
                    rules: [{
                      required: true, message: '请输入名称',
                    }],
                  })(
                    <Input />,
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="路径"
                >
                  {getFieldDecorator('Path', {
                    rules: [{
                      required: true, message: '请输入路径',
                    }],
                  })(
                    <Input />,
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="排序代码"
                >
                  {getFieldDecorator('SortCode', {
                    rules: [{
                      required: true, message: '请输入排序代码',
                    }],
                  })(
                    <Input />,
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="图标"
                >
                  {getFieldDecorator('IconName')(
                    <Input />,
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="类型"
                >
                  {getFieldDecorator('Category')(
                    <Select>
                      <Option value="1">目录</Option>
                      <Option value="2">栏目</Option>
                      <Option value="3">代码</Option>
                    </Select>,
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="描述"
                >
                  {getFieldDecorator('Description')(
                    <TextArea autosize />,
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="是否显示"
                >
                  {getFieldDecorator('IsDisplayed')(
                    <RadioGroup>
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                    </RadioGroup>,
                  )}
                </FormItem>
              </Form>
            </Modal>
          </div>
          <Table
            bordered
            loading={false}
            pagination={{ current: 6, pageSize: 5, total: 50 }}
            dataSource={dataSource}
            columns={columns}
            rowKey="UniqueID"
          />
        </Content>
      </Layout>
    );
  }
}
