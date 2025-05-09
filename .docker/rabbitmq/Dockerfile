FROM rabbitmq:4.1-management-alpine

RUN wget https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download/v4.1.0/rabbitmq_delayed_message_exchange-4.1.0.ez && \
    mv rabbitmq_delayed_message_exchange-4.1.0.ez /opt/rabbitmq/plugins/rabbitmq_delayed_message_exchange.ez

RUN rabbitmq-plugins enable rabbitmq_delayed_message_exchange