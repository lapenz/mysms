class Users::SessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        status: { code: 200, message: 'Logged in successfully.' },
        data: {
          user: {
            id: resource.id,
            email: resource.email,
            name: resource.name,
            phone_number: resource.phone_number
          }
        },
        token: request.env['warden-jwt_auth.token']
      }
    else
      render json: {
        status: { message: "Invalid email or password." }
      }, status: :unauthorized
    end
  end

  def respond_to_on_destroy
    if current_user
      render json: {
        status: 200,
        message: "Logged out successfully."
      }
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }
    end
  end
end 