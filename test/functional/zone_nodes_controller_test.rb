require 'test_helper'

class ZoneNodesControllerTest < ActionController::TestCase
  setup do
    @zone_node = zone_nodes(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:zone_nodes)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create zone_node" do
    assert_difference('ZoneNode.count') do
      post :create, zone_node: @zone_node.attributes
    end

    assert_redirected_to zone_node_path(assigns(:zone_node))
  end

  test "should show zone_node" do
    get :show, id: @zone_node.to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @zone_node.to_param
    assert_response :success
  end

  test "should update zone_node" do
    put :update, id: @zone_node.to_param, zone_node: @zone_node.attributes
    assert_redirected_to zone_node_path(assigns(:zone_node))
  end

  test "should destroy zone_node" do
    assert_difference('ZoneNode.count', -1) do
      delete :destroy, id: @zone_node.to_param
    end

    assert_redirected_to zone_nodes_path
  end
end
