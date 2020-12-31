resource "aws_eks_cluster" "aws_eks_mqtt_nenga" {
  name     = "eks_cluster_mqtt_nenga"
  role_arn = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    subnet_ids = var.subnet_ids
  }

  tags = {
    Name = "EKS_mqtt_nenga"
  }
}
