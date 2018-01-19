import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Layout, Form, Input, Button, Table, Modal, Radio, Divider, Select, Popconfirm, Row, Col } from 'antd';

import DisplayTree from '../../../components/DisplayTree';
import styles from './index.less';
import { getUrlParam } from '../../../utils/utils';

const FormItem = Form.Item;

const { Sider, Content } = Layout;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const { Option } = Select;


@connect(state => ({
  selectedKeys: state.menu.selectedKeys,
  treeList: state.menu.treeList,
  menuList: state.menu.menuList,
  pagination: state.menu.pagination,
  menuListLoading: state.menu.loading,
  currentNode: state.menu.currentNode,
  navData: state.global.menu,
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
    const { dispatch, selectedKeys, pagination } = this.props;
    dispatch({
      type: 'menu/fetchTree',
    });
    dispatch({
      type: 'menu/fetchMenuList',
      payload: {
        ParentID: selectedKeys[0],
        PageSize: pagination.pageSize,
        CurrentPage: pagination.current,
      },
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

    dispatch({
      type: 'menu/fetchMenuList',
      payload: {
        ParentID: selectedKeys[0],
      },
    });
  }

  // 设置模态框显示/隐藏
  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
  }

  // 获取对应路径下的 menuid
  getCurrentSelectedMenuId = (pathArr, navData) => {
    for (let i = 0; i < navData.length; i++) {
      if (pathArr[0] === navData[i].path) {
        if (pathArr.length === 1 || !navData[i].children) {
          return navData[i].id;
        } else {
          return this.getCurrentSelectedMenuId(pathArr.slice(1), navData[i].children);
        }
      }
    }
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
  handleEdit = (record) => {
    const { dispatch, location } = this.props;
    console.log(record);

    const MenuID = getUrlParam(location, 'menuID');

    dispatch({
      type: 'menu/fetchMenuDetail',
      payload: {
        ...record,
        MenuID,
      },
    });
    this.setModalVisible(true);
  }
  // 删除
  handleDelete = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/deleteMenu',
      payload: {
        ...record,
      },
    });
  }

  // 表单提交
  handleSubmit = (e) => {
    const { form, dispatch, selectedKeys, location, currentNode } = this.props;

    const MenuID = getUrlParam(location, 'menuID');

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('values', values);
        const payload = {
          ...values,
          MenuID,
          ParentID: selectedKeys[0],
        };
        if (currentNode.UniqueID && currentNode.UniqueID.value) {
          payload.UniqueID = currentNode.UniqueID.value;
        }
        dispatch({
          type: 'menu/commitMenu',
          payload,
        }).then((s) => {
          console.log('s', s);
        });
        this.setModalVisible(false);
      }
    });
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log('pagination', pagination);
    console.log('filters', filters);
    console.log('sorter', sorter);
  }

  render() {
    const { selectedKeys, treeList, menuList, pagination, menuListLoading } = this.props;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
      },
    };

    const columns = [{
      title: '名称',
      dataIndex: 'Name',
      key: 'Name',
    }, {
      title: '路径',
      dataIndex: 'Path',
      key: 'Path',
    }, {
      title: '排序',
      dataIndex: 'SortCode',
      key: 'SortCode',
    }, {
      title: '操作',
      key: 'Action',
      width: 120,
      render: (text, record) => (
        <span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this.handleEdit(record);
            }}
          >编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm placement="bottom" title="如果有子节点会一同删除，确认要删除这条记录吗？" onConfirm={() => { this.handleDelete(record); }} okText="Yes" cancelText="No">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >删除
            </a>
          </Popconfirm>

        </span>
      ),
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
                <Row gutter={24} >
                  <Col span={12}>
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
                  </Col>
                  <Col span={12}>
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
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="排序代码"
                    >
                      {getFieldDecorator('SortCode', {
                        rules: [{
                          required: true, message: '请输入数字格式排序代码', pattern: /^[0-9]*$/,
                        }],
                      })(
                        <Input />,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="图标"
                    >
                      {getFieldDecorator('IconName')(
                        <Input />,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="类型"
                    >
                      {getFieldDecorator('Category', {
                        rules: [{
                          required: true, message: '请选择类型',
                        }],
                      })(
                        <Select>
                          <Option value={1}>目录</Option>
                          <Option value={2}>栏目</Option>
                          <Option value={3}>代码</Option>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="描述"
                    >
                      {getFieldDecorator('Description')(
                        <TextArea autosize />,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      {...formItemLayout}
                      label="是否显示"
                    >
                      {getFieldDecorator('IsDisplayed', {
                        rules: [{
                          required: true, message: '请选择是否显示',
                        }],
                      })(
                        <RadioGroup>
                          <Radio value={1}>是</Radio>
                          <Radio value={0}>否</Radio>
                        </RadioGroup>,
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Modal>
          </div>
          <Table
            bordered
            loading={menuListLoading}
            pagination={pagination}
            dataSource={menuList}
            columns={columns}
            rowKey="UniqueID"
            onChange={this.handleTableChange}
          />
        </Content>
      </Layout>
    );
  }
}
