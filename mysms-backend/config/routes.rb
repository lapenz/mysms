Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  # Devise routes for authentication
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }

  # Custom auth routes
  post 'auth/register', to: 'auth#register'
  get 'auth/me', to: 'auth#me'

  # Message routes (require authentication)
  resources :messages, only: [:index, :create]
  post 'messages/webhook', to: 'messages#webhook'
end
