✅ Steps to Enable Cloud Run to Access Secret Manager & GCS
1. Create a Service Account for Cloud Run

Name: timewatch-dashboard-storage

Email: timewatch-dashboard-storage@second-height-468706-s4.iam.gserviceaccount.com

2. Assign Required IAM Roles to the Service Account

Go to IAM → Roles and add:

Secret Manager Secret Accessor → to read secrets.

Storage Admin → to manage storage buckets.

Storage Object Admin → to read/write objects in the bucket.

3. Create a Secret in Secret Manager

Secret name: storage-account-key

Store your GCS credentials JSON inside it.

4. Update Your .env (Cloud Run environment variables)
PORT=3001
MONGO_URI=...
JWT_SECRET=supersecretkey123
GCP_PROJECT=second-height-468706-s4
GCP_BUCKET=timewatch-dashbord-bucket
STORAGE_ACCOUNT_KEY=storage-account-key.json
NODE_ENV=production
GCS_KEY_SECRET=projects/second-height-468706-s4/secrets/storage-account-key/versions/latest

5. Update Your Cloud Run Service to Use the New Service Account

Run this command:

gcloud run services update timewatch-dashboard-bk \
  --service-account timewatch-dashboard-storage@second-height-468706-s4.iam.gserviceaccount.com \
  --project second-height-468706-s4 \
  --region europe-west1

6. Verify the Update Worked

Check the service description:

gcloud run services describe timewatch-dashboard-bk \
  --project second-height-468706-s4 \
  --region europe-west1 \
  --format "value(spec.template.spec.serviceAccountName)"


👉 It should output:

timewatch-dashboard-storage@second-height-468706-s4.iam.gserviceaccount.com

7. Deploy & Test

Now your Cloud Run app runs with the correct service account, has permissions, and can:

Access Secret Manager → fetch credentials securely.

Use Google Cloud Storage → upload/read objects from your bucket.

⚡ Summary:
The root cause was that Cloud Run was still running with the default compute service account, which had no Secret Manager access. You fixed it by creating a custom service account, giving it roles, and updating the Cloud Run service to use it.