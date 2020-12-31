resource "aws_eks_node_group" "node_mqtt_nenga" {
  cluster_name    = aws_eks_cluster.aws_eks_mqtt_nenga.name
  node_group_name = "node_mqtt_nenga"
  node_role_arn   = aws_iam_role.eks_nodes_mqtt_nenga.arn
  subnet_ids      = var.subnet_ids

  scaling_config {
    desired_size = 1
    max_size     = 1
    min_size     = 1
  }

  depends_on = [
    aws_iam_role_policy_attachment.AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.AmazonEC2ContainerRegistryReadOnly,
  ]
}
