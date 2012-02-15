VersaFile::Application.routes.draw do

  match '/avatars/zone_default' => 'avatars#zone_default'
  match '/avatars/user_default' => 'avatars#user_default'

  resources :packager, :constraints => { :id => /.*/ } do
    member do
      get 'download'
      get 'package'
      get 'unpack'
      get 'unpackage'
    end

  end

  resources :accounts, :constraints => { :id => /.*/ } do
    collection do
      post 'logon'
      post 'logoff'
      get 'get_token'
    end
    member do
      post 'reset_password'
    end
    resources :zone_nodes
  end

  resources :data_types, :only => [:index]
  resources :icons, :constraints => { :id => /.*/ }
  resources :operators, :only => [:index]
  resources :servers
  resources :zone_nodes do
    member do
      post 'update_current_usage'
      post 'deploy'
    end
  end

  resources :rko_users do
    collection do
      post 'logon'
      post 'logout'
      post 'logoff'
    end
  end

  #route for zone
  resources :zones, :constraints => { :id => /.*/ } do

    resources :users do
      member do
        get 'avatar'
      end
      collection do
        post 'reset'
      end
    end

    member do
      get 'avatar'
      post 'logoff'
      post 'logon'
      get 'welcome'
      post 'reset'
      get 'expired'
      get 'metrics'
    end
    collection do
      post 'usage'
      get 'exists'
    end

    resources :acls, :format => true
    resources :avatars
    resources :groups
    resources :libraries do
      resources :choice_lists

      resources :document_types do
        collection do
          get 'dtmetrics'
        end
        member do
          get 'dtmetrics'
        end
      end

      resources :cell_definitions
      resources :documents do
        member do
          get 'download'
          put 'checkin'
          put 'checkout'
          put 'cancel_checkout'
          put 'file'
          put 'restore'
          put 'unfile'
        end
        collection do
          post 'empty'
        end
      end
      resources :folders
      resources :property_definitions

      resources :view_definitions
    end

    resources :uploader do
      collection do
        get 'download'
        get 'preview'
        post 'clean'
        post 'upload'
        get 'upload'
      end
    end

    resources :roles



  end

  #match subdomain
  constraints(Subdomain) do
    match '/' => 'zone_nodes#bfree'
  end
  root :to => 'BfreeDocs#index'


=begin
  resources :uploader

  resources :document_types
  resources :operators

  resources :data_types, :only => [:index]

  resources :property_definitions



  resources :zone_nodes

  resources :zones, :constraints => { :id => /.*/ } do
    member do
      get 'welcome'
      get 'expired'
      post 'logon'
      post 'logoff'
      post 'alive'
      post 'upload', :to => 'uploader#upload'
    end
    resources :acls, :constraints => { :id => /\d/ }

    resources :avatars
    resources :users do
      member do
        get 'avatar'
      end
    end
    resources :groups
    resources :libraries do

      resources :property_mappings
      resources :property_definitions do
        collection do
          get 'generate_columns'
        end
      end

      resources :choice_lists
      resources :document_types
      resources :folders

      resources :documents do
        collection do
          get 'simple_search'
        end
      end

      resources :property_definitions
      resources :document_types
      resources :view_definitions

    end


  end

=end

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
