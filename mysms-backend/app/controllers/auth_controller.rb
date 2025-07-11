class AuthController < ApplicationController
  skip_before_action :authenticate_user!, only: [:register]

  # POST /auth/register
  def register
    user = User.new(user_params)
    
    if user.save
      render json: { 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          phone_number: user.phone_number 
        }, 
        message: 'User registered successfully' 
      }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /auth/me
  def me
    render json: { 
      user: { 
        id: current_user.id, 
        email: current_user.email, 
        name: current_user.name, 
        phone_number: current_user.phone_number 
      } 
    }
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :name, :phone_number)
  end
end 