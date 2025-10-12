# AWS Free Tier Deployment Guide for Mian Taste Restaurant System

This guide will walk you through deploying your restaurant management system to AWS completely free.

## Architecture Overview
- **Frontend**: React app hosted on AWS S3 (Static Website)
- **Backend**: Node.js/Express API on AWS Elastic Beanstalk (Free tier)
- **Database**: MongoDB Atlas (Already configured)

---

## Prerequisites
1. AWS Account (Free tier eligible)
2. AWS CLI installed: `pip install awscli`
3. EB CLI installed: `pip install awsebcli`
4. Node.js and npm installed

---

## Part 1: Deploy Backend to Elastic Beanstalk

### Step 1: Install EB CLI
```bash
pip install awsebcli --upgrade
```

### Step 2: Configure AWS Credentials
```bash
aws configure
```
Enter your:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (e.g., `us-east-1`)
- Output format: `json`

### Step 3: Initialize Elastic Beanstalk
```bash
cd backend
eb init
```

Answer the prompts:
- **Region**: Choose `us-east-1` (or closest to you)
- **Application name**: `mian-taste-backend`
- **Platform**: Node.js
- **Platform version**: Select the latest Node.js version
- **SSH**: Yes (for debugging if needed)

### Step 4: Create Environment (Free Tier)
```bash
eb create mian-taste-prod --single --instance-type t2.micro
```

**Important**:
- `--single` creates a single-instance environment (free tier)
- `--instance-type t2.micro` uses free tier eligible instance

### Step 5: Set Environment Variables
```bash
eb setenv \
  PORT=8081 \
  NODE_ENV=production \
  MONGODB_URI="mongodb+srv://isurusajan9:wgmBBk9dhNAaD9co@restaurant-data.phxkm49.mongodb.net/chef-dashboard?retryWrites=true&w=majority&appName=restaurant-data" \
  CUSTOMER_MONGO_URI="mongodb+srv://isurusajan9:wgmBBk9dhNAaD9co@restaurant-data.phxkm49.mongodb.net/customer-dashboard?retryWrites=true&w=majority&appName=restaurant-data" \
  ADMIN_MONGO_URI="mongodb+srv://isurusajan9:wgmBBk9dhNAaD9co@restaurant-data.phxkm49.mongodb.net/Admin-dashboard?retryWrites=true&w=majority&appName=restaurant-data" \
  JWT_SECRET="03d92d45088d8d4b2f3892c6e179bc761679736797fbc6e047c2589d475e9a33797c502ed800c701a94e8eee0eefc71ce461958263ed9cd2c4380a4f563d9da1" \
  JWT_EXPIRE="8h" \
  GMAIL_USER="miantaste595@gmail.com" \
  GMAIL_APP_PASSWORD="kfqe yljx rowx pncw"
```

### Step 6: Deploy Backend
```bash
eb deploy
```

### Step 7: Get Your Backend URL
```bash
eb status
```
Copy the **CNAME** URL (e.g., `mian-taste-prod.us-east-1.elasticbeanstalk.com`)

### Step 8: Update Frontend URL in Backend
```bash
eb setenv FRONTEND_URL="http://mian-taste-frontend.s3-website-us-east-1.amazonaws.com"
```
(You'll update this after creating the S3 bucket)

---

## Part 2: Deploy Frontend to S3

### Step 1: Update Frontend API URL
Edit `restaurant-frontend/.env.production`:
```
REACT_APP_API_URL=http://your-backend-url.elasticbeanstalk.com
```
Replace with your actual EB URL from Part 1, Step 7.

### Step 2: Build Frontend
```bash
cd restaurant-frontend
npm install
npm run build
```

### Step 3: Create S3 Bucket
```bash
aws s3 mb s3://mian-taste-frontend --region us-east-1
```

**Note**: Bucket names must be globally unique. If taken, try:
- `mian-taste-restaurant-app`
- `miantaste-frontend-2024`
- Add your initials, etc.

### Step 4: Enable Static Website Hosting
```bash
aws s3 website s3://mian-taste-frontend --index-document index.html --error-document index.html
```

### Step 5: Make Bucket Public
Create a file `bucket-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::mian-taste-frontend/*"
    }
  ]
}
```

Apply the policy:
```bash
aws s3api put-bucket-policy --bucket mian-taste-frontend --policy file://bucket-policy.json
```

### Step 6: Disable Block Public Access
```bash
aws s3api put-public-access-block --bucket mian-taste-frontend --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

### Step 7: Upload Build Files
```bash
aws s3 sync build/ s3://mian-taste-frontend --delete
```

### Step 8: Get Your Frontend URL
Your website will be available at:
```
http://mian-taste-frontend.s3-website-us-east-1.amazonaws.com
```

### Step 9: Update Backend CORS Settings
Update the `FRONTEND_URL` in your backend:
```bash
cd ../backend
eb setenv FRONTEND_URL="http://mian-taste-frontend.s3-website-us-east-1.amazonaws.com"
```

---

## Part 3: Verification & Testing

### Test Backend
```bash
curl http://your-backend-url.elasticbeanstalk.com/api/auth/health
```

### Test Frontend
Open your browser:
```
http://mian-taste-frontend.s3-website-us-east-1.amazonaws.com
```

---

## Part 4: Useful Commands

### Elastic Beanstalk Commands
```bash
eb status              # Check environment status
eb health              # Check health of instances
eb logs                # View application logs
eb open                # Open environment in browser
eb deploy              # Deploy new version
eb setenv KEY=VALUE    # Set environment variable
eb terminate           # Delete environment (WARNING: Destructive)
```

### S3 Commands
```bash
# Upload updated build
aws s3 sync build/ s3://mian-taste-frontend --delete

# Clear cache (if using CloudFront later)
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

## Part 5: Free Tier Limits

### Elastic Beanstalk (Actually EC2 + other services)
- **750 hours/month** of t2.micro instance (free for 12 months)
- Use `--single` flag to stay in free tier
- Avoid load balancers (not free)

### S3
- **5 GB** storage (free forever)
- **20,000 GET requests** per month
- **2,000 PUT requests** per month

### Data Transfer
- **1 GB** out to internet per month (combined)
- Unlimited in

---

## Part 6: Cost Optimization Tips

1. **Delete unused resources**: Use `eb terminate` if testing
2. **Monitor usage**: AWS Free Tier Dashboard
3. **Set billing alerts**: AWS CloudWatch (set alert at $1)
4. **Use single instance**: Avoid multi-AZ or load balancers
5. **Stop when not testing**: `eb terminate` and redeploy later

---

## Part 7: Troubleshooting

### Backend Issues

**Problem**: Backend not starting
```bash
eb logs
```
Look for errors in logs.

**Problem**: Cannot connect to MongoDB
- Check environment variables are set correctly
- Verify MongoDB Atlas IP whitelist (add `0.0.0.0/0` to allow all)

**Problem**: CORS errors
```bash
eb setenv FRONTEND_URL="http://your-s3-url"
eb deploy
```

### Frontend Issues

**Problem**: Blank page
- Check browser console for API URL errors
- Verify `.env.production` has correct backend URL
- Rebuild and re-upload: `npm run build && aws s3 sync build/ s3://bucket-name`

**Problem**: 403 Forbidden
- Check bucket policy is applied
- Verify public access is not blocked

---

## Part 8: Updating Your Application

### Update Backend Code
```bash
cd backend
# Make your changes
git commit -am "Updated backend"
eb deploy
```

### Update Frontend Code
```bash
cd restaurant-frontend
# Make your changes
npm run build
aws s3 sync build/ s3://mian-taste-frontend --delete
```

---

## Part 9: Custom Domain (Optional - Not Free)

If you want to use your own domain:

1. **Register domain**: AWS Route 53 (~$12/year)
2. **Add CloudFront**: Point to S3 bucket (free tier: 50GB transfer)
3. **SSL Certificate**: AWS Certificate Manager (FREE)
4. **Update backend**: Add domain to CORS

---

## Part 10: MongoDB Atlas Setup (Reminder)

Your MongoDB is already on Atlas, but ensure:

1. **Network Access**:
   - Go to MongoDB Atlas Dashboard
   - Network Access → Add IP Address
   - Add `0.0.0.0/0` (allows access from anywhere - needed for EB)

2. **Database User**:
   - Database Access
   - Verify user `isurusajan9` has read/write permissions

---

## Quick Deployment Checklist

- [ ] Install AWS CLI and EB CLI
- [ ] Configure AWS credentials
- [ ] Navigate to backend folder
- [ ] Run `eb init`
- [ ] Run `eb create mian-taste-prod --single`
- [ ] Set environment variables with `eb setenv`
- [ ] Get backend URL from `eb status`
- [ ] Update frontend `.env.production` with backend URL
- [ ] Build frontend with `npm run build`
- [ ] Create S3 bucket
- [ ] Enable static hosting on S3
- [ ] Make bucket public
- [ ] Upload build to S3
- [ ] Update backend with frontend URL
- [ ] Test both frontend and backend

---

## Support & Resources

- **AWS Free Tier**: https://aws.amazon.com/free/
- **EB CLI Docs**: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html
- **S3 Static Hosting**: https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html

---

## Need Help?

If you encounter issues:
1. Check AWS Free Tier usage dashboard
2. Review EB logs: `eb logs`
3. Check browser console for frontend errors
4. Verify environment variables are set correctly
