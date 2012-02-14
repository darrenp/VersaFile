require 'test_helper'

class AclsControllerTest < ActionController::TestCase
  setup do
    @acl = acls(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:acls)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create acl" do
    assert_difference('Acl.count') do
      post :create, acl: @acl.attributes
    end

    assert_redirected_to acl_path(assigns(:acl))
  end

  test "should show acl" do
    get :show, id: @acl.to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @acl.to_param
    assert_response :success
  end

  test "should update acl" do
    put :update, id: @acl.to_param, acl: @acl.attributes
    assert_redirected_to acl_path(assigns(:acl))
  end

  test "should destroy acl" do
    assert_difference('Acl.count', -1) do
      delete :destroy, id: @acl.to_param
    end

    assert_redirected_to acls_path
  end
end
