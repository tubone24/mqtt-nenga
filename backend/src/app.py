import os
import base64
import logging
from io import BytesIO
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import paho.mqtt.client as paho

from PIL import Image, ImageDraw, ImageFont

MQTT_HOST = os.getenv("MQTT_HOST")
MQTT_TOPIC = os.getenv("MQTT_TOPIC", "topic/test")

logging.basicConfig(level=logging.DEBUG)

font_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), "font")

font24 = ImageFont.truetype(os.path.join(font_dir, "ipamp.ttf"), 24)
font18 = ImageFont.truetype(os.path.join(font_dir, "ipamp.ttf"), 18)
font35 = ImageFont.truetype(os.path.join(font_dir, "ipamp.ttf"), 35)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class Message(BaseModel):
    title: str
    message: str
    image: str
    name: str


def on_message(mqttc, obj, msg):
    print(msg.topic+" "+str(msg.qos)+" "+str(msg.payload))


def on_publish(mqttc, obj, mid):
    print("mid: "+str(mid))


@app.get("/")
def get_root():
    return {"status": "ok"}


@app.post("/preview")
def preview(message: Message):
    base64str = create_card_image_b64(message.title, message.message, message.image, message.name)
    return {"image": base64str}


@app.post("/send")
def send(message: Message):
    resp = send_card_image(message.title, message.message, message.image, message.name)
    return resp


def create_card_image(title, message, image, name):
    card_image = Image.new("1", (264, 176), 255)
    draw = ImageDraw.Draw(card_image)
    draw.text((30, 0), title, font=font24, fill=0)
    draw.text((10, 30), message, font=font18, fill=0)
    draw.text((170, 150), name, font=font18, fill=0)
    jpg = Image.open(BytesIO(base64.b64decode(remove_b64_header(image))))
    jpg2 = jpg.resize((100, 100))
    card_image.paste(jpg2, (40, 70))
    output = BytesIO()
    card_image.save(output, quality=100, format="JPEG")
    return output


def create_card_image_b64(title, message, image, name):
    output = create_card_image(title, message, image, name)
    image_jpg = output.getvalue()
    return {"image": add_b64_header(base64.b64encode(image_jpg).decode("utf-8"))}


def send_card_image(title, message, image, name):
    output = create_card_image(title, message, image, name)
    image_bytearray = bytearray(output.getvalue())
    mqtt_client = paho.Client()
    mqtt_client.on_message = on_message
    mqtt_client.on_publish = on_publish
    mqtt_client.connect(MQTT_HOST, 1883, 60)
    mqtt_client.publish(MQTT_TOPIC, image_bytearray, 0)
    return {"status": "ok"}


def remove_b64_header(image):
    return image.replace("data:image/jpeg;base64,", "")


def add_b64_header(image):
    return "data:image/jpeg;base64," + image

