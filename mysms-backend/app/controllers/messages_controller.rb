class MessagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:webhook]

  # GET /messages
  def index
    if params[:after].present?
      # Fetch only messages created after the specified timestamp
      after_time = Time.parse(params[:after])
      messages = current_user.messages.where(:created_at.gt => after_time).order_by(created_at: :asc)
    else
      # Fetch all messages (for initial load)
      messages = current_user.messages.order_by(created_at: :asc)
    end
    
    render json: messages
  end

  # POST /messages
  def create
    message_params = params.require(:message).permit(:body, :to)
    from_number = ENV['TWILIO_PHONE_NUMBER']

    # Send SMS via Twilio
    begin
      client = Twilio::REST::Client.new(ENV['TWILIO_ACCOUNT_SID'], ENV['TWILIO_AUTH_TOKEN'])
      twilio_message = client.messages.create(
        from: from_number,
        to: message_params[:to],
        body: message_params[:body]
      )
    rescue => e
      Rails.logger.error("Twilio error: #{e.message}")
      render json: { error: 'Failed to send SMS', details: e.message }, status: :unprocessable_entity and return
    end

    # Save message to DB
    message = current_user.messages.build(
      body: message_params[:body],
      to: message_params[:to],
      from: from_number,
      direction: 'outbound'
    )

    if message.save
      render json: message, status: :created
    else
      Rails.logger.error("DB save error: #{message.errors.full_messages.join(', ')}")
      render json: { error: 'Failed to save message', details: message.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # POST /messages/webhook - Twilio webhook for incoming messages
  def webhook
    Rails.logger.info "Webhook received: #{params.inspect}"
    
    # Find user by phone number (the recipient of the incoming message)
    user = User.find_by(phone_number: params[:To])
    
    if user
      # Save incoming message to DB
      message = user.messages.build(
        body: params[:Body],
        to: params[:To],
        from: params[:From],
        direction: 'inbound'
      )

      if message.save
        Rails.logger.info "Incoming message saved for user #{user.id}: #{message.id}"
        render json: { success: true }, status: :ok
      else
        Rails.logger.error "Failed to save incoming message: #{message.errors.full_messages}"
        render json: { error: 'Failed to save message' }, status: :unprocessable_entity
      end
    else
      Rails.logger.warn "No user found for phone number: #{params[:To]}"
      render json: { error: 'User not found' }, status: :not_found
    end
  end

end
