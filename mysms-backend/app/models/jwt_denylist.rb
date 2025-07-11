class JwtDenylist
  include Mongoid::Document
  include Devise::JWT::RevocationStrategies::Denylist

  field :jti, type: String
  field :exp, type: DateTime

  index({ jti: 1 })
  index({ exp: 1 })
end 