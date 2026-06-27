provider "google" {
  project = "project-849bbb76-ad72-4c26-bb8"
  region  = "us-central1"
}

# 1. Vertex AI API Enablement
resource "google_project_service" "vertex_ai_apis" {
  service = "aiplatform.googleapis.com"
  disable_on_destroy = false
}

# 2. API Gateway (Cloud Run)
resource "google_cloud_run_v2_service" "api_gateway" {
  name     = "api-gateway"
  location = "us-central1"

  template {
    containers {
      image = "us-docker.pkg.dev/cloudrun/container/hello"
      ports {
        container_port = 8080
      }
      env {
        name  = "MCP_SERVER_URL"
        value = google_cloud_run_v2_service.mcp_server.uri
      }
      env {
        name  = "MONGODB_URI"
        value = var.mongodb_uri
      }
    }
  }
}

resource "google_cloud_run_service_iam_binding" "api_gateway_public" {
  location = google_cloud_run_v2_service.api_gateway.location
  service  = google_cloud_run_v2_service.api_gateway.name
  role     = "roles/run.invoker"
  members  = ["allUsers"]
}

# 3. MCP Server (Cloud Run)
resource "google_cloud_run_v2_service" "mcp_server" {
  name     = "mcp-server"
  location = "us-central1"

  template {
    containers {
      image = "us-docker.pkg.dev/cloudrun/container/hello"
      ports {
        container_port = 8080
      }
      env {
        name  = "MONGODB_URI"
        value = var.mongodb_uri
      }
      env {
        name  = "MODEL_ARMOR_TEMPLATE"
        value = "projects/project-849bbb76-ad72-4c26-bb8/locations/us-central1/templates/model-armor-template"
      }
    }
  }

  depends_on = [google_project_service.vertex_ai_apis]
}

# 4. MongoDB Database Variable
# We pass the MongoDB Atlas Connection String here since MongoDB isn't native to GCP Terraform like Firestore.
variable "mongodb_uri" {
  description = "MongoDB Connection String"
  type        = string
  sensitive   = true
}

# 5. Compute Engine Instance and Template
resource "google_compute_instance_template" "gce_instance_template" {
  name_prefix  = "gce-instance-template"
  machine_type = "e2-medium"
  region       = "us-central1"

  disk {
    source_image = "debian-cloud/debian-11"
    auto_delete  = true
    boot         = true
  }

  network_interface {
    network = "default"
  }
}

resource "google_compute_instance" "gce_vm" {
  name         = "gce-vm"
  machine_type = "e2-medium"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    network = "default"
  }
}

# 6. Model Armor Template
resource "google_compute_security_policy" "model_armor_template" {
  name        = "model-armor-template"
  description = "Model Armor Security Template"
}

# 7. Vertex AI Agent Engines (Conceptual representation)
resource "google_vertex_ai_featurestore" "architect_agent" {
  name   = "architect_agent_config"
  region = "us-central1"
}

resource "google_vertex_ai_featurestore" "ceo_agent" {
  name   = "ceo_agent_config"
  region = "us-central1"
}

resource "google_vertex_ai_featurestore" "cto_agent" {
  name   = "cto_agent_config"
  region = "us-central1"
}

resource "google_vertex_ai_featurestore" "marketing_agent" {
  name   = "marketing_agent_config"
  region = "us-central1"
}

resource "google_vertex_ai_featurestore" "finance_agent" {
  name   = "finance_agent_config"
  region = "us-central1"
}
