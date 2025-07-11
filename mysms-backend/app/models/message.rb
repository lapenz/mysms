class Message
  include Mongoid::Document
  include Mongoid::Timestamps
  
  field :body, type: String
  field :to, type: String
  field :from, type: String
  field :direction, type: String, default: 'outbound' # 'outbound' or 'inbound'
  
  belongs_to :user
  
  validates :body, presence: true
  validates :to, presence: true
  validates :from, presence: true
  validates :direction, inclusion: { in: %w[outbound inbound] }
  
  index({ user_id: 1, created_at: -1 })
  index({ to: 1 })
  index({ from: 1 })
end
