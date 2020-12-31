terraform {
  backend "s3" {
    key = "terraform/mqtt-nenga.tfstate"
    region = "ap-northeast-1"
  }
}