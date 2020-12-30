FROM ubuntu:18.04

RUN apt-get update
RUN apt-get install -y mosquitto mosquitto-clients

COPY ./conf/mosquitto.conf /etc/mosquitto/mosquitto.conf

# MQTT Port
EXPOSE 1883

# WebSocket Port
EXPOSE 8080

CMD ["mosquitto", "-c", "/etc/mosquitto/mosquitto.conf"]