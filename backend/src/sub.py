import paho.mqtt.client as paho
import sys
import os
import logging
import time
from PIL import Image
libdir = os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), 'lib')
if os.path.exists(libdir):
    sys.path.append(libdir)
from waveshare_epd import epd2in7

MQTT_HOST = sys.argv[1]
MQTT_TOPIC = "topic/test"

logging.basicConfig(level=logging.DEBUG)


def on_connect(mqttc, obj, rc):
    mqttc.subscribe("$SYS/#", 0)
    logging.info(f"rc: {rc}")


def on_message(mqttc, obj, msg):
    logging.info(f"{msg.topic} {msg.qos}")
    with open("output.jpg", "wb") as outfile:
        outfile.write(msg.payload)
    draw_image()


def on_publish(mqttc, obj, mid):
    logging.info(f"mid: {mid}")


def on_subscribe(mqttc, obj, mid, granted_qos):
    logging.info(f"Subscribed: {mid} {granted_qos}")


def draw_image():
    try:
        logging.info("Draw Image")
        epd = epd2in7.EPD()

        logging.info("init and Clear")
        epd.init()
        epd.Clear(0xFF)
        logging.info("Drawing on the Horizontal image")
        sub_image = Image.new("1", (epd.height, epd.width), 255)
        png = Image.open("output.jpg")
        sub_image.paste(png, (0, 0))
        epd.display(epd.getbuffer(sub_image))
        time.sleep(5)

        logging.info("Clear...")
        epd.Clear(0xFF)
        logging.info("Goto Sleep...")
        epd.sleep()
        time.sleep(3)

        # epd.Dev_exit()

    except IOError as e:
        logging.info(e)

    except KeyboardInterrupt:
        logging.info("ctrl + c:")
        epd2in7.epdconfig.module_exit()
        exit()


if __name__ == "__main__":
    mqtt_client = paho.Client()
    mqtt_client.on_message = on_message
    mqtt_client.on_subscribe = on_subscribe

    mqtt_client.connect(MQTT_HOST, 1883, 60)
    mqtt_client.subscribe(MQTT_TOPIC, 0)

    mqtt_client.loop_forever()
