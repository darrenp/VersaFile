require 'test_helper'

class ViewMappingsControllerTest < ActionController::TestCase
  setup do
    @view_mapping = view_mappings(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:view_mappings)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create view_mapping" do
    assert_difference('ViewMapping.count') do
      post :create, view_mapping: @view_mapping.attributes
    end

    assert_redirected_to view_mapping_path(assigns(:view_mapping))
  end

  test "should show view_mapping" do
    get :show, id: @view_mapping.to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @view_mapping.to_param
    assert_response :success
  end

  test "should update view_mapping" do
    put :update, id: @view_mapping.to_param, view_mapping: @view_mapping.attributes
    assert_redirected_to view_mapping_path(assigns(:view_mapping))
  end

  test "should destroy view_mapping" do
    assert_difference('ViewMapping.count', -1) do
      delete :destroy, id: @view_mapping.to_param
    end

    assert_redirected_to view_mappings_path
  end
end
