MQTT_HOST = $1

build:
	cd front/nenga && \
	npm install && \
	npm run build && \
	cd ../../ && \
	docker build -t mqtt_nenga_backend -f app.Dockerfile .

run:
	docker run --rm -it -p 8000:8000 -e MQTT_HOST=${MQTT_HOST} --name mqtt_nenga_backend mqtt_nenga_backend

build-broker:
	docker build -t mqtt_broker -f mosquitto.Dockerfile .

run-broker:
	docker run -d --rm -p 1883:1883 -p 8080:8080 --name mqtt_broker mqtt_broker

build-subscriber:
	pip install -r requirements-min.txt

run-subscriber:
	cd backend/src && python sub.py ${MQTT_HOST}